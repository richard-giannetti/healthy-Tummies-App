import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { TrendingUp, Award, Calendar, Target, Star, Trophy } from 'lucide-react'

interface UserProgress {
  id: string
  total_points: number
  current_streak: number
  longest_streak: number
  last_activity_date: string
  level_progress: number
  feeding_level: string
  achievements: string[]
}

interface ProgressStats {
  totalFoodsIntroduced: number
  totalRecipesTried: number
  weeklyActivity: number
  monthlyActivity: number
}

const ProgressPage = () => {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [stats, setStats] = useState<ProgressStats>({
    totalFoodsIntroduced: 0,
    totalRecipesTried: 0,
    weeklyActivity: 0,
    monthlyActivity: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProgressData()
  }, [])

  const loadProgressData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Load user progress
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setProgress(progressData)

      // Load statistics
      const [
        { data: introducedFoods },
        { data: recipeTries },
        { data: recentActivities }
      ] = await Promise.all([
        supabase.from('introduced_foods').select('*').eq('user_id', user.id),
        supabase.from('recipe_interactions').select('*').eq('user_id', user.id).eq('tried', true),
        supabase.from('user_activities').select('*').eq('user_id', user.id).gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      ])

      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const weeklyActivities = recentActivities?.filter(a => a.timestamp >= weekAgo) || []

      setStats({
        totalFoodsIntroduced: introducedFoods?.length || 0,
        totalRecipesTried: recipeTries?.length || 0,
        weeklyActivity: weeklyActivities.length,
        monthlyActivity: recentActivities?.length || 0,
      })

    } catch (error) {
      console.error('Error loading progress data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLevelInfo = (level: string) => {
    const levels = {
      'Curious Parent': { color: 'bg-blue-100 text-blue-800', progress: 20 },
      'Food Explorer': { color: 'bg-green-100 text-green-800', progress: 40 },
      'Nutrition Navigator': { color: 'bg-yellow-100 text-yellow-800', progress: 60 },
      'Feeding Expert': { color: 'bg-purple-100 text-purple-800', progress: 80 },
      'Baby Food Master': { color: 'bg-red-100 text-red-800', progress: 100 },
    }
    return levels[level as keyof typeof levels] || levels['Curious Parent']
  }

  const availableAchievements = [
    { id: 'first_food', name: 'First Food', description: 'Introduced your first food', icon: '🍎' },
    { id: 'week_streak', name: 'Week Warrior', description: '7-day tracking streak', icon: '📅' },
    { id: 'food_explorer', name: 'Food Explorer', description: 'Introduced 10 different foods', icon: '🌟' },
    { id: 'recipe_master', name: 'Recipe Master', description: 'Tried 5 recipes', icon: '👨‍🍳' },
    { id: 'consistent_tracker', name: 'Consistent Tracker', description: '30-day streak', icon: '🏆' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const levelInfo = getLevelInfo(progress?.feeding_level || 'Curious Parent')

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Your Progress</h1>
        <div className="text-sm text-muted-foreground">
          Track your baby feeding journey
        </div>
      </div>

      {/* Level and Points */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 border border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {progress?.total_points || 0} Points
            </h2>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${levelInfo.color}`}>
              {progress?.feeding_level || 'Curious Parent'}
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">Level Progress</div>
            <div className="w-32 bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress?.level_progress || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Target className="text-green-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {stats.totalFoodsIntroduced}
              </div>
              <div className="text-sm text-muted-foreground">Foods Introduced</div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Trophy className="text-orange-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {stats.totalRecipesTried}
              </div>
              <div className="text-sm text-muted-foreground">Recipes Tried</div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {progress?.current_streak || 0}
              </div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Star className="text-purple-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {progress?.longest_streak || 0}
              </div>
              <div className="text-sm text-muted-foreground">Longest Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex items-center space-x-3 mb-6">
          <Award className="text-yellow-600" size={24} />
          <h3 className="text-xl font-semibold text-foreground">Achievements</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableAchievements.map((achievement) => {
            const isEarned = progress?.achievements?.includes(achievement.id) || false
            
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border transition-all ${
                  isEarned 
                    ? 'bg-yellow-50 border-yellow-200 shadow-sm' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <h4 className={`font-medium ${
                      isEarned ? 'text-yellow-800' : 'text-gray-600'
                    }`}>
                      {achievement.name}
                    </h4>
                    <p className={`text-sm ${
                      isEarned ? 'text-yellow-700' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
                {isEarned && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full">
                      Earned
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex items-center space-x-3 mb-6">
          <Calendar className="text-blue-600" size={24} />
          <h3 className="text-xl font-semibold text-foreground">Activity Summary</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-foreground mb-3">This Week</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Activities</span>
                <span className="text-sm font-medium">{stats.weeklyActivity}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-3">This Month</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Activities</span>
                <span className="text-sm font-medium">{stats.monthlyActivity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressPage