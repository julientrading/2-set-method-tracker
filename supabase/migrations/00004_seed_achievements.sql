-- Seed Achievement Data for 2 Set Method MVP
-- This includes all achievement categories: milestone, strength, consistency, PR, exercise-specific, and secret

-- ============================================================================
-- MILESTONE ACHIEVEMENTS (Common)
-- ============================================================================

INSERT INTO public.achievements (name, description, category, requirement_type, requirement_value, xp_reward, rarity, sort_order) VALUES
('First Steps', 'Every journey begins with a single rep. Complete your first workout.', 'milestone', 'workouts', 1, 100, 'common', 1),
('Getting Started', 'You''re building the habit. Complete 5 workouts.', 'milestone', 'workouts', 5, 150, 'common', 2),
('Dedicated', 'Consistency is key. Complete 10 workouts.', 'milestone', 'workouts', 10, 200, 'common', 3),
('Committed', 'You''re in it for the long haul. Complete 25 workouts.', 'milestone', 'workouts', 25, 300, 'common', 4),
('Warrior', 'Half a hundred sessions conquered. Complete 50 workouts.', 'milestone', 'workouts', 50, 500, 'rare', 5),
('Century Club', 'A true milestone of dedication. Complete 100 workouts.', 'milestone', 'workouts', 100, 1000, 'rare', 6),
('Legendary', 'A full year of training. Complete 365 workouts.', 'milestone', 'workouts', 365, 2000, 'epic', 7);

-- ============================================================================
-- STRENGTH ACHIEVEMENTS (Rare to Epic)
-- ============================================================================

INSERT INTO public.achievements (name, description, category, requirement_type, requirement_value, xp_reward, rarity, sort_order) VALUES
('Bodyweight Champion', 'Master of your own weight. Achieve 10 bodyweight pull-ups in a set.', 'strength', 'reps_threshold', 10, 200, 'rare', 10),
('Adding Weight', 'The iron respects you now. Add 10kg to any exercise.', 'strength', 'weight_threshold', 10, 250, 'common', 11),
('Iron Apprentice', 'Strength is earned, not given. Add 20kg to any exercise.', 'strength', 'weight_threshold', 20, 400, 'rare', 12),
('Soviet Standard', 'You''ve reached Soviet strength levels. Add 30kg to any exercise.', 'strength', 'weight_threshold', 30, 600, 'rare', 13),
('Heavy Hitter', 'The weight is just a number now. Add 50kg to any exercise.', 'strength', 'weight_threshold', 50, 1000, 'epic', 14),
('Double Bodyweight', 'Extraordinary strength achieved. Lift 2x your bodyweight on any exercise.', 'strength', 'special', 0, 1500, 'epic', 15);

-- ============================================================================
-- CONSISTENCY ACHIEVEMENTS (Common to Epic)
-- ============================================================================

INSERT INTO public.achievements (name, description, category, requirement_type, requirement_value, xp_reward, rarity, sort_order) VALUES
('Week Warrior', 'A full week of consistency. Maintain a 7-day workout streak.', 'consistency', 'streak', 7, 150, 'common', 20),
('Two Week Titan', 'Two weeks without missing. Maintain a 14-day streak.', 'consistency', 'streak', 14, 250, 'common', 21),
('Monthly Master', 'A month of dedication. Maintain a 30-day streak.', 'consistency', 'streak', 30, 500, 'rare', 22),
('Quarter Champion', 'Three months of discipline. Maintain a 90-day streak.', 'consistency', 'streak', 90, 1200, 'rare', 23),
('Half Year Hero', 'Six months of unwavering commitment. Maintain a 180-day streak.', 'consistency', 'streak', 180, 2500, 'epic', 24),
('Yearly Legend', 'A full year without breaking. Maintain a 365-day streak.', 'consistency', 'streak', 365, 5000, 'legendary', 25);

-- ============================================================================
-- PR ACHIEVEMENTS (Common to Epic)
-- ============================================================================

INSERT INTO public.achievements (name, description, category, requirement_type, requirement_value, xp_reward, rarity, sort_order) VALUES
('First Victory', 'You''re getting stronger! Achieve your first personal record.', 'pr', 'prs', 1, 200, 'common', 30),
('Rising Star', 'The gains are coming. Achieve 5 personal records.', 'pr', 'prs', 5, 300, 'common', 31),
('Progression King', 'You''re breaking barriers. Achieve 10 personal records.', 'pr', 'prs', 10, 500, 'rare', 32),
('PR Machine', 'Unstoppable progress. Achieve 25 personal records.', 'pr', 'prs', 25, 1000, 'rare', 33),
('Unstoppable Force', 'Nothing can stop you. Achieve 50 personal records.', 'pr', 'prs', 50, 2000, 'epic', 34);

-- ============================================================================
-- EXERCISE-SPECIFIC ACHIEVEMENTS (Rare)
-- Pull-ups
-- ============================================================================

INSERT INTO public.achievements (name, description, category, requirement_type, requirement_value, exercise_specific, xp_reward, rarity, sort_order) VALUES
('Pull Beginner', 'First milestone in pulling strength. Achieve 15 bodyweight pull-ups.', 'exercise', 'reps_threshold', 15, 'Ring Pull-ups', 150, 'common', 40),
('Pull Intermediate', 'Strong pulling power. Achieve 10 pull-ups with 10kg.', 'exercise', 'special', 10, 'Ring Pull-ups', 250, 'rare', 41),
('Pull Advanced', 'Advanced pulling strength. Achieve 10 pull-ups with 25kg.', 'exercise', 'special', 10, 'Ring Pull-ups', 400, 'rare', 42),
('Pull Elite', 'Elite level strength. Achieve 10 pull-ups with 50kg.', 'exercise', 'special', 10, 'Ring Pull-ups', 800, 'epic', 43);

-- ============================================================================
-- EXERCISE-SPECIFIC ACHIEVEMENTS (Rare)
-- Dips
-- ============================================================================

INSERT INTO public.achievements (name, description, category, requirement_type, requirement_value, exercise_specific, xp_reward, rarity, sort_order) VALUES
('Dip Beginner', 'First milestone in pushing strength. Achieve 20 bodyweight dips.', 'exercise', 'reps_threshold', 20, 'Ring Dips', 150, 'common', 50),
('Dip Intermediate', 'Strong pushing power. Achieve 15 dips with 10kg.', 'exercise', 'special', 15, 'Ring Dips', 250, 'rare', 51),
('Dip Advanced', 'Advanced pushing strength. Achieve 15 dips with 25kg.', 'exercise', 'special', 15, 'Ring Dips', 400, 'rare', 52),
('Dip Master', 'Dip dominance achieved. Achieve 30 weighted dips.', 'exercise', 'reps_threshold', 30, 'Ring Dips', 800, 'epic', 53);

-- ============================================================================
-- EXERCISE-SPECIFIC ACHIEVEMENTS (Rare)
-- Pistol Squats
-- ============================================================================

INSERT INTO public.achievements (name, description, category, requirement_type, requirement_value, exercise_specific, xp_reward, rarity, sort_order) VALUES
('Pistol Novice', 'First pistol milestone. Achieve 5 pistol squats each leg.', 'exercise', 'reps_threshold', 5, 'Pistol Squats', 150, 'common', 60),
('Pistol Pro', 'One leg is all you need. Achieve 10 pistol squats each leg.', 'exercise', 'reps_threshold', 10, 'Pistol Squats', 600, 'rare', 61),
('Pistol Master', 'Single-leg mastery. Achieve 15 pistol squats each leg.', 'exercise', 'reps_threshold', 15, 'Pistol Squats', 1000, 'epic', 62);

-- ============================================================================
-- EXERCISE-SPECIFIC ACHIEVEMENTS (Rare)
-- Nordic Curls
-- ============================================================================

INSERT INTO public.achievements (name, description, category, requirement_type, requirement_value, exercise_specific, xp_reward, rarity, sort_order) VALUES
('Nordic Novice', 'Beginning hamstring mastery. Achieve 5 full Nordic curls.', 'exercise', 'reps_threshold', 5, 'Nordic Curls', 150, 'common', 70),
('Nordic Warrior', 'Strong hamstrings. Achieve 10 full Nordic curls.', 'exercise', 'reps_threshold', 10, 'Nordic Curls', 600, 'rare', 71),
('Nordic Legend', 'Hamstrings of steel. Achieve 15 full Nordic curls.', 'exercise', 'reps_threshold', 15, 'Nordic Curls', 1000, 'epic', 72);

-- ============================================================================
-- SECRET ACHIEVEMENTS (Legendary) 🔒
-- ============================================================================

INSERT INTO public.achievements (name, description, category, requirement_type, requirement_value, xp_reward, rarity, is_secret, sort_order) VALUES
('Early Bird', 'The early bird gets the gains. Complete a workout before 6 AM.', 'secret', 'special', 0, 300, 'rare', true, 100),
('Night Owl', 'Training when others sleep. Complete a workout after 10 PM.', 'secret', 'special', 0, 300, 'rare', true, 101),
('Birthday PR', 'Best birthday gift ever. Hit a personal record on your birthday.', 'secret', 'special', 0, 500, 'epic', true, 102),
('Comeback King', 'Welcome back, warrior. Return and complete a workout after 30+ day break.', 'secret', 'special', 0, 400, 'rare', true, 103),
('Soviet Comrade', 'You''ve earned Soviet legend status. Reach level 50.', 'secret', 'special', 50, 2000, 'legendary', true, 104),
('The Unbreakable', 'Your dedication is legendary. Maintain a 200-day streak.', 'secret', 'streak', 200, 3000, 'legendary', true, 105),
('Perfect Week', 'What a week! Achieve a PR in every workout this week.', 'secret', 'special', 0, 800, 'epic', true, 106),
('Ring Master', 'The rings are your domain. Complete 100 total ring exercises.', 'secret', 'special', 100, 400, 'rare', true, 107),
('Balanced Warrior', 'Perfect balance in training. Complete equal push/pull/leg workouts (50 each).', 'secret', 'special', 50, 600, 'epic', true, 108);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
DECLARE
  achievement_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO achievement_count FROM public.achievements;
  RAISE NOTICE 'Total achievements inserted: %', achievement_count;

  SELECT COUNT(*) INTO achievement_count FROM public.achievements WHERE category = 'milestone';
  RAISE NOTICE 'Milestone achievements: %', achievement_count;

  SELECT COUNT(*) INTO achievement_count FROM public.achievements WHERE category = 'strength';
  RAISE NOTICE 'Strength achievements: %', achievement_count;

  SELECT COUNT(*) INTO achievement_count FROM public.achievements WHERE category = 'consistency';
  RAISE NOTICE 'Consistency achievements: %', achievement_count;

  SELECT COUNT(*) INTO achievement_count FROM public.achievements WHERE category = 'pr';
  RAISE NOTICE 'PR achievements: %', achievement_count;

  SELECT COUNT(*) INTO achievement_count FROM public.achievements WHERE category = 'exercise';
  RAISE NOTICE 'Exercise-specific achievements: %', achievement_count;

  SELECT COUNT(*) INTO achievement_count FROM public.achievements WHERE category = 'secret';
  RAISE NOTICE 'Secret achievements: %', achievement_count;

  SELECT COUNT(*) INTO achievement_count FROM public.achievements WHERE rarity = 'common';
  RAISE NOTICE 'Common rarity: %', achievement_count;

  SELECT COUNT(*) INTO achievement_count FROM public.achievements WHERE rarity = 'rare';
  RAISE NOTICE 'Rare rarity: %', achievement_count;

  SELECT COUNT(*) INTO achievement_count FROM public.achievements WHERE rarity = 'epic';
  RAISE NOTICE 'Epic rarity: %', achievement_count;

  SELECT COUNT(*) INTO achievement_count FROM public.achievements WHERE rarity = 'legendary';
  RAISE NOTICE 'Legendary rarity: %', achievement_count;
END $$;

-- ============================================================================
-- SUMMARY
-- ============================================================================

COMMENT ON TABLE public.achievements IS 'Achievement definitions for the 2 Set Method gamification system. Total: 45+ achievements across 6 categories with 4 rarity levels.';
