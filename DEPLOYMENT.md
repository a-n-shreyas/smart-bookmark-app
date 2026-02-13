# Deployment Guide - Smart Bookmark App

## Quick Deployment Checklist

- [ ] Supabase project created
- [ ] Database table created and Realtime enabled
- [ ] Google OAuth credentials created
- [ ] Google OAuth configured in Supabase
- [ ] Code pushed to GitHub
- [ ] Vercel project created and deployed
- [ ] Environment variables added to Vercel
- [ ] Google OAuth redirect URIs updated with Vercel URL
- [ ] Tested login and bookmark operations

## Step-by-Step Deployment

### 1. Supabase Setup (5 minutes)

1. Go to https://supabase.com and create account
2. Click "New Project"
3. Fill in project details:
   - Name: smart-bookmark-app
   - Database Password: (generate strong password)
   - Region: Choose closest to your users
4. Wait for project provisioning (~2 minutes)

5. **Create Database Table**:
   - Go to SQL Editor
   - Copy contents of `supabase-schema.sql`
   - Click "Run"
   - Verify success message

6. **Enable Realtime**:
   - Go to Database → Replication
   - Find `bookmarks` table
   - Toggle Realtime to ON

7. **Get API Credentials**:
   - Go to Settings → API
   - Copy "Project URL" (starts with https://)
   - Copy "anon public" key
   - Save these for later

### 2. Google OAuth Setup (10 minutes)

1. Go to https://console.cloud.google.com
2. Create new project: "Smart Bookmark App"
3. Wait for project creation

4. **Enable Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

5. **Create OAuth Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Configure consent screen (if prompted):
     - User Type: External
     - App name: Smart Bookmark App
     - User support email: your email
     - Developer contact: your email
   - Application type: Web application
   - Name: Smart Bookmark App OAuth
   
6. **Add Redirect URIs**:
   ```
   http://localhost:3000/auth/callback
   https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
   ```
   Note: You'll add Vercel URL later

7. **Save Credentials**:
   - Copy Client ID
   - Copy Client Secret

8. **Configure in Supabase**:
   - Go to your Supabase dashboard
   - Authentication → Providers
   - Enable Google
   - Paste Client ID and Client Secret
   - Save

### 3. GitHub Setup (2 minutes)

1. Create new repository on GitHub
2. Initialize git in your project:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Smart Bookmark App"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

### 4. Vercel Deployment (5 minutes)

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

6. **Add Environment Variables**:
   Click "Environment Variables" and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

7. Click "Deploy"
8. Wait for deployment (~2 minutes)
9. Copy your deployment URL (e.g., https://smart-bookmark-app.vercel.app)

### 5. Update Google OAuth (2 minutes)

1. Go back to Google Cloud Console
2. Go to "APIs & Services" → "Credentials"
3. Click your OAuth client ID
4. Add new redirect URI:
   ```
   https://your-app.vercel.app/auth/callback
   ```
5. Save

### 6. Testing (3 minutes)

1. Visit your Vercel URL
2. Click "Sign in with Google"
3. Authorize the app
4. Try adding a bookmark
5. Open the same URL in a different tab
6. Add another bookmark and watch it appear in both tabs
7. Try deleting a bookmark

## Troubleshooting

### "Invalid OAuth callback URL"
- Make sure redirect URI in Google Console exactly matches your callback route
- Include both Supabase and Vercel URLs
- No trailing slashes

### "Failed to add bookmark"
- Check Supabase RLS policies are enabled
- Verify you're signed in
- Check browser console for errors

### "Real-time updates not working"
- Ensure Realtime is enabled in Supabase for bookmarks table
- Check browser console for WebSocket errors
- Verify Supabase project is not paused

### Vercel deployment fails
- Check all environment variables are set
- Verify build logs for specific errors
- Make sure package.json dependencies are correct

### 401 Unauthorized errors
- Verify environment variables in Vercel match your Supabase project
- Redeploy after adding environment variables
- Check Supabase project status

## Post-Deployment

### Monitor Your App
- Vercel Dashboard: Monitor deployments and errors
- Supabase Dashboard: Monitor database and auth usage
- Google Cloud Console: Monitor OAuth usage

### Update Instructions
```bash
git add .
git commit -m "Update description"
git push
```
Vercel will automatically redeploy.

## Production Checklist

- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Google OAuth production consent screen approved (if public)
- [ ] Supabase project on appropriate plan
- [ ] Error monitoring set up
- [ ] Database backups enabled (automatic with Supabase)

## Support Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)

## Estimated Total Time: ~30 minutes

Most time is spent waiting for project provisioning and reviewing documentation. The actual configuration steps are quick.
