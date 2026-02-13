import { createClient } from '@/lib/supabase/server'
import GoogleSignIn from '@/components/GoogleSignIn'
import BookmarkList from '@/components/BookmarkList'
import SignOutButton from '@/components/SignOutButton'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Smart Bookmark App
          </h1>
          <p className="text-gray-600 mb-8">
            Sign in with Google to manage your bookmarks
          </p>
          <GoogleSignIn />
        </div>
      </main>
    )
  }

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Smart Bookmark App
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome, {user.email}
            </p>
          </div>
          <SignOutButton />
        </div>
        
        <BookmarkList 
          initialBookmarks={bookmarks || []} 
          userId={user.id}
        />
      </div>
    </main>
  )
}
