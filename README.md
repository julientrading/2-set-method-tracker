# 2 Set Method - Workout Tracking Application

A modern web application for tracking the **2 Set Method** - a Soviet-inspired strength training program using minimal volume with maximum intensity.

## 🏋️ Overview

The 2 Set Method is a science-backed training program requiring only 2 exercises and 2 high-intensity sets per workout session. This app provides:

- **Workout Tracking** - Log sets, reps, and weights for all exercises
- **Progress Analytics** - Visualize strength gains over time
- **Gamification System** - Levels, XP, streaks, and achievements to drive motivation
- **Exercise Library** - Detailed form guides and video demonstrations
- **Subscription Management** - Stripe-powered billing

## 🚀 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (data visualization)
- **React Hook Form + Zod** (form validation)

### Backend
- **Supabase** (PostgreSQL database, authentication, storage)
- **Next.js API Routes**
- **Stripe** (payment processing)

### Infrastructure
- **Vercel** (hosting)
- **pnpm** (package manager)

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (app)/             # Protected app pages
│   ├── (marketing)/       # Public marketing pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── workout/          # Workout-specific components
│   ├── charts/           # Chart components
│   ├── gamification/     # Gamification UI components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                  # Utility libraries
│   ├── supabase/        # Supabase client configuration
│   ├── stripe/          # Stripe integration
│   ├── gamification/    # Gamification logic
│   │   ├── xp-calculator.ts
│   │   ├── streak-calculator.ts
│   │   ├── achievement-checker.ts
│   │   └── level-calculator.ts
│   ├── utils/           # Helper functions
│   └── validations/     # Zod schemas
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── supabase/           # Database migrations
│   └── migrations/
│       ├── 00001_initial_schema.sql
│       ├── 00002_rls_policies.sql
│       ├── 00003_seed_exercises.sql
│       └── 00004_seed_achievements.sql
└── public/             # Static assets
```

## 🗄️ Database Schema

The application uses PostgreSQL via Supabase with the following main tables:

- `users` - User profiles and subscription status
- `workouts` - Workout sessions
- `workout_sets` - Individual sets within workouts
- `exercises` - Exercise library (reference data)
- `user_progress` - Progress tracking and personal records
- `subscriptions` - Stripe subscription management
- **Gamification Tables:**
  - `user_gamification` - User XP, level, streaks
  - `achievements` - Achievement definitions
  - `user_achievements` - User achievement unlocks

## 🎮 Gamification System (MVP)

The gamification system is a core feature designed to maximize user engagement:

### XP & Leveling
- **Workout Completed:** +100 XP
- **PR Achieved:** +200 XP
- **7-Day Streak:** +50 XP
- **30-Day Streak:** +200 XP

### Level Progression
- **Levels 1-10:** Novice (500 XP per level)
- **Levels 11-25:** Intermediate (1,000 XP per level)
- **Levels 26-50:** Advanced (2,000 XP per level)
- **Levels 51-75:** Elite (3,000 XP per level)
- **Levels 76-100:** Master (5,000 XP per level)
- **Levels 100+:** Soviet Legend (10,000 XP per level)

### Streak Tracking
- Daily workout streaks with visual flame icon
- **Streak Freeze** - 1 mulligan per month to prevent streak breaks
- Milestone achievements at 7, 30, 90, 180, and 365 days

### Achievements (45+)
- **Milestone:** First workout, 10 workouts, 100 workouts, etc.
- **Strength:** Weight thresholds (+10kg, +20kg, +50kg, etc.)
- **Consistency:** Streak milestones (7, 30, 90, 365 days)
- **Personal Records:** PR milestones (1, 5, 10, 25, 50 PRs)
- **Exercise-Specific:** Pull-up, dip, pistol squat, Nordic curl achievements
- **Secret Achievements:** Hidden unlocks (Early Bird, Birthday PR, etc.)

### Rarity System
- **Common** (60%) - Easy achievements for encouragement
- **Rare** (25%) - Moderate difficulty milestones
- **Epic** (12%) - Difficult accomplishments
- **Legendary** (3%) - Ultimate goals

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Supabase account
- Stripe account (for payments)

### 1. Clone Repository

```bash
git clone <repository-url>
cd 2-set-method-tracker
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set Up Supabase Database

1. Create a new Supabase project
2. Run the migration files in order:
   ```sql
   -- In Supabase SQL Editor, run each file in order:
   supabase/migrations/00001_initial_schema.sql
   supabase/migrations/00002_rls_policies.sql
   supabase/migrations/00003_seed_exercises.sql
   supabase/migrations/00004_seed_achievements.sql
   ```

### 5. Configure Stripe

1. Create Stripe products:
   - Monthly subscription ($14.99/month)
   - Annual subscription ($119/year)
   - Lifetime access ($399 one-time)
2. Set up webhook endpoint: `https://your-domain.com/api/stripe/webhook`
3. Configure webhook events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### 6. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🚀 Deployment

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy!

```bash
vercel --prod
```

### Post-Deployment
- Verify Supabase connection
- Test Stripe webhooks
- Run smoke tests on critical flows

## 📊 Current Progress

### ✅ Completed (MVP Foundation)
- [x] Next.js 14 project setup with TypeScript
- [x] Tailwind CSS configuration with custom animations
- [x] Complete database schema with migrations
- [x] Row Level Security (RLS) policies
- [x] Supabase client configuration
- [x] Exercise library seed data (9 exercises)
- [x] Achievement system seed data (45+ achievements)
- [x] XP and level calculation system
- [x] Streak tracking with mulligan feature
- [x] Achievement checking and unlock system
- [x] Landing page design
- [x] Authentication middleware
- [x] Route protection

### 🚧 In Progress
- [ ] Authentication pages (login, signup, password reset)
- [ ] Dashboard with gamification stats
- [ ] Workout tracker (active workout page)
- [ ] Progress analytics and charts
- [ ] Gamification UI components

### 📋 Next Steps
1. Build authentication flows
2. Create dashboard with gamification overview
3. Build workout tracking system
4. Implement gamification UI components
5. Add progress analytics with charts
6. Integrate Stripe payments
7. Complete all remaining pages
8. Testing and optimization
9. Production deployment

## 🎨 Design System

### Colors
- **Primary:** Blue (#3B82F6)
- **XP Bar:** Gold gradient
- **Streak Flame:** Orange → Blue → Gold (based on length)
- **Achievement Rarities:**
  - Common: Silver/Gray
  - Rare: Blue
  - Epic: Purple
  - Legendary: Gold with glow

### Typography
- **Font:** Inter (sans-serif)
- **Headings:** Bold, large sizes
- **Body:** Regular weight, readable line height

### Animations
- Level up: Scale and fade animation
- Achievement unlock: Badge reveal with slide-in
- Streak pulse: Subtle pulsing for active streaks
- XP fill: Smooth progress bar fill

## 🧪 Testing

### Run Tests
```bash
pnpm test          # Unit tests
pnpm test:e2e      # E2E tests (when implemented)
```

### Test Coverage Goals
- **Overall:** 80%+
- **Critical paths:** 95%+
- **Gamification logic:** 100%

## 📝 Contributing

This is a proprietary project. For questions or suggestions, contact the development team.

## 📄 License

Proprietary - All rights reserved

## 🔗 Links

- **Documentation:** [Coming soon]
- **Support:** [Coming soon]
- **Changelog:** [Coming soon]

---

Built with 💪 by the 2 Set Method team
