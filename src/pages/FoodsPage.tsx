import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Search, Apple, Check, Plus, Filter, AlertTriangle } from 'lucide-react'

interface Food {
  _id: string
  name: string
  ageSuggestion: string | null
  allergenInfo: string | null
  chokingHazardInfo: string | null
  commonAllergen: string | null
  foodType: string | null
  healthBenefits: string | null
  Image: string | null
  introductionSummary: string | null
  ironRich: string | null
  servingSuggestion6Months: string | null
  servingSuggestion12Months: string | null
  servingSuggestion3Years: string | null
}

interface IntroducedFood {
  id: string
  food_id: string
  introduced_date: string
  notes: string | null
}

const FoodsPage = () => {
  const [foods, setFoods] = useState<Food[]>([])
  const [introducedFoods, setIntroducedFoods] = useState<IntroducedFood[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showIntroducedOnly, setShowIntroducedOnly] = useState(false)

  useEffect(() => {
    loadFoods()
    loadIntroducedFoods()
  }, [])

  const loadFoods = async () => {
    try {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .order('name')

      if (error) throw error
      setFoods(data || [])
    } catch (error) {
      console.error('Error loading foods:', error)
    }
  }

  const loadIntroducedFoods = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('introduced_foods')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error
      setIntroducedFoods(data || [])
    } catch (error) {
      console.error('Error loading introduced foods:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFoodIntroduction = async (food: Food) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get baby profile
      const { data: profile } = await supabase
        .from('baby_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!profile) {
        alert('Please create a baby profile first!')
        return
      }

      const isIntroduced = introducedFoods.some(f => f.food_id === food._id)

      if (isIntroduced) {
        // Remove from introduced foods
        const { error } = await supabase
          .from('introduced_foods')
          .delete()
          .eq('user_id', user.id)
          .eq('food_id', food._id)

        if (error) throw error
        setIntroducedFoods(prev => prev.filter(f => f.food_id !== food._id))
      } else {
        // Add to introduced foods
        const { data, error } = await supabase
          .from('introduced_foods')
          .insert({
            user_id: user.id,
            baby_profile_id: profile.id,
            food_id: food._id,
            introduced_date: new Date().toISOString().split('T')[0]
          })
          .select()
          .single()

        if (error) throw error
        setIntroducedFoods(prev => [...prev, data])
      }
    } catch (error) {
      console.error('Error toggling food introduction:', error)
    }
  }

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || food.foodType === selectedCategory
    const isIntroduced = introducedFoods.some(f => f.food_id === food._id)
    const matchesIntroducedFilter = !showIntroducedOnly || isIntroduced

    return matchesSearch && matchesCategory && matchesIntroducedFilter
  })

  const categories = [...new Set(foods.map(food => food.foodType).filter(Boolean))]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Foods</h1>
        <div className="text-sm text-muted-foreground">
          {introducedFoods.length} of {foods.length} foods introduced
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg p-4 border border-border space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search foods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showIntroducedOnly}
              onChange={(e) => setShowIntroducedOnly(e.target.checked)}
              className="rounded border-input text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">Introduced only</span>
          </label>
        </div>
      </div>

      {/* Foods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFoods.map((food) => {
          const isIntroduced = introducedFoods.some(f => f.food_id === food._id)
          const introducedDate = introducedFoods.find(f => f.food_id === food._id)?.introduced_date

          return (
            <div
              key={food._id}
              className={`bg-card rounded-lg p-6 border transition-all duration-200 hover:shadow-lg ${
                isIntroduced ? 'border-green-200 bg-green-50/50' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {food.name}
                  </h3>
                  {food.foodType && (
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full mb-2">
                      {food.foodType}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => toggleFoodIntroduction(food)}
                  className={`p-2 rounded-full transition-colors ${
                    isIntroduced
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-400 hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {isIntroduced ? <Check size={20} /> : <Plus size={20} />}
                </button>
              </div>

              {food.ageSuggestion && (
                <div className="mb-3">
                  <span className="text-sm font-medium text-foreground">Age Suggestion: </span>
                  <span className="text-sm text-muted-foreground">{food.ageSuggestion}</span>
                </div>
              )}

              {food.introductionSummary && (
                <p className="text-sm text-muted-foreground mb-3">
                  {food.introductionSummary}
                </p>
              )}

              {food.healthBenefits && (
                <div className="mb-3">
                  <span className="text-sm font-medium text-green-600">Benefits: </span>
                  <span className="text-sm text-muted-foreground">{food.healthBenefits}</span>
                </div>
              )}

              {(food.allergenInfo || food.chokingHazardInfo) && (
                <div className="mb-3 space-y-1">
                  {food.allergenInfo && (
                    <div className="flex items-start space-x-2">
                      <AlertTriangle size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-orange-700">{food.allergenInfo}</span>
                    </div>
                  )}
                  {food.chokingHazardInfo && (
                    <div className="flex items-start space-x-2">
                      <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-red-700">{food.chokingHazardInfo}</span>
                    </div>
                  )}
                </div>
              )}

              {isIntroduced && introducedDate && (
                <div className="mt-4 pt-3 border-t border-green-200">
                  <span className="text-xs text-green-600 font-medium">
                    Introduced on {new Date(introducedDate).toLocaleDateString()}
                  </span>
                </div>
              )}

              {food.ironRich === 'Yes' && (
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    Iron Rich
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filteredFoods.length === 0 && (
        <div className="text-center py-12">
          <Apple className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No foods found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  )
}

export default FoodsPage