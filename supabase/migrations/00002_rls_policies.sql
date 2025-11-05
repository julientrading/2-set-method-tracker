-- Row Level Security Policies for 2 Set Method
-- These policies ensure users can only access their own data

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_metrics ENABLE ROW LEVEL SECURITY;

-- Exercises and Achievements are read-only reference tables (no RLS needed for writes by users)
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (during signup)
CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- WORKOUTS TABLE POLICIES
-- ============================================================================

-- Users can view their own workouts
CREATE POLICY "Users can view own workouts"
  ON public.workouts FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own workouts
CREATE POLICY "Users can insert own workouts"
  ON public.workouts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own workouts
CREATE POLICY "Users can update own workouts"
  ON public.workouts FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own workouts
CREATE POLICY "Users can delete own workouts"
  ON public.workouts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- WORKOUT_SETS TABLE POLICIES
-- ============================================================================

-- Users can view their own workout sets
CREATE POLICY "Users can view own workout sets"
  ON public.workout_sets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workouts
      WHERE workouts.id = workout_sets.workout_id
      AND workouts.user_id = auth.uid()
    )
  );

-- Users can insert workout sets for their own workouts
CREATE POLICY "Users can insert own workout sets"
  ON public.workout_sets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workouts
      WHERE workouts.id = workout_sets.workout_id
      AND workouts.user_id = auth.uid()
    )
  );

-- Users can update their own workout sets
CREATE POLICY "Users can update own workout sets"
  ON public.workout_sets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.workouts
      WHERE workouts.id = workout_sets.workout_id
      AND workouts.user_id = auth.uid()
    )
  );

-- Users can delete their own workout sets
CREATE POLICY "Users can delete own workout sets"
  ON public.workout_sets FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.workouts
      WHERE workouts.id = workout_sets.workout_id
      AND workouts.user_id = auth.uid()
    )
  );

-- ============================================================================
-- USER_PROGRESS TABLE POLICIES
-- ============================================================================

-- Users can view their own progress
CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own progress
CREATE POLICY "Users can delete own progress"
  ON public.user_progress FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- SUBSCRIPTIONS TABLE POLICIES
-- ============================================================================

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can manage all subscriptions (for Stripe webhooks)
-- Users cannot directly insert/update subscriptions (only via webhooks)

-- ============================================================================
-- USER_GAMIFICATION TABLE POLICIES
-- ============================================================================

-- Users can view their own gamification stats
CREATE POLICY "Users can view own gamification stats"
  ON public.user_gamification FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own gamification stats
CREATE POLICY "Users can update own gamification stats"
  ON public.user_gamification FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can insert their own gamification stats (usually handled by trigger)
CREATE POLICY "Users can insert own gamification stats"
  ON public.user_gamification FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- USER_ACHIEVEMENTS TABLE POLICIES
-- ============================================================================

-- Users can view their own achievements
CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own achievements (when unlocked)
CREATE POLICY "Users can insert own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own achievements (for progress tracking)
CREATE POLICY "Users can update own achievements"
  ON public.user_achievements FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- EXERCISES TABLE POLICIES (Reference Data - Read Only)
-- ============================================================================

-- All authenticated users can read exercises
CREATE POLICY "Authenticated users can view exercises"
  ON public.exercises FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================================
-- ACHIEVEMENTS TABLE POLICIES (Reference Data - Read Only)
-- ============================================================================

-- All authenticated users can read achievements
CREATE POLICY "Authenticated users can view achievements"
  ON public.achievements FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================================
-- BODY_METRICS TABLE POLICIES
-- ============================================================================

-- Users can view their own body metrics
CREATE POLICY "Users can view own body metrics"
  ON public.body_metrics FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own body metrics
CREATE POLICY "Users can insert own body metrics"
  ON public.body_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own body metrics
CREATE POLICY "Users can update own body metrics"
  ON public.body_metrics FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own body metrics
CREATE POLICY "Users can delete own body metrics"
  ON public.body_metrics FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- SERVICE ROLE POLICIES (for server-side operations)
-- ============================================================================

-- These policies allow the service role to manage subscriptions via webhooks
CREATE POLICY "Service role can manage subscriptions"
  ON public.subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Service role can manage reference data
CREATE POLICY "Service role can manage exercises"
  ON public.exercises
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage achievements"
  ON public.achievements
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
