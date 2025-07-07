import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { User } from '@supabase/supabase-js'
import Navbar from '@/components/Navbar'
import HomePage from '@/pages/HomePage'
import BabyProfilePage from '@/pages/BabyProfilePage'
import FoodsPage from '@/pages/FoodsPage'
import RecipesPage from '@/pages/RecipesPage'
import ProgressPage from '@/pages/ProgressPage'
import AuthPage from '@/pages/AuthPage'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('App: Initializing auth...')
    
    const initializeAuth = async () => {
      try {
        // Get initial session
        console.log('App: Getting initial session...')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('App: Session error:', sessionError)
          setError(sessionError.message)
        } else {
          console.log('App: Session loaded:', session?.user?.email || 'No user')
          setUser(session?.user ?? null)
        }
      } catch (err) {
        console.error('App: Auth initialization error:', err)
        setError('Failed to initialize authentication')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    console.log('App: Setting up auth listener...')
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('App: Auth state changed:', event, session?.user?.email || 'No user')
      setUser(session?.user ?? null)
      setError(null) // Clear any previous errors
    })

    return () => {
      console.log('App: Cleaning up auth listener...')
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Error</h3>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar user={user} />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<BabyProfilePage />} />
            <Route path="/foods" element={<FoodsPage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/progress" element={<ProgressPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App