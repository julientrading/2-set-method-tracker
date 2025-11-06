-- 2 Set Method Database Schema
-- This migration creates all tables for the MVP including gamification features

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE (Extended from Supabase Auth)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_status TEXT DEFAULT 'inactive', -- active, cancelled, expired, trialing
  subscription_tier TEXT, -- monthly, annual, lifetime
  stripe_customer_id TEXT UNIQUE,
  current_stage INTEGER DEFAULT 1 CHECK (current_stage IN (1, 2)),
  profile_photo_url TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- EXERCISES TABLE (Reference Data)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('push', 'pull', 'legs')),
  is_primary BOOLEAN DEFAULT TRUE,
  description TEXT,
  video_url TEXT,
  form_tips TEXT[],
  equipment_needed TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- WORKOUTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  workout_type TEXT NOT NULL CHECK (workout_type IN ('push', 'pull', 'legs')),
  workout_date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- WORKOUT_SETS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.workout_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES public.exercises(id) NOT NULL,
  set_number INTEGER NOT NULL,
  set_type TEXT NOT NULL CHECK (set_type IN ('warmup', 'working')),
  weight_kg DECIMAL(5,2),
  reps INTEGER NOT NULL,
  reps_to_failure BOOLEAN DEFAULT FALSE,
  rest_duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- USER_PROGRESS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES public.exercises(id) NOT NULL,
  date DATE NOT NULL,
  max_weight_kg DECIMAL(5,2),
  max_reps INTEGER NOT NULL,
  personal_record BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, exercise_id, date)
);

-- ============================================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'trialing', 'past_due')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- GAMIFICATION TABLES (MVP)
-- ============================================================================

-- USER_GAMIFICATION TABLE
CREATE TABLE IF NOT EXISTS public.user_gamification (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  level INTEGER DEFAULT 1 CHECK (level >= 1),
  total_xp INTEGER DEFAULT 0 CHECK (total_xp >= 0),
  current_streak INTEGER DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak INTEGER DEFAULT 0 CHECK (longest_streak >= 0),
  last_workout_date DATE,
  streak_freeze_used_this_month BOOLEAN DEFAULT FALSE,
  last_streak_freeze_date DATE,
  total_workouts_completed INTEGER DEFAULT 0 CHECK (total_workouts_completed >= 0),
  total_prs INTEGER DEFAULT 0 CHECK (total_prs >= 0),
  rank_title TEXT DEFAULT 'Novice',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ACHIEVEMENTS TABLE (Reference Data)
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  badge_icon_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('milestone', 'strength', 'consistency', 'pr', 'exercise', 'secret')),
  requirement_type TEXT NOT NULL CHECK (requirement_type IN ('workouts', 'prs', 'streak', 'weight_threshold', 'reps_threshold', 'special')),
  requirement_value INTEGER,
  exercise_specific TEXT, -- NULL for general achievements, exercise name for exercise-specific
  xp_reward INTEGER DEFAULT 100 CHECK (xp_reward >= 0),
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  is_secret BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- USER_ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, achievement_id)
);

-- ============================================================================
-- BODY_METRICS TABLE (Optional - Phase 2)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.body_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  weight_kg DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,2),
  photo_urls TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON public.users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON public.users(stripe_customer_id);

-- Workouts indexes
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON public.workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_user_date ON public.workouts(user_id, workout_date DESC);
CREATE INDEX IF NOT EXISTS idx_workouts_user_type ON public.workouts(user_id, workout_type);
CREATE INDEX IF NOT EXISTS idx_workouts_completed ON public.workouts(user_id, completed);

-- Workout sets indexes
CREATE INDEX IF NOT EXISTS idx_workout_sets_workout_id ON public.workout_sets(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_sets_exercise_id ON public.workout_sets(exercise_id);

-- User progress indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_exercise_id ON public.user_progress(exercise_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_exercise ON public.user_progress(user_id, exercise_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_user_progress_pr ON public.user_progress(user_id, personal_record) WHERE personal_record = TRUE;

-- Exercises indexes
CREATE INDEX IF NOT EXISTS idx_exercises_category ON public.exercises(category);

-- Subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- Gamification indexes
CREATE INDEX IF NOT EXISTS idx_user_gamification_user_id ON public.user_gamification(user_id);
CREATE INDEX IF NOT EXISTS idx_user_gamification_level ON public.user_gamification(level DESC);
CREATE INDEX IF NOT EXISTS idx_user_gamification_xp ON public.user_gamification(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_user_gamification_streak ON public.user_gamification(current_streak DESC);

-- Achievements indexes
CREATE INDEX IF NOT EXISTS idx_achievements_category ON public.achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_rarity ON public.achievements(rarity);
CREATE INDEX IF NOT EXISTS idx_achievements_requirement ON public.achievements(requirement_type);

-- User achievements indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON public.user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked ON public.user_achievements(user_id, unlocked_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_achievements_completed ON public.user_achievements(user_id, completed);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON public.workouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_gamification_updated_at BEFORE UPDATE ON public.user_gamification
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to initialize user gamification when user signs up
CREATE OR REPLACE FUNCTION initialize_user_gamification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_gamification (user_id, level, total_xp, rank_title)
  VALUES (NEW.id, 1, 0, 'Novice');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_created
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_gamification();

-- Function to calculate level from XP
CREATE OR REPLACE FUNCTION calculate_level_from_xp(xp INTEGER)
RETURNS INTEGER AS $$
DECLARE
  level INTEGER := 1;
  xp_needed INTEGER := 0;
BEGIN
  -- Levels 1-10: 500 XP per level
  IF xp < 5000 THEN
    RETURN LEAST(10, (xp / 500) + 1);
  END IF;

  xp_needed := 5000;
  level := 10;

  -- Levels 11-25: 1000 XP per level
  IF xp < 20000 THEN
    RETURN level + LEAST(15, ((xp - xp_needed) / 1000) + 1);
  END IF;

  xp_needed := 20000;
  level := 25;

  -- Levels 26-50: 2000 XP per level
  IF xp < 70000 THEN
    RETURN level + LEAST(25, ((xp - xp_needed) / 2000) + 1);
  END IF;

  xp_needed := 70000;
  level := 50;

  -- Levels 51-75: 3000 XP per level
  IF xp < 145000 THEN
    RETURN level + LEAST(25, ((xp - xp_needed) / 3000) + 1);
  END IF;

  xp_needed := 145000;
  level := 75;

  -- Levels 76-100: 5000 XP per level
  IF xp < 270000 THEN
    RETURN level + LEAST(25, ((xp - xp_needed) / 5000) + 1);
  END IF;

  xp_needed := 270000;
  level := 100;

  -- Levels 100+: 10000 XP per level
  RETURN level + ((xp - xp_needed) / 10000);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get rank title from level
CREATE OR REPLACE FUNCTION get_rank_title(level INTEGER)
RETURNS TEXT AS $$
BEGIN
  IF level >= 100 THEN RETURN 'Soviet Legend';
  ELSIF level >= 76 THEN RETURN 'Master';
  ELSIF level >= 51 THEN RETURN 'Elite';
  ELSIF level >= 26 THEN RETURN 'Advanced';
  ELSIF level >= 11 THEN RETURN 'Intermediate';
  ELSE RETURN 'Novice';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.users IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE public.exercises IS 'Reference table for all exercises in the program';
COMMENT ON TABLE public.workouts IS 'Workout sessions tracking';
COMMENT ON TABLE public.workout_sets IS 'Individual sets within a workout';
COMMENT ON TABLE public.user_progress IS 'User progress tracking and personal records';
COMMENT ON TABLE public.subscriptions IS 'Stripe subscription management';
COMMENT ON TABLE public.user_gamification IS 'User gamification stats (XP, level, streaks)';
COMMENT ON TABLE public.achievements IS 'Achievement definitions (reference data)';
COMMENT ON TABLE public.user_achievements IS 'User-specific achievement unlocks';
