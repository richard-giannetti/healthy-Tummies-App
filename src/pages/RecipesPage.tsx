import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Search, ChefHat, Clock, Users, Heart, ExternalLink } from 'lucide-react'

interface Recipe {
  _id: string
  title: string
  description: string
  ingredients: any[]
  method: any[]
  servings: number
  time: string
  link: string
}

interface RecipeFavorite {
  id: string
  recipe_id: string
}

const RecipesPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [favorites, setFavorites] = useState<RecipeFavorite[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  useEffect(() => {
    loadRecipes()
    loadFavorites()
  }, [])

  const loadRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('title')

      if (error) throw error
      setRecipes(data || [])
    } catch (error) {
      console.error('Error loading recipes:', error)
    }
  }

  const loadFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('recipe_favorites')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error
      setFavorites(data || [])
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async (recipe: Recipe) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const isFavorite = favorites.some(f => f.recipe_id === recipe._id)

      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('recipe_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipe._id)

        if (error) throw error
        setFavorites(prev => prev.filter(f => f.recipe_id !== recipe._id))
      } else {
        // Add to favorites
        const { data, error } = await supabase
          .from('recipe_favorites')
          .insert({
            user_id: user.id,
            recipe_id: recipe._id
          })
          .select()
          .single()

        if (error) throw error
        setFavorites(prev => [...prev, data])
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const isFavorite = favorites.some(f => f.recipe_id === recipe._id)
    const matchesFavoriteFilter = !showFavoritesOnly || isFavorite

    return matchesSearch && matchesFavoriteFilter
  })

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
        <h1 className="text-3xl font-bold text-foreground">Recipes</h1>
        <div className="text-sm text-muted-foreground">
          {favorites.length} favorite recipes
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-lg p-4 border border-border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showFavoritesOnly}
              onChange={(e) => setShowFavoritesOnly(e.target.checked)}
              className="rounded border-input text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">Favorites only</span>
          </label>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRecipes.map((recipe) => {
          const isFavorite = favorites.some(f => f.recipe_id === recipe._id)

          return (
            <div
              key={recipe._id}
              className="bg-card rounded-lg p-6 border border-border hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {recipe.title}
                  </h3>
                  {recipe.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {recipe.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => toggleFavorite(recipe)}
                  className={`p-2 rounded-full transition-colors ${
                    isFavorite
                      ? 'text-red-500 hover:bg-red-50'
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                </button>
              </div>

              {/* Recipe Meta */}
              <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
                {recipe.time && (
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>{recipe.time}</span>
                  </div>
                )}
                {recipe.servings && (
                  <div className="flex items-center space-x-1">
                    <Users size={16} />
                    <span>{recipe.servings} servings</span>
                  </div>
                )}
              </div>

              {/* Ingredients */}
              {recipe.ingredients && recipe.ingredients.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-foreground mb-2">Ingredients:</h4>
                  <ul className="space-y-1">
                    {recipe.ingredients.slice(0, 5).map((ingredient, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="mr-2">•</span>
                        <span>{typeof ingredient === 'string' ? ingredient : ingredient.name || ingredient.ingredient}</span>
                      </li>
                    ))}
                    {recipe.ingredients.length > 5 && (
                      <li className="text-sm text-muted-foreground italic">
                        +{recipe.ingredients.length - 5} more ingredients
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Method Preview */}
              {recipe.method && recipe.method.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-foreground mb-2">Method:</h4>
                  <ol className="space-y-1">
                    {recipe.method.slice(0, 2).map((step, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="mr-2 font-medium">{index + 1}.</span>
                        <span>{typeof step === 'string' ? step : step.step || step.instruction}</span>
                      </li>
                    ))}
                    {recipe.method.length > 2 && (
                      <li className="text-sm text-muted-foreground italic">
                        +{recipe.method.length - 2} more steps
                      </li>
                    )}
                  </ol>
                </div>
              )}

              {/* External Link */}
              {recipe.link && (
                <div className="pt-4 border-t border-border">
                  <a
                    href={recipe.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink size={16} />
                    <span className="text-sm font-medium">View Full Recipe</span>
                  </a>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No recipes found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  )
}

export default RecipesPage