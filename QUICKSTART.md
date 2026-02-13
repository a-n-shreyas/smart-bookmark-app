# 🚀 Quick Start - Smart Bookmark App

Get your app running in 15 minutes!

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- [ ] Node.js 18+ installed ([download](https://nodejs.org))
- [ ] A Supabase account ([sign up](https://supabase.com))
- [ ] A Google Cloud account ([sign up](https://console.cloud.google.com))
- [ ] A GitHub account ([sign up](https://github.com))
- [ ] A Vercel account ([sign up](https://vercel.com))

## ⚡ 5-Minute Local Setup

### 1. Install Dependencies (1 min)
```bash
cd smart-bookmark-app
npm install
```

### 2. Create Supabase Project (2 min)
1. Go to https://supabase.com → "New Project"
2. Wait for provisioning
3. Go to SQL Editor and paste contents of `supabase-schema.sql`
4. Click "Run"
5. Go to Database → Replication → Enable Realtime for `bookmarks` table

### 3. Set Up Google OAuth (2 min)
1. Go to https://console.cloud.google.com
2. Create project → APIs & Services → Credentials
3. Create OAuth Client ID (Web application)
4. Add redirect URI: `http://localhost:3000/auth/callback`
5. Copy Client ID and Secret

### 4. Configure Environment Variables (30 sec)
```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local with your values:
# - Get SUPABASE_URL and SUPABASE_ANON_KEY from Supabase Settings → API
```

### 5. Connect Google OAuth to Supabase (30 sec)
1. Supabase Dashboard → Authentication → Providers
2. Enable Google
3. Paste your Client ID and Secret

### 6. Run! (30 sec)
```bash
npm run dev
```

Open http://localhost:3000 🎉

## 🚀 Deploy to Vercel (10 min)

### 1. Push to GitHub (2 min)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-url>
git push -u origin main
```

### 2. Deploy on Vercel (3 min)
1. Go to https://vercel.com
2. Import GitHub repository
3. Add environment variables (same as .env.local)
4. Deploy!

### 3. Update Google OAuth (1 min)
Add your Vercel URL to Google OAuth redirect URIs:
```
https://your-app.vercel.app/auth/callback
```

### 4. Test (4 min)
1. Visit your Vercel URL
2. Sign in with Google
3. Add bookmarks
4. Open in another tab - watch real-time updates!

## 🎯 What You've Built

✅ Full-stack Next.js app with TypeScript  
✅ Google OAuth authentication  
✅ Real-time database with Supabase  
✅ Secure with Row Level Security  
✅ Deployed and live on the internet  
✅ Professional-grade architecture  

## 📚 Next Steps

- Read `README.md` for detailed documentation
- Check `LOCAL_DEVELOPMENT.md` for development tips
- Review `DEPLOYMENT.md` for production best practices
- Customize the UI and add features!

## 🆘 Need Help?

**Common Issues:**

❌ "Cannot find module" → Run `npm install`  
❌ "Invalid OAuth" → Check redirect URIs match exactly  
❌ "Failed to add bookmark" → Verify RLS policies are enabled  
❌ "Real-time not working" → Enable Realtime in Supabase  

**Still stuck?** Check the troubleshooting sections in:
- `README.md` (Problems Encountered section)
- `DEPLOYMENT.md` (Troubleshooting section)
- `LOCAL_DEVELOPMENT.md` (Debugging Checklist)

## 🎓 Learn More

This project demonstrates:
- Next.js 14 App Router
- Server Components vs Client Components
- Supabase Auth, Database, and Realtime
- Row Level Security (RLS)
- OAuth 2.0 flow
- TypeScript with React
- Tailwind CSS
- Vercel deployment

Each file is well-commented - read the code to learn!

---

**Ready to start?** Run `npm install` and follow the steps above!
