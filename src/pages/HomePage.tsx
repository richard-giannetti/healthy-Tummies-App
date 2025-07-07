import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Baby, Apple, ChefHat, TrendingUp, Lightbulb } from 'lucide-react'
import { Link } from 'react-router-dom'

interface DashboardStats {
  totalFoods: number
  introducedFoods: number
  favoriteRecipes: number
  currentStreak: number
}

interface Tip {
  tip_id: number
  tip_title: string
  tip_description: string
  tip_age: string
}

const HomePage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalFoods: 0,
    introducedFoods: 0,
    favoriteRecipes: 0,
    currentStreak: 0,
  })
  const [todayTip, setTodayTip] = useState<Tip | null>(null)
  const [babyProfile, setBabyProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Load baby profile
      const { data: profile } = await supabase
        .from('baby_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      setBabyProfile(profile)

      // Load stats
      const [
        { count: totalFoods },
        { data: introducedFoods },
        { data: favoriteRecipes },
        { data: userProgress },
        { data: tips }
      ] = await Promise.all([
        supabase.from('foods').select('*', { count: 'exact', head: true }),
        supabase.from('introduced_foods').select('*').eq('user_id', user.id),
        supabase.from('recipe_favorites').select('*').eq('user_id', user.id),
        supabase.from('user_progress').select('*').eq('user_id', user.id).single(),
        supabase.from('tips').select('*').limit(1)
      ])

      setStats({
        totalFoods: totalFoods || 0,
        introducedFoods: introducedFoods?.length || 0,
        favoriteRecipes: favoriteRecipes?.length || 0,
        currentStreak: userProgress?.current_streak || 0,
      })

      if (tips && tips.length > 0) {
        const randomTip = tips[Math.floor(Math.random() * tips.length)]
        setTodayTip(randomTip)
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const dashboardCards = [
    {
      title: 'Baby Profile',
      description: babyProfile ? `${babyProfile.name}'s profile` : 'Set up baby profile',
      icon: Baby,
      link: '/profile',
      color: 'bg-blue-500/10 text-blue-600',
      value: babyProfile ? '✓' : '!',
    },
    {
      title: 'Foods Introduced',
      description: `${stats.introducedFoods} of ${stats.totalFoods} foods`,
      icon: Apple,
      link: '/foods',
      color: 'bg-green-500/10 text-green-600',
      value: stats.introducedFoods,
    },
    {
      title: 'Favorite Recipes',
      description: 'Saved recipes',
      icon: ChefHat,
      link: '/recipes',
      color: 'bg-orange-500/10 text-orange-600',
      value: stats.favoriteRecipes,
    },
    {
      title: 'Current Streak',
      description: 'Days of consistent tracking',
      icon: TrendingUp,
      link: '/progress',
      color: 'bg-purple-500/10 text-purple-600',
      value: stats.currentStreak,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Welcome Back! 👶
        </h1>
        <p className="text-xl text-muted-foreground">
          {babyProfile 
            ? `Track ${babyProfile.name}'s food journey` 
            : 'Start tracking your baby\'s food journey'
          }
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="bg-card rounded-lg p-6 border border-border hover:shadow-lg transition-all duration-200 hover:scale-105 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon size={24} />
              </div>
              <span className="text-2xl font-bold text-foreground">
                {card.value}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              {card.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {card.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Daily Tip */}
      {todayTip && (
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 border border-primary/20">
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Lightbulb className="text-primary" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                💡 Tip of the Day
              </h3>
              <h4 className="font-medium text-foreground mb-1">
                {todayTip.tip_title}
              </h4>
              <p className="text-muted-foreground">
                {todayTip.tip_description}
              </p>
              {todayTip.tip_age && (
                <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  Age: {todayTip.tip_age}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/foods"
            className="flex items-center space-x-3 p-4 bg-background rounded-lg border border-border hover:bg-accent transition-colors"
          >
            <Apple className="text-green-600" size={20} />
            <span className="font-medium">Introduce New Food</span>
          </Link>
          <Link
            to="/recipes"
            className="flex items-center space-x-3 p-4 bg-background rounded-lg border border-border hover:bg-accent transition-colors"
          >
            <ChefHat className="text-orange-600" size={20} />
            <span className="font-medium">Browse Recipes</span>
          </Link>
          <Link
            to="/profile"
            className="flex items-center space-x-3 p-4 bg-background rounded-lg border border-border hover:bg-accent transition-colors"
          >
            <Baby className="text-blue-600" size={20} />
            <span className="font-medium">Update Profile</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage