# Smart Bookmark App

A real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS. Users can sign in with Google OAuth, add bookmarks, and see updates in real-time across multiple tabs.

## Features

- ✅ Google OAuth authentication (no email/password required)
- ✅ Add bookmarks with URL and title
- ✅ Private bookmarks per user
- ✅ Real-time updates across multiple tabs/windows
- ✅ Delete bookmarks
- ✅ Deployed on Vercel

## Tech Stack

- **Next.js 14** (App Router)
- **Supabase** (Authentication, Database, Real-time)
- **Tailwind CSS** (Styling)
- **TypeScript**

## Prerequisites

- Node.js 18+ installed
- Supabase account
- Google Cloud Console account (for OAuth)
- Vercel account (for deployment)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd smart-bookmark-app
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned

#### 2.1 Create Database Table

Go to the SQL Editor in your Supabase dashboard and run this SQL:

```sql
-- Create bookmarks table
create table public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  url text not null,
  title text not null,
  user_id uuid references auth.users(id) on delete cascade not null
);

-- Enable Row Level Security
alter table public.bookmarks enable row level security;

-- Create policy: Users can only see their own bookmarks
create policy "Users can view their own bookmarks"
  on public.bookmarks
  for select
  using (auth.uid() = user_id);

-- Create policy: Users can insert their own bookmarks
create policy "Users can insert their own bookmarks"
  on public.bookmarks
  for insert
  with check (auth.uid() = user_id);

-- Create policy: Users can delete their own bookmarks
create policy "Users can delete their own bookmarks"
  on public.bookmarks
  for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index bookmarks_user_id_idx on public.bookmarks(user_id);
```

#### 2.2 Enable Realtime

1. Go to Database → Replication in your Supabase dashboard
2. Find the `bookmarks` table
3. Toggle "Realtime" to ON

### 3. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth client ID"
5. Select "Web application"
6. Add authorized redirect URIs:
   - For local development: `http://localhost:3000/auth/callback`
   - For production: `https://your-domain.vercel.app/auth/callback`
   - **Important**: Also add your Supabase callback URL: `https://<your-project-ref>.supabase.co/auth/v1/callback`
7. Save the Client ID and Client Secret

#### 3.1 Configure Google OAuth in Supabase

1. Go to Authentication → Providers in Supabase dashboard
2. Find Google and enable it
3. Enter your Google Client ID and Client Secret
4. Save changes

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these values from:
- Supabase Dashboard → Settings → API

### 5. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

### 6. Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

#### 6.1 Update Google OAuth Redirect URI

After deployment, update your Google OAuth credentials:
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Add your Vercel deployment URL to authorized redirect URIs: `https://your-app.vercel.app/auth/callback`

## Project Structure

```
smart-bookmark-app/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── signout/
│   │           └── route.ts          # Sign out API route
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts              # OAuth callback handler
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Main page
├── components/
│   ├── BookmarkList.tsx              # Bookmark list with real-time updates
│   ├── GoogleSignIn.tsx              # Google sign-in button
│   └── SignOutButton.tsx             # Sign out button
├── lib/
│   └── supabase/
│       ├── client.ts                 # Browser Supabase client
│       └── server.ts                 # Server Supabase client
├── middleware.ts                     # Auth middleware
├── .env.local.example                # Environment variables template
├── next.config.js                    # Next.js configuration
├── package.json                      # Dependencies
├── tailwind.config.js                # Tailwind configuration
└── tsconfig.json                     # TypeScript configuration
```

## Problems Encountered and Solutions

### Problem 1: Real-time Updates Not Working Initially

**Issue**: When adding a bookmark in one tab, it wasn't appearing in another tab without refresh.

**Solution**: 
- Ensured Realtime was enabled for the `bookmarks` table in Supabase dashboard
- Set up proper Postgres changes subscription with correct filter: `filter: 'user_id=eq.${userId}'`
- Used the channel subscription pattern correctly with proper cleanup in useEffect

### Problem 2: OAuth Callback 404 Error

**Issue**: After Google authentication, users were getting redirected to a 404 page.

**Solution**:
- Created the correct callback route at `app/auth/callback/route.ts`
- Ensured the redirect URI in Google OAuth settings matched exactly: `/auth/callback`
- Added proper code exchange logic using `exchangeCodeForSession`

### Problem 3: Cookie Handling in Server Components

**Issue**: Authentication state wasn't persisting properly across page loads.

**Solution**:
- Implemented proper middleware.ts to refresh auth sessions
- Used separate client and server Supabase clients with proper cookie handling
- Added async/await to cookies() call in server components as per Next.js 15 requirements

### Problem 4: Row Level Security Blocking Operations

**Issue**: Users couldn't add or delete bookmarks even when authenticated.

**Solution**:
- Created specific RLS policies for SELECT, INSERT, and DELETE operations
- Made sure all policies checked `auth.uid() = user_id`
- Verified policies in Supabase dashboard under Authentication → Policies

### Problem 5: TypeScript Type Errors with Supabase SSR

**Issue**: Getting type errors with cookie options in server client setup.

**Solution**:
- Updated to use `@supabase/ssr` package instead of older auth helpers
- Used proper `CookieOptions` type from the SSR package
- Implemented try-catch blocks for cookie operations that might fail in Server Components

### Problem 6: Vercel Deployment Environment Variables

**Issue**: App worked locally but failed on Vercel with authentication errors.

**Solution**:
- Added all environment variables in Vercel project settings
- Made sure variable names matched exactly (including `NEXT_PUBLIC_` prefix)
- Redeployed after adding variables

## Testing the Real-time Feature

1. Open the app in two different browser tabs (or two different browsers)
2. Sign in with the same Google account in both
3. Add a bookmark in one tab
4. Watch it appear immediately in the other tab without refreshing
5. Delete a bookmark in one tab and watch it disappear in the other

## Security Features

- Row Level Security (RLS) ensures users can only access their own bookmarks
- Google OAuth provides secure authentication without password management
- Server-side session validation via middleware
- Secure cookie handling for authentication tokens

## Future Enhancements

- Add bookmark categories/tags
- Search and filter bookmarks
- Edit bookmark functionality
- Import/export bookmarks
- Bookmark sharing between users
- Browser extension for quick bookmark adding

## License

MIT

## Support

If you encounter any issues, please check:
1. Supabase project is running and accessible
2. Google OAuth credentials are correctly configured
3. Environment variables are set properly
4. Realtime is enabled for the bookmarks table
5. RLS policies are active
