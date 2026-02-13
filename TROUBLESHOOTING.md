# Troubleshooting Guide - Smart Bookmark App

## Quick Fixes (Try These First)

1. **Clear browser cache and cookies**
2. **Check browser console for errors** (F12 → Console tab)
3. **Verify environment variables** are set correctly
4. **Restart development server** (`Ctrl+C` then `npm run dev`)
5. **Check Supabase project status** (not paused/suspended)

## Common Issues & Solutions

### 🔴 Authentication Issues

#### "OAuth Error" or "Invalid Redirect URI"

**Symptoms**: Redirected to error page after clicking "Sign in with Google"

**Causes & Solutions**:

1. **Mismatch in redirect URIs**
   ```
   ❌ Google Console has: http://localhost:3000/callback
   ✅ Should be: http://localhost:3000/auth/callback
   ```
   
2. **Missing Supabase callback URI in Google Console**
   ```
   Required URIs:
   - http://localhost:3000/auth/callback (for local)
   - https://<project-ref>.supabase.co/auth/v1/callback
   - https://<your-app>.vercel.app/auth/callback (for production)
   ```

3. **Google OAuth not enabled in Supabase**
   - Go to Supabase → Authentication → Providers
   - Enable Google
   - Add Client ID and Secret

**How to verify**:
```bash
# Check environment variables
cat .env.local

# Should see:
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

#### "Session Expired" or "Not Authenticated"

**Symptoms**: Randomly logged out, can't perform actions

**Solutions**:

1. **Clear cookies**
   - Browser DevTools → Application → Cookies
   - Delete all cookies for your domain
   - Sign in again

2. **Check middleware is running**
   ```typescript
   // In middleware.ts, temporarily add:
   console.log('Middleware running for:', request.url)
   ```

3. **Verify cookie settings**
   - Cookies must be httpOnly and secure (in production)
   - Check browser DevTools → Application → Cookies
   - Should see auth tokens with httpOnly flag

#### "Could not verify user"

**Symptoms**: After OAuth callback, user is undefined

**Solutions**:

1. **Check callback route**
   ```typescript
   // File: app/auth/callback/route.ts
   // Verify it has:
   await supabase.auth.exchangeCodeForSession(code)
   ```

2. **Verify Supabase URL**
   ```bash
   # Should start with https://
   echo $NEXT_PUBLIC_SUPABASE_URL
   ```

3. **Check for multiple Supabase clients**
   - Use server client for server components
   - Use browser client for client components

---

### 🔴 Database Issues

#### "Failed to add bookmark"

**Symptoms**: Click "Add Bookmark", shows error

**Diagnosis**:
1. Open browser console (F12)
2. Look for specific error message

**Common causes**:

1. **RLS policies not set**
   ```sql
   -- Run in Supabase SQL Editor:
   SELECT * FROM pg_policies WHERE tablename = 'bookmarks';
   
   -- Should return 3 policies (SELECT, INSERT, DELETE)
   -- If not, run supabase-schema.sql again
   ```

2. **Not authenticated**
   ```typescript
   // Add this to check auth:
   const { data: { user } } = await supabase.auth.getUser()
   console.log('Current user:', user)
   // Should NOT be null
   ```

3. **Invalid data**
   - Check URL format (must include https://)
   - Check title is not empty

**Quick fix**:
```bash
# Disable RLS temporarily to test (DEV ONLY!)
# In Supabase SQL Editor:
ALTER TABLE bookmarks DISABLE ROW LEVEL SECURITY;

# If this works, problem is with RLS policies
# Re-enable and fix policies:
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
```

#### "Cannot read property 'id' of null"

**Symptoms**: Crash when trying to list bookmarks

**Solution**:
```typescript
// In BookmarkList component, ensure:
const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks || [])
//                                                      Add this ^^^^^^^^^^
```

#### "Violates foreign key constraint"

**Symptoms**: Error when adding bookmark with user_id

**Solutions**:

1. **User doesn't exist in auth.users**
   ```sql
   -- Check if user exists:
   SELECT * FROM auth.users WHERE id = 'user-id-here';
   ```

2. **Wrong user_id format**
   ```typescript
   // Ensure user_id is a UUID string, not an object
   console.log(typeof userId) // Should be 'string'
   ```

---

### 🔴 Real-time Issues

#### "Bookmarks not updating in other tabs"

**Symptoms**: Add bookmark in Tab 1, doesn't appear in Tab 2

**Diagnosis checklist**:
- [ ] Realtime enabled in Supabase (Database → Replication)
- [ ] Same user in both tabs
- [ ] WebSocket connection active (Network tab → WS)
- [ ] No console errors in either tab

**Solutions**:

1. **Enable Realtime in Supabase**
   - Dashboard → Database → Replication
   - Find "bookmarks" table
   - Toggle "Realtime" to ON
   - Click "0 active extensions" → Enable Realtime

2. **Check WebSocket connection**
   ```typescript
   // In BookmarkList.tsx, add:
   const channel = supabase.channel('bookmarks-changes')
   channel.subscribe((status) => {
     console.log('Realtime status:', status)
     // Should show 'SUBSCRIBED'
   })
   ```

3. **Verify filter in subscription**
   ```typescript
   // Must filter by user_id:
   filter: `user_id=eq.${userId}`
   // NOT: filter: `user_id=${userId}`
   ```

4. **Check for subscription cleanup**
   ```typescript
   // useEffect must return cleanup function:
   return () => {
     if (channel) {
       supabase.removeChannel(channel)
     }
   }
   ```

**Test Realtime manually**:
```sql
-- In Supabase SQL Editor, run:
INSERT INTO bookmarks (url, title, user_id)
VALUES ('https://test.com', 'Test', 'your-user-id');

-- Should appear in your app immediately
```

#### "WebSocket connection failed"

**Symptoms**: Real-time subscriptions fail to connect

**Solutions**:

1. **Check browser console**
   - Look for "WebSocket connection to wss://... failed"
   - Check if blocked by firewall/antivirus

2. **Verify Supabase project URL**
   ```javascript
   // Should be wss:// not ws://
   console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
   ```

3. **Check corporate network**
   - Some networks block WebSockets
   - Try on mobile hotspot
   - Check with network admin

---

### 🔴 Deployment Issues

#### "Application Error" on Vercel

**Symptoms**: App works locally, fails on Vercel

**Solutions**:

1. **Check build logs**
   - Vercel Dashboard → Deployments → Click deployment → Logs
   - Look for specific error

2. **Environment variables missing**
   ```
   Vercel Dashboard → Settings → Environment Variables
   Must have:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   
   After adding, redeploy!
   ```

3. **OAuth redirect URI not updated**
   - Google Console → Credentials
   - Add: https://your-app.vercel.app/auth/callback

#### "This site can't be reached"

**Symptoms**: Vercel deployment succeeds, but can't access URL

**Solutions**:

1. **Wait 1-2 minutes** - DNS propagation
2. **Check deployment status** - Should be "Ready"
3. **Try accessing different URL**:
   - Vercel provides multiple URLs
   - Try the .vercel.app domain

#### "Too Many Redirects"

**Symptoms**: OAuth login redirects infinitely

**Solutions**:

1. **Check middleware.ts**
   ```typescript
   // Ensure it's not blocking /auth/callback
   export const config = {
     matcher: [
       '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
     ],
   }
   ```

2. **Clear cookies and try again**

3. **Check for conflicting redirects**
   - Remove any custom redirect logic
   - Let Supabase handle OAuth flow

---

### 🔴 Development Environment Issues

#### "npm install" fails

**Symptoms**: Errors during dependency installation

**Solutions**:

1. **Clear npm cache**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Use correct Node version**
   ```bash
   node --version  # Should be 18 or higher
   
   # Install nvm and switch version:
   nvm install 18
   nvm use 18
   ```

3. **Check package.json**
   - Ensure all dependencies have version numbers
   - No syntax errors

#### "Port 3000 is already in use"

**Solutions**:

1. **Kill process on port 3000**
   ```bash
   # Mac/Linux:
   lsof -ti:3000 | xargs kill -9
   
   # Windows:
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. **Use different port**
   ```bash
   PORT=3001 npm run dev
   ```

#### "Module not found" errors

**Symptoms**: Can't resolve imports

**Solutions**:

1. **Install missing dependencies**
   ```bash
   npm install
   ```

2. **Check import paths**
   ```typescript
   // Use @ alias for root imports:
   import { createClient } from '@/lib/supabase/client'
   // NOT: import { createClient } from '../../lib/supabase/client'
   ```

3. **Verify tsconfig.json paths**
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./*"]
       }
     }
   }
   ```

---

### 🔴 UI/UX Issues

#### "Styles not applying"

**Solutions**:

1. **Rebuild Tailwind**
   ```bash
   rm -rf .next
   npm run dev
   ```

2. **Check class names**
   ```typescript
   // Use Tailwind's core classes:
   className="bg-blue-500"  // ✅
   className="background-blue"  // ❌
   ```

3. **Check tailwind.config.js content**
   ```javascript
   content: [
     './app/**/*.{js,ts,jsx,tsx}',
     './components/**/*.{js,ts,jsx,tsx}',
   ],
   ```

#### "Form not submitting"

**Solutions**:

1. **Check for preventDefault**
   ```typescript
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault()  // Must have this!
     // ...
   }
   ```

2. **Check button type**
   ```typescript
   <button type="submit">  // Not type="button"
   ```

3. **Check form validation**
   - Required fields filled
   - Valid URL format

---

## Advanced Debugging

### Enable Debug Logging

Add to `.env.local`:
```env
NEXT_PUBLIC_DEBUG=true
```

Then in components:
```typescript
if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
  console.log('Debug info:', data)
}
```

### Check Supabase Logs

1. Supabase Dashboard → Logs
2. Filter by "postgres" or "auth"
3. Look for errors or unusual patterns

### Network Tab Analysis

1. F12 → Network
2. Filter by "XHR" or "Fetch"
3. Check:
   - Status codes (should be 200)
   - Response times
   - Request payloads

### React DevTools

1. Install React Developer Tools extension
2. F12 → Components tab
3. Inspect component props and state
4. Look for unexpected values

---

## Still Stuck?

### Before Asking for Help

Gather this information:

1. **Exact error message** (screenshot of console)
2. **Steps to reproduce**
3. **What you've tried**
4. **Environment**:
   - Browser version
   - Node version: `node --version`
   - OS
5. **Relevant code snippets**

### Where to Get Help

1. **Check documentation**:
   - Next.js: https://nextjs.org/docs
   - Supabase: https://supabase.com/docs
   - Vercel: https://vercel.com/docs

2. **Search existing issues**:
   - Next.js GitHub: github.com/vercel/next.js/issues
   - Supabase GitHub: github.com/supabase/supabase/issues

3. **Community forums**:
   - Supabase Discord: discord.supabase.com
   - Next.js Discord: nextjs.org/discord
   - Stack Overflow

### Emergency Reset

If nothing works, start fresh:

```bash
# 1. Backup your data
# Export bookmarks from Supabase if needed

# 2. Delete everything
rm -rf node_modules .next .env.local

# 3. Reinstall
npm install

# 4. Recreate .env.local with correct values

# 5. Clear browser data
# DevTools → Application → Clear storage

# 6. Try again
npm run dev
```

---

## Prevention Checklist

Prevent issues before they happen:

- [ ] Keep dependencies updated: `npm outdated`
- [ ] Use version control (git)
- [ ] Never commit `.env.local`
- [ ] Test in multiple browsers
- [ ] Monitor Supabase usage (avoid hitting limits)
- [ ] Check Vercel deployment logs regularly
- [ ] Keep backup of database schema
- [ ] Document any custom changes

---

**Remember**: Most issues are caused by configuration mismatches or missing environment variables. Always check these first! 🔍
