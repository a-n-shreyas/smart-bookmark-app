# Architecture Overview - Smart Bookmark App

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Browser (React Components)               │  │
│  │                                                        │  │
│  │  ┌────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │  Sign In   │  │  Bookmark    │  │   Sign Out   │ │  │
│  │  │  Button    │  │     List     │  │    Button    │ │  │
│  │  └────────────┘  └──────────────┘  └──────────────┘ │  │
│  │                                                        │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │     Supabase Client (Browser)                   │  │  │
│  │  │  - Auth state management                        │  │  │
│  │  │  - Database operations (CRUD)                   │  │  │
│  │  │  - Real-time subscriptions                      │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                              │                               │
│                              │ HTTPS + WebSocket             │
│                              ▼                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        SERVER SIDE                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Next.js Server (Vercel)                    │  │
│  │                                                        │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Middleware (middleware.ts)                     │  │  │
│  │  │  - Auth token refresh on every request          │  │  │
│  │  │  - Cookie management                             │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │                                                        │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Server Components (app/page.tsx)               │  │  │
│  │  │  - Initial auth check                            │  │  │
│  │  │  - Fetch initial bookmarks                       │  │  │
│  │  │  - Server-side rendering                         │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │                                                        │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  API Routes                                      │  │  │
│  │  │  - /api/auth/signout                             │  │  │
│  │  │  - /auth/callback (OAuth callback)               │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │                                                        │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Supabase Client (Server)                        │  │  │
│  │  │  - Server-side auth operations                   │  │  │
│  │  │  - Cookie-based session management               │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                              │                               │
│                              │ HTTPS                         │
│                              ▼                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     SUPABASE BACKEND                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Authentication Service                      │  │
│  │  - Google OAuth integration                           │  │
│  │  - JWT token generation                               │  │
│  │  - Session management                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                              │                               │
│                              ▼                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          PostgreSQL Database                          │  │
│  │                                                        │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Table: bookmarks                               │  │  │
│  │  │  ┌──────────────────────────────────────────┐  │  │  │
│  │  │  │ id          (uuid, primary key)          │  │  │  │
│  │  │  │ created_at  (timestamp)                   │  │  │  │
│  │  │  │ url         (text)                        │  │  │  │
│  │  │  │ title       (text)                        │  │  │  │
│  │  │  │ user_id     (uuid, foreign key)          │  │  │  │
│  │  │  └──────────────────────────────────────────┘  │  │  │
│  │  │                                                 │  │  │
│  │  │  Row Level Security Policies:                  │  │  │
│  │  │  - SELECT: WHERE user_id = auth.uid()          │  │  │
│  │  │  - INSERT: WHERE user_id = auth.uid()          │  │  │
│  │  │  - DELETE: WHERE user_id = auth.uid()          │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                              │                               │
│                              ▼                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Realtime Service                              │  │
│  │  - WebSocket connections                              │  │
│  │  - Broadcast database changes                         │  │
│  │  - Filter by user_id                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      GOOGLE OAUTH                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  - OAuth 2.0 flow                                            │
│  - User consent screen                                       │
│  - Returns authorization code                                │
│  - Exchanged for access token                                │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### Authentication Flow

```
User                Browser              Next.js           Supabase         Google
 │                     │                    │                 │               │
 │  1. Click Sign In   │                    │                 │               │
 ├────────────────────>│                    │                 │               │
 │                     │  2. Start OAuth    │                 │               │
 │                     ├───────────────────>│                 │               │
 │                     │                    │ 3. Redirect     │               │
 │                     │                    ├────────────────>│               │
 │                     │                    │                 │ 4. Redirect   │
 │                     │                    │                 ├──────────────>│
 │                     │                    │                 │               │
 │  5. Select Google Account & Approve     │                 │               │
 │<────────────────────────────────────────────────────────────────────────>│
 │                     │                    │                 │               │
 │                     │ 6. Auth Code       │                 │ 7. Auth Code  │
 │                     │<───────────────────────────────────────────────────┤
 │                     │                    │                 │               │
 │                     │ 8. /auth/callback  │                 │               │
 │                     ├───────────────────>│                 │               │
 │                     │                    │ 9. Exchange code│               │
 │                     │                    ├────────────────>│               │
 │                     │                    │ 10. Session +   │               │
 │                     │                    │     JWT tokens  │               │
 │                     │                    │<────────────────┤               │
 │                     │ 11. Set cookies    │                 │               │
 │                     │    & redirect      │                 │               │
 │                     │<───────────────────┤                 │               │
 │                     │                    │                 │               │
 │  12. Authenticated! │                    │                 │               │
 │<────────────────────┤                    │                 │               │
```

### Add Bookmark Flow

```
User             Browser             Next.js Server         Supabase DB        Other Tabs
 │                  │                       │                     │                │
 │ 1. Fill form     │                       │                     │                │
 │  & submit        │                       │                     │                │
 ├─────────────────>│                       │                     │                │
 │                  │ 2. INSERT bookmark    │                     │                │
 │                  │  with user_id         │                     │                │
 │                  ├──────────────────────>│                     │                │
 │                  │                       │ 3. Check RLS policy │                │
 │                  │                       │  (user_id match)    │                │
 │                  │                       ├────────────────────>│                │
 │                  │                       │                     │                │
 │                  │                       │ 4. Insert record    │                │
 │                  │                       │<────────────────────┤                │
 │                  │                       │                     │                │
 │                  │ 5. Success response   │                     │                │
 │                  │<──────────────────────┤                     │                │
 │                  │                       │                     │                │
 │                  │ 6. Realtime event     │ 7. Broadcast        │                │
 │                  │   (postgres_changes)  │    INSERT event     │                │
 │                  │<──────────────────────┴─────────────────────┤                │
 │                  │                       │                     │                │
 │                  │                       │ 8. Realtime event   │                │
 │                  │                       │    (same INSERT)    │                │
 │                  │                       │                     ├───────────────>│
 │                  │                       │                     │                │
 │ 9. Show new      │                       │                     │ 10. Show new   │
 │    bookmark      │                       │                     │     bookmark   │
 │<─────────────────┤                       │                     │<───────────────┤
```

### Delete Bookmark Flow

```
User             Browser             Supabase DB            Other Tabs
 │                  │                     │                     │
 │ 1. Click Delete  │                     │                     │
 ├─────────────────>│                     │                     │
 │                  │ 2. DELETE bookmark  │                     │
 │                  │  WHERE id = X AND   │                     │
 │                  │  user_id = current  │                     │
 │                  ├────────────────────>│                     │
 │                  │                     │                     │
 │                  │ 3. Record deleted   │                     │
 │                  │<────────────────────┤                     │
 │                  │                     │                     │
 │                  │ 4. Realtime DELETE  │ 5. Broadcast        │
 │                  │    event            │    DELETE event     │
 │                  │<────────────────────┴────────────────────>│
 │                  │                     │                     │
 │ 6. Remove from   │                     │ 7. Remove from      │
 │    UI            │                     │    UI               │
 │<─────────────────┤                     │<────────────────────┤
```

## Component Tree

```
app/layout.tsx (Root Layout)
│
└─> app/page.tsx (Home Page - Server Component)
    │
    ├─> GoogleSignIn.tsx (Client Component)
    │   └─> Handles OAuth initiation
    │
    ├─> SignOutButton.tsx (Client Component)
    │   └─> Calls signout API
    │
    └─> BookmarkList.tsx (Client Component)
        │
        ├─> Form (Add bookmark)
        │   ├─> Title input
        │   ├─> URL input
        │   └─> Submit button
        │
        └─> Bookmark items (map)
            ├─> Title display
            ├─> URL link
            ├─> Created date
            └─> Delete button
```

## Security Architecture

### Row Level Security (RLS) Flow

```
┌─────────────────────────────────────────────────────┐
│              Database Request                        │
└─────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│     Extract JWT token from request                   │
│     Decode to get user_id (auth.uid())              │
└─────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│        Check RLS Policy for Operation                │
│                                                       │
│  SELECT: WHERE user_id = auth.uid()                  │
│  INSERT: WHERE user_id = auth.uid()                  │
│  DELETE: WHERE user_id = auth.uid()                  │
└─────────────────────────────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         ▼                         ▼
    ✅ ALLOW                    ❌ DENY
    Execute query              Return error
    Return results             403 Forbidden
```

### Authentication State Management

```
Client Side                        Server Side                    Database
    │                                  │                             │
    │ 1. Initial page load             │                             │
    ├─────────────────────────────────>│                             │
    │                                  │ 2. Check cookies             │
    │                                  │    for auth token            │
    │                                  │                             │
    │                                  │ 3. Validate token           │
    │                                  ├────────────────────────────>│
    │                                  │                             │
    │                                  │ 4. Return user data         │
    │                                  │<────────────────────────────┤
    │                                  │                             │
    │ 5. Render with user context      │                             │
    │<─────────────────────────────────┤                             │
    │                                  │                             │
    │ 6. Subsequent requests           │                             │
    │    include auth cookies          │                             │
    ├─────────────────────────────────>│                             │
    │                                  │                             │
```

## Deployment Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      Vercel Edge Network                      │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │               Global CDN & Edge Functions               │  │
│  │  - Static assets (JS, CSS, images)                      │  │
│  │  - Server-Side Rendering (SSR)                          │  │
│  │  - API Routes                                            │  │
│  │  - Middleware execution                                  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  Regions: Global (auto-scaled)                                │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    Supabase Infrastructure                    │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database                        │  │
│  │  - Primary instance                                     │  │
│  │  - Automatic backups                                    │  │
│  │  - Point-in-time recovery                               │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Realtime Server                            │  │
│  │  - WebSocket connections                                │  │
│  │  - Pub/sub for database changes                         │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Auth Service                               │  │
│  │  - OAuth provider integration                           │  │
│  │  - JWT token management                                 │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  Region: Selected during project creation                     │
└──────────────────────────────────────────────────────────────┘
```

## Technology Stack Deep Dive

### Frontend Stack
- **React 18**: Component-based UI
- **Next.js 14**: App Router, SSR, API routes
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling

### Backend Stack
- **Next.js API Routes**: Serverless functions
- **Supabase**: Backend-as-a-Service
  - PostgreSQL database
  - Realtime subscriptions
  - Authentication service
  - Row Level Security

### Deployment Stack
- **Vercel**: Edge hosting, CDN, serverless functions
- **GitHub**: Version control, CI/CD
- **Google Cloud**: OAuth provider

## Performance Characteristics

### Initial Load
1. HTML (Server-rendered) - ~50KB
2. JavaScript bundle - ~200KB (code-split)
3. CSS - ~10KB (Tailwind purged)
4. API request (initial bookmarks) - ~1-5KB

### Runtime Performance
- Bookmark add: ~200-500ms (network + DB)
- Bookmark delete: ~200-500ms (network + DB)
- Realtime update: <100ms (WebSocket)
- Auth check: ~50ms (cached)

### Scalability
- Horizontal: Vercel auto-scales Edge Functions
- Vertical: Supabase PostgreSQL (upgradeable plans)
- Real-time: Handles thousands of concurrent connections
- Database: Row-level isolation prevents bottlenecks

---

This architecture provides:
✅ Security (OAuth, RLS, HTTPS)
✅ Performance (SSR, Edge CDN, Realtime)
✅ Scalability (Serverless, Auto-scaling)
✅ Developer Experience (TypeScript, Hot Reload)
✅ User Experience (Real-time, Fast loads)
