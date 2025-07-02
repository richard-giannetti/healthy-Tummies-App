export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      baby_profiles: {
        Row: {
          allergies: string[] | null
          avatar_url: string | null
          birth_date: string
          created_at: string | null
          dietary_preferences: string[] | null
          dietary_restrictions: string[] | null
          feeding_goals: string[] | null
          feeding_stage: string | null
          feeding_type: string | null
          health_conditions: string[] | null
          id: string
          medical_conditions: string[] | null
          name: string
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          allergies?: string[] | null
          avatar_url?: string | null
          birth_date: string
          created_at?: string | null
          dietary_preferences?: string[] | null
          dietary_restrictions?: string[] | null
          feeding_goals?: string[] | null
          feeding_stage?: string | null
          feeding_type?: string | null
          health_conditions?: string[] | null
          id?: string
          medical_conditions?: string[] | null
          name: string
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          allergies?: string[] | null
          avatar_url?: string | null
          birth_date?: string
          created_at?: string | null
          dietary_preferences?: string[] | null
          dietary_restrictions?: string[] | null
          feeding_goals?: string[] | null
          feeding_stage?: string | null
          feeding_type?: string | null
          health_conditions?: string[] | null
          id?: string
          medical_conditions?: string[] | null
          name?: string
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "baby_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      foods: {
        Row: {
          _id: string
          ageSuggestion: string | null
          allergenInfo: string | null
          canBabiesDrinkMilk: string | null
          chokingHazardInfo: string | null
          commonAllergen: string | null
          foodType: string | null
          healthBenefits: string | null
          Image: string | null
          introductionSummary: string | null
          ironRich: string | null
          name: string | null
          servingSuggestion12Months: string | null
          servingSuggestion3Years: string | null
          servingSuggestion6Months: string | null
        }
        Insert: {
          _id: string
          ageSuggestion?: string | null
          allergenInfo?: string | null
          canBabiesDrinkMilk?: string | null
          chokingHazardInfo?: string | null
          commonAllergen?: string | null
          foodType?: string | null
          healthBenefits?: string | null
          Image?: string | null
          introductionSummary?: string | null
          ironRich?: string | null
          name?: string | null
          servingSuggestion12Months?: string | null
          servingSuggestion3Years?: string | null
          servingSuggestion6Months?: string | null
        }
        Update: {
          _id?: string
          ageSuggestion?: string | null
          allergenInfo?: string | null
          canBabiesDrinkMilk?: string | null
          chokingHazardInfo?: string | null
          commonAllergen?: string | null
          foodType?: string | null
          healthBenefits?: string | null
          Image?: string | null
          introductionSummary?: string | null
          ironRich?: string | null
          name?: string | null
          servingSuggestion12Months?: string | null
          servingSuggestion3Years?: string | null
          servingSuggestion6Months?: string | null
        }
        Relationships: []
      }
      introduced_foods: {
        Row: {
          baby_profile_id: string
          created_at: string
          food_id: string
          id: string
          introduced_date: string
          notes: string | null
          user_id: string
        }
        Insert: {
          baby_profile_id: string
          created_at?: string
          food_id: string
          id?: string
          introduced_date?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          baby_profile_id?: string
          created_at?: string
          food_id?: string
          id?: string
          introduced_date?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "introduced_foods_baby_profile_id_fkey"
            columns: ["baby_profile_id"]
            isOneToOne: false
            referencedRelation: "baby_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "introduced_foods_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["_id"]
          },
        ]
      }
      product_cache: {
        Row: {
          api_source: string | null
          barcode: string
          cached_at: string
          expires_at: string
          id: string
          product_data: Json
        }
        Insert: {
          api_source?: string | null
          barcode: string
          cached_at?: string
          expires_at?: string
          id?: string
          product_data: Json
        }
        Update: {
          api_source?: string | null
          barcode?: string
          cached_at?: string
          expires_at?: string
          id?: string
          product_data?: Json
        }
        Relationships: []
      }
      recipe_favorites: {
        Row: {
          created_at: string
          id: string
          recipe_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          recipe_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          recipe_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_recipe_favorites_recipe_id"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["_id"]
          },
        ]
      }
      recipe_interactions: {
        Row: {
          baby_profile_id: string | null
          created_at: string
          id: string
          rating: number | null
          recipe_id: string
          tried: boolean
          tried_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          baby_profile_id?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          recipe_id: string
          tried?: boolean
          tried_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          baby_profile_id?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          recipe_id?: string
          tried?: boolean
          tried_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recipes: {
        Row: {
          _id: string | null
          description: string | null
          ingredients: Json | null
          link: string | null
          method: Json | null
          servings: number | null
          time: string | null
          title: string | null
        }
        Insert: {
          _id?: string | null
          description?: string | null
          ingredients?: Json | null
          link?: string | null
          method?: Json | null
          servings?: number | null
          time?: string | null
          title?: string | null
        }
        Update: {
          _id?: string | null
          description?: string | null
          ingredients?: Json | null
          link?: string | null
          method?: Json | null
          servings?: number | null
          time?: string | null
          title?: string | null
        }
        Relationships: []
      }
      scan_summary: {
        Row: {
          api_source: string | null
          average_score: number | null
          barcode: string | null
          brand: string | null
          created_at: string | null
          eco_score: string | null
          id: string
          image_urls: Json | null
          ingredients_text: string | null
          nova_score: number | null
          nutri_score: string | null
          nutritional_data: Json | null
          product_name: string | null
          scan_count: number | null
          scan_date: string
          user_id: string
        }
        Insert: {
          api_source?: string | null
          average_score?: number | null
          barcode?: string | null
          brand?: string | null
          created_at?: string | null
          eco_score?: string | null
          id?: string
          image_urls?: Json | null
          ingredients_text?: string | null
          nova_score?: number | null
          nutri_score?: string | null
          nutritional_data?: Json | null
          product_name?: string | null
          scan_count?: number | null
          scan_date?: string
          user_id: string
        }
        Update: {
          api_source?: string | null
          average_score?: number | null
          barcode?: string | null
          brand?: string | null
          created_at?: string | null
          eco_score?: string | null
          id?: string
          image_urls?: Json | null
          ingredients_text?: string | null
          nova_score?: number | null
          nutri_score?: string | null
          nutritional_data?: Json | null
          product_name?: string | null
          scan_count?: number | null
          scan_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scan_summary_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tips: {
        Row: {
          tip_age: string | null
          tip_description: string | null
          tip_id: number
          tip_title: string | null
        }
        Insert: {
          tip_age?: string | null
          tip_description?: string | null
          tip_id: number
          tip_title?: string | null
        }
        Update: {
          tip_age?: string | null
          tip_description?: string | null
          tip_id?: number
          tip_title?: string | null
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          activity_data: Json | null
          activity_type: string
          id: string
          page_path: string | null
          session_id: string | null
          timestamp: string
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          id?: string
          page_path?: string | null
          session_id?: string | null
          timestamp?: string
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          id?: string
          page_path?: string | null
          session_id?: string | null
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          achievements: string[]
          created_at: string
          current_streak: number
          feeding_level: string
          id: string
          last_activity_date: string
          level_progress: number
          longest_streak: number
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          achievements?: string[]
          created_at?: string
          current_streak?: number
          feeding_level?: string
          id?: string
          last_activity_date?: string
          level_progress?: number
          longest_streak?: number
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          achievements?: string[]
          created_at?: string
          current_streak?: number
          feeding_level?: string
          id?: string
          last_activity_date?: string
          level_progress?: number
          longest_streak?: number
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          actions_performed: number | null
          browser_info: string | null
          created_at: string
          device_type: string | null
          duration_minutes: number | null
          id: string
          pages_visited: number | null
          session_end: string | null
          session_start: string
          user_id: string
        }
        Insert: {
          actions_performed?: number | null
          browser_info?: string | null
          created_at?: string
          device_type?: string | null
          duration_minutes?: number | null
          id?: string
          pages_visited?: number | null
          session_end?: string | null
          session_start?: string
          user_id: string
        }
        Update: {
          actions_performed?: number | null
          browser_info?: string | null
          created_at?: string
          device_type?: string | null
          duration_minutes?: number | null
          id?: string
          pages_visited?: number | null
          session_end?: string | null
          session_start?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          last_scan_date: string | null
          month_start_date: string | null
          monthly_scan_count: number | null
          onboarding_completed: boolean | null
          total_scans_count: number | null
          updated_at: string | null
          week_start_date: string | null
          weekly_scan_count: number | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          last_scan_date?: string | null
          month_start_date?: string | null
          monthly_scan_count?: number | null
          onboarding_completed?: boolean | null
          total_scans_count?: number | null
          updated_at?: string | null
          week_start_date?: string | null
          weekly_scan_count?: number | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          last_scan_date?: string | null
          month_start_date?: string | null
          monthly_scan_count?: number | null
          onboarding_completed?: boolean | null
          total_scans_count?: number | null
          updated_at?: string | null
          week_start_date?: string | null
          weekly_scan_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_product_cache: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_activities: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_scan_summaries: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      end_user_session: {
        Args: {
          session_uuid: string
          pages_visited_param?: number
          actions_performed_param?: number
        }
        Returns: undefined
      }
      get_user_usage_stats: {
        Args: { user_uuid: string }
        Returns: {
          total_sessions: number
          total_time_minutes: number
          avg_session_duration: number
          total_activities: number
          last_activity: string
          most_active_day: string
          weekly_sessions: number
          monthly_sessions: number
        }[]
      }
      log_user_activity: {
        Args: {
          user_uuid: string
          activity_type_param: string
          session_uuid?: string
          activity_data_param?: Json
          page_path_param?: string
        }
        Returns: undefined
      }
      start_user_session: {
        Args: {
          user_uuid: string
          device_type_param?: string
          browser_info_param?: string
        }
        Returns: string
      }
      update_scan_tracking: {
        Args:
          | { user_uuid: string; scan_score?: number }
          | {
              user_uuid: string
              scan_score?: number
              product_barcode?: string
              product_name_param?: string
              brand_param?: string
              nutri_score_param?: string
              nova_score_param?: number
              eco_score_param?: string
              nutritional_data_param?: Json
              ingredients_param?: string
              image_urls_param?: Json
            }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
