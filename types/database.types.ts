/**
 * Database type definitions for Supabase
 * These types match the database schema
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          subscription_status: string
          subscription_tier: string | null
          stripe_customer_id: string | null
          current_stage: number
          profile_photo_url: string | null
          onboarding_completed: boolean
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
          subscription_status?: string
          subscription_tier?: string | null
          stripe_customer_id?: string | null
          current_stage?: number
          profile_photo_url?: string | null
          onboarding_completed?: boolean
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          subscription_status?: string
          subscription_tier?: string | null
          stripe_customer_id?: string | null
          current_stage?: number
          profile_photo_url?: string | null
          onboarding_completed?: boolean
        }
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          workout_type: string
          workout_date: string
          completed: boolean
          completed_at: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          workout_type: string
          workout_date: string
          completed?: boolean
          completed_at?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workout_type?: string
          workout_date?: string
          completed?: boolean
          completed_at?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          name: string
          category: string
          is_primary: boolean
          description: string | null
          video_url: string | null
          form_tips: string[] | null
          equipment_needed: string[] | null
        }
        Insert: {
          id?: string
          name: string
          category: string
          is_primary?: boolean
          description?: string | null
          video_url?: string | null
          form_tips?: string[] | null
          equipment_needed?: string[] | null
        }
        Update: {
          id?: string
          name?: string
          category?: string
          is_primary?: boolean
          description?: string | null
          video_url?: string | null
          form_tips?: string[] | null
          equipment_needed?: string[] | null
        }
      }
      workout_sets: {
        Row: {
          id: string
          workout_id: string
          exercise_id: string
          set_number: number
          set_type: string
          weight_kg: number | null
          reps: number
          reps_to_failure: boolean
          rest_duration_seconds: number | null
          created_at: string
        }
        Insert: {
          id?: string
          workout_id: string
          exercise_id: string
          set_number: number
          set_type: string
          weight_kg?: number | null
          reps: number
          reps_to_failure?: boolean
          rest_duration_seconds?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          workout_id?: string
          exercise_id?: string
          set_number?: number
          set_type?: string
          weight_kg?: number | null
          reps?: number
          reps_to_failure?: boolean
          rest_duration_seconds?: number | null
          created_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          exercise_id: string
          date: string
          max_weight_kg: number | null
          max_reps: number
          personal_record: boolean
        }
        Insert: {
          id?: string
          user_id: string
          exercise_id: string
          date: string
          max_weight_kg?: number | null
          max_reps: number
          personal_record?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          exercise_id?: string
          date?: string
          max_weight_kg?: number | null
          max_reps?: number
          personal_record?: boolean
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string | null
          stripe_price_id: string | null
          status: string
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          status: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          status?: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_gamification: {
        Row: {
          id: string
          user_id: string
          level: number
          total_xp: number
          current_streak: number
          longest_streak: number
          last_workout_date: string | null
          total_workouts_completed: number
          total_prs: number
          rank_title: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          level?: number
          total_xp?: number
          current_streak?: number
          longest_streak?: number
          last_workout_date?: string | null
          total_workouts_completed?: number
          total_prs?: number
          rank_title?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          level?: number
          total_xp?: number
          current_streak?: number
          longest_streak?: number
          last_workout_date?: string | null
          total_workouts_completed?: number
          total_prs?: number
          rank_title?: string
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string
          badge_icon_url: string | null
          category: string
          requirement_type: string
          requirement_value: number
          xp_reward: number
          rarity: string
          is_secret: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          badge_icon_url?: string | null
          category: string
          requirement_type: string
          requirement_value: number
          xp_reward?: number
          rarity?: string
          is_secret?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          badge_icon_url?: string | null
          category?: string
          requirement_type?: string
          requirement_value?: number
          xp_reward?: number
          rarity?: string
          is_secret?: boolean
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          unlocked_at: string
          progress: number
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          unlocked_at?: string
          progress?: number
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          unlocked_at?: string
          progress?: number
        }
      }
    }
  }
}
