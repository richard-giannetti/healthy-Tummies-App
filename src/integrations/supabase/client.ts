import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://rbmlsgtuuslwddgfnfqd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibWxzZ3R1dXNsd2RkZ2ZuZnFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MzAwODQsImV4cCI6MjA2NDEwNjA4NH0.Gb4txUm0XrQWnUVt-bTyaN5KQ8rFyFlh0AGOd-FcbEE'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)