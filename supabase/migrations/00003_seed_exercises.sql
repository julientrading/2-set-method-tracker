-- Seed Exercise Data for 2 Set Method
-- This includes all exercises from the program specification

-- ============================================================================
-- PULL EXERCISES
-- ============================================================================

INSERT INTO public.exercises (name, category, is_primary, description, form_tips, equipment_needed) VALUES
(
  'Ring Pull-ups',
  'pull',
  true,
  'Primary pulling exercise for upper back and bicep development. Performed on gymnastics rings for increased stability demand.',
  ARRAY[
    'Start with arms fully extended, rings at shoulder width',
    'Pull until chin is over rings',
    'Keep core tight and avoid kipping',
    'Control the descent',
    'Rings should remain stable throughout movement'
  ],
  ARRAY['Gymnastics rings', 'Pull-up bar/rack']
),
(
  'Ring Rows',
  'pull',
  false,
  'Secondary pulling exercise targeting horizontal pulling strength. Excellent for mid-back and rear deltoid development.',
  ARRAY[
    'Set rings at appropriate height (lower = harder)',
    'Body remains straight from head to heels',
    'Pull chest to rings',
    'Squeeze shoulder blades together at top',
    'Keep elbows close to body'
  ],
  ARRAY['Gymnastics rings', 'Adjustable strap/TRX']
);

-- ============================================================================
-- PUSH EXERCISES
-- ============================================================================

INSERT INTO public.exercises (name, category, is_primary, description, form_tips, equipment_needed) VALUES
(
  'Ring Dips',
  'push',
  true,
  'Primary pushing exercise for chest, triceps, and anterior deltoid development. Rings add instability for enhanced muscle activation.',
  ARRAY[
    'Start at top position with arms locked out',
    'Lower until upper arms are parallel to ground',
    'Keep rings close to body',
    'Lean forward slightly for chest emphasis',
    'Push back to starting position with control'
  ],
  ARRAY['Gymnastics rings', 'Dip station/rack']
),
(
  'Ring Pseudo Planche Push-ups',
  'push',
  false,
  'Advanced pushing variation emphasizing straight-arm strength and planche progression. Targets chest, shoulders, and core.',
  ARRAY[
    'Start in plank position with rings',
    'Hands positioned by hips (not shoulders)',
    'Lean forward to shift weight',
    'Maintain protracted scapula',
    'Keep body perfectly straight',
    'Lower chest to rings with bent arms'
  ],
  ARRAY['Gymnastics rings', 'Floor space']
);

-- ============================================================================
-- LEG EXERCISES
-- ============================================================================

INSERT INTO public.exercises (name, category, is_primary, description, form_tips, equipment_needed) VALUES
(
  'Pistol Squats',
  'legs',
  true,
  'Single-leg squat variation requiring strength, balance, and mobility. Develops unilateral leg strength and prevents imbalances.',
  ARRAY[
    'Stand on one leg, other leg extended forward',
    'Lower until hamstring touches calf',
    'Keep heel planted throughout',
    'Extend arms forward for balance',
    'Non-working leg stays straight and elevated',
    'Drive through heel to stand'
  ],
  ARRAY['Optional: counterweight for progression']
),
(
  'Nordic Curls',
  'legs',
  false,
  'Eccentric-focused hamstring exercise. One of the most effective movements for hamstring strength and injury prevention.',
  ARRAY[
    'Kneel with ankles secured (partner or equipment)',
    'Keep body straight from knees to head',
    'Lower forward with control using hamstrings',
    'Go as low as possible maintaining control',
    'Use hands to catch yourself at bottom',
    'Push back to starting position (assisted)'
  ],
  ARRAY['Ankle anchor', 'Partner', 'Crash mat/soft surface']
);

-- ============================================================================
-- ALTERNATIVE/PROGRESSION EXERCISES (Optional - for future use)
-- ============================================================================

INSERT INTO public.exercises (name, category, is_primary, description, form_tips, equipment_needed) VALUES
(
  'Assisted Pull-ups',
  'pull',
  false,
  'Regression option for ring pull-ups. Use resistance band or assistance machine to build strength.',
  ARRAY[
    'Use resistance band looped around bar',
    'Place knee or foot in band',
    'Perform pull-up with assistance',
    'Progress to thinner bands over time',
    'Maintain same form as regular pull-ups'
  ],
  ARRAY['Resistance band', 'Pull-up bar']
),
(
  'Bench Dips',
  'push',
  false,
  'Regression option for ring dips. Performed with feet elevated on bench.',
  ARRAY[
    'Hands on bench behind you',
    'Feet elevated on another bench',
    'Lower until upper arms parallel to ground',
    'Push back up',
    'Add weight on lap for progression'
  ],
  ARRAY['2 benches or elevated surfaces', 'Optional weight plate']
),
(
  'Box Pistol Squats',
  'legs',
  false,
  'Regression for pistol squats. Sit down to box for depth control.',
  ARRAY[
    'Perform pistol squat to seated position on box',
    'Tap box lightly with glutes',
    'Stand back up on single leg',
    'Lower box height as strength improves'
  ],
  ARRAY['Box or bench (adjustable height)']
);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify all exercises were inserted
DO $$
DECLARE
  exercise_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO exercise_count FROM public.exercises;
  RAISE NOTICE 'Total exercises inserted: %', exercise_count;

  SELECT COUNT(*) INTO exercise_count FROM public.exercises WHERE category = 'pull';
  RAISE NOTICE 'Pull exercises: %', exercise_count;

  SELECT COUNT(*) INTO exercise_count FROM public.exercises WHERE category = 'push';
  RAISE NOTICE 'Push exercises: %', exercise_count;

  SELECT COUNT(*) INTO exercise_count FROM public.exercises WHERE category = 'legs';
  RAISE NOTICE 'Legs exercises: %', exercise_count;
END $$;
