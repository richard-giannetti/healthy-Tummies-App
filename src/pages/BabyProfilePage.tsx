import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Baby, Calendar, Weight, Heart, AlertTriangle, Target } from 'lucide-react'
import { format } from 'date-fns'

interface BabyProfile {
  id: string
  name: string
  birth_date: string
  weight_kg: number | null
  allergies: string[]
  dietary_restrictions: string[]
  medical_conditions: string[]
  health_conditions: string[]
  feeding_goals: string[]
  dietary_preferences: string[]
  feeding_type: string | null
  feeding_stage: string | null
  avatar_url: string | null
}

const BabyProfilePage = () => {
  const [profile, setProfile] = useState<BabyProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<BabyProfile>>({})

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('baby_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error)
        return
      }

      setProfile(data)
      setFormData(data || {})
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const profileData = {
        ...formData,
        user_id: user.id,
      }

      let result
      if (profile) {
        result = await supabase
          .from('baby_profiles')
          .update(profileData)
          .eq('id', profile.id)
          .select()
          .single()
      } else {
        result = await supabase
          .from('baby_profiles')
          .insert(profileData)
          .select()
          .single()
      }

      if (result.error) throw result.error

      setProfile(result.data)
      setEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
    }
  }

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - birth.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) {
      return `${diffDays} days old`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months} month${months > 1 ? 's' : ''} old`
    } else {
      const years = Math.floor(diffDays / 365)
      const remainingMonths = Math.floor((diffDays % 365) / 30)
      return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''} old`
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!profile && !editing) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-12">
          <Baby className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Create Baby Profile
          </h2>
          <p className="text-muted-foreground mb-6">
            Let's start by setting up your baby's profile to get personalized recommendations.
          </p>
          <button
            onClick={() => setEditing(true)}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Create Profile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Baby Profile</h1>
        {profile && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      {editing ? (
        <div className="bg-card rounded-lg p-6 border border-border space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Baby's Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter baby's name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Birth Date *
              </label>
              <input
                type="date"
                value={formData.birth_date || ''}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.weight_kg || ''}
                onChange={(e) => setFormData({ ...formData, weight_kg: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., 7.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Feeding Type
              </label>
              <select
                value={formData.feeding_type || ''}
                onChange={(e) => setFormData({ ...formData, feeding_type: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select feeding type</option>
                <option value="breastfeeding">Breastfeeding</option>
                <option value="formula">Formula</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Allergies (comma-separated)
            </label>
            <input
              type="text"
              value={formData.allergies?.join(', ') || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                allergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              })}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., milk, eggs, nuts"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Medical Conditions (comma-separated)
            </label>
            <input
              type="text"
              value={formData.medical_conditions?.join(', ') || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                medical_conditions: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              })}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Any medical conditions"
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSave}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Save Profile
            </button>
            <button
              onClick={() => {
                setEditing(false)
                setFormData(profile || {})
              }}
              className="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg font-medium hover:bg-secondary/90 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : profile && (
        <div className="space-y-6">
          {/* Profile Summary */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 border border-primary/20">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Baby className="text-primary" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
                <p className="text-muted-foreground">
                  {calculateAge(profile.birth_date)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Born {format(new Date(profile.birth_date), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center space-x-3 mb-4">
                <Weight className="text-blue-600" size={20} />
                <h3 className="font-semibold text-foreground">Physical Info</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Weight:</span>{' '}
                  {profile.weight_kg ? `${profile.weight_kg} kg` : 'Not specified'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Feeding Type:</span>{' '}
                  {profile.feeding_type || 'Not specified'}
                </p>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="text-red-600" size={20} />
                <h3 className="font-semibold text-foreground">Health Info</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-sm">Allergies:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profile.allergies && profile.allergies.length > 0 ? (
                      profile.allergies.map((allergy, index) => (
                        <span
                          key={index}
                          className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full"
                        >
                          {allergy}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">None specified</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-sm">Medical Conditions:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profile.medical_conditions && profile.medical_conditions.length > 0 ? (
                      profile.medical_conditions.map((condition, index) => (
                        <span
                          key={index}
                          className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full"
                        >
                          {condition}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">None specified</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BabyProfilePage