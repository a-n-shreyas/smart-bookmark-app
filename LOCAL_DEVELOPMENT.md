# Local Development Guide

## Prerequisites Installation

### 1. Install Node.js
- Download from https://nodejs.org
- Recommended: Version 18 LTS or higher
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### 2. Install Git
- Download from https://git-scm.com
- Verify installation:
  ```bash
  git --version
  ```

## Project Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd smart-bookmark-app

# Install dependencies
npm install
```

### 2. Environment Variables

Create `.env.local` file in root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from Supabase Dashboard → Settings → API

### 3. Configure Google OAuth for Localhost

In Google Cloud Console, add this redirect URI:
```
http://localhost:3000/auth/callback
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Development Workflow

### Making Changes

1. **Edit Components**: Files in `/components`
2. **Edit Pages**: Files in `/app`
3. **Edit Styles**: Tailwind classes or `/app/globals.css`
4. **Hot Reload**: Changes appear automatically

### Testing Real-time

1. Open http://localhost:3000 in two tabs
2. Sign in with same Google account
3. Add bookmark in one tab
4. Watch it appear in the other tab

### Debugging

**Enable React DevTools**:
- Install React Developer Tools browser extension
- Open DevTools → Components tab

**Check Supabase Connection**:
```typescript
// Add to any component temporarily
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
```

**Check Auth State**:
```typescript
const { data: { user } } = await supabase.auth.getUser()
console.log('Current user:', user)
```

**Check Realtime Connection**:
```typescript
const channel = supabase.channel('test')
channel.subscribe((status) => {
  console.log('Realtime status:', status)
})
```

## Common Development Tasks

### Add New Component

```bash
# Create file
touch components/NewComponent.tsx
```

```typescript
'use client'

export default function NewComponent() {
  return <div>New Component</div>
}
```

### Add New API Route

```bash
# Create directory and file
mkdir -p app/api/my-route
touch app/api/my-route/route.ts
```

```typescript
export async function GET() {
  return Response.json({ message: 'Hello' })
}
```

### Add New Page

```bash
# Create directory
mkdir -p app/about
touch app/about/page.tsx
```

Visit http://localhost:3000/about

### Update Database Schema

1. Go to Supabase SQL Editor
2. Write migration:
```sql
-- Add new column
alter table bookmarks add column description text;
```
3. Update TypeScript types in your code

### Style with Tailwind

```typescript
// Hover effects
<button className="hover:bg-blue-700">

// Responsive design
<div className="md:flex md:flex-row">

// Dark mode (if enabled)
<div className="dark:bg-gray-800">
```

## Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npx tsc --noEmit

# Lint code
npm run lint

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install
```

## Debugging Checklist

### App Won't Start
- [ ] Node.js installed (v18+)
- [ ] Dependencies installed (`npm install`)
- [ ] No port conflicts (3000 in use)

### Authentication Not Working
- [ ] `.env.local` exists with correct values
- [ ] Google OAuth redirect URI includes localhost
- [ ] Supabase project is active

### Bookmarks Not Saving
- [ ] Signed in successfully
- [ ] Supabase table created
- [ ] RLS policies enabled
- [ ] Browser console shows no errors

### Real-time Not Working
- [ ] Realtime enabled in Supabase
- [ ] WebSocket connection successful (check Network tab)
- [ ] User IDs match between tabs

## Editor Setup

### VS Code Extensions (Recommended)

- **ES7+ React/Redux/React-Native snippets**: Quick component templates
- **Tailwind CSS IntelliSense**: Autocomplete for Tailwind classes
- **Prettier**: Code formatting
- **ESLint**: Code linting

### VS Code Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## Project Structure Explained

```
smart-bookmark-app/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   ├── auth/                 # Auth routes
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout (wraps all pages)
│   └── page.tsx              # Home page (/)
│
├── components/               # React components
│   ├── BookmarkList.tsx      # Main bookmark UI + real-time
│   ├── GoogleSignIn.tsx      # Sign in button
│   └── SignOutButton.tsx     # Sign out button
│
├── lib/                      # Utilities
│   └── supabase/             # Supabase clients
│       ├── client.ts         # Browser client
│       └── server.ts         # Server client
│
├── middleware.ts             # Auth middleware (runs on every request)
├── .env.local               # Environment variables (not in git)
├── .env.local.example       # Template for env vars
├── next.config.js           # Next.js configuration
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind configuration
└── tsconfig.json            # TypeScript configuration
```

## Performance Tips

### Optimize Images
```typescript
import Image from 'next/image'

<Image 
  src="/image.jpg" 
  alt="Description" 
  width={500} 
  height={300}
/>
```

### Lazy Load Components
```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'))
```

### Memoize Expensive Calculations
```typescript
import { useMemo } from 'react'

const sortedBookmarks = useMemo(
  () => bookmarks.sort((a, b) => a.title.localeCompare(b.title)),
  [bookmarks]
)
```

## Getting Help

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Tailwind Docs**: https://tailwindcss.com/docs
- **TypeScript Docs**: https://www.typescriptlang.org/docs

## Next Steps

1. Try modifying the UI in `components/BookmarkList.tsx`
2. Add a search feature
3. Add bookmark categories
4. Implement edit functionality
5. Add bookmark favicons

Happy coding! 🚀
