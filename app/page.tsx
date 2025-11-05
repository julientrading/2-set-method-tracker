import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="mb-6 text-5xl font-bold text-white md:text-7xl">
            The <span className="text-blue-400">2 Set Method</span>
          </h1>
          <p className="mb-4 text-xl text-gray-300 md:text-2xl">
            Soviet-Inspired Strength Training
          </p>
          <p className="mb-12 max-w-2xl text-lg text-gray-400">
            Build strength and muscle with minimal volume and maximum intensity.
            <br />
            Only 2 exercises. Only 2 sets. Maximum results.
          </p>

          <div className="flex gap-4">
            <Link
              href="/signup"
              className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-blue-700"
            >
              Start Training
            </Link>
            <Link
              href="/login"
              className="rounded-lg border-2 border-blue-400 px-8 py-4 text-lg font-semibold text-blue-400 transition hover:bg-blue-400 hover:text-white"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Problem/Solution Section */}
        <div className="mt-32 grid gap-12 md:grid-cols-2">
          <div className="rounded-2xl bg-red-900/20 p-8 backdrop-blur">
            <h2 className="mb-4 text-3xl font-bold text-red-400">The Problem</h2>
            <ul className="space-y-3 text-gray-300">
              <li>❌ Overcomplicated volume-based programs</li>
              <li>❌ Time-consuming workouts</li>
              <li>❌ Plateaus and diminishing returns</li>
              <li>❌ Programs designed for enhanced athletes</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-green-900/20 p-8 backdrop-blur">
            <h2 className="mb-4 text-3xl font-bold text-green-400">The Solution</h2>
            <ul className="space-y-3 text-gray-300">
              <li>✅ Simple 6-day training cycle</li>
              <li>✅ Only 2 sets per exercise</li>
              <li>✅ Maximum intensity training</li>
              <li>✅ Proven Soviet methodology</li>
            </ul>
          </div>
        </div>

        {/* Program Overview */}
        <div className="mt-32">
          <h2 className="mb-12 text-center text-4xl font-bold text-white">
            The 6-Day Cycle
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur">
              <h3 className="mb-3 text-2xl font-bold text-blue-400">PULL</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Ring Pull-ups</li>
                <li>• Ring Rows</li>
              </ul>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur">
              <h3 className="mb-3 text-2xl font-bold text-green-400">PUSH</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Ring Dips</li>
                <li>• Ring Pseudo Planche Push-ups</li>
              </ul>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur">
              <h3 className="mb-3 text-2xl font-bold text-purple-400">LEGS</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Pistol Squats</li>
                <li>• Nordic Curls</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Gamification Teaser */}
        <div className="mt-32 rounded-2xl bg-gradient-to-r from-yellow-900/30 to-orange-900/30 p-12 text-center backdrop-blur">
          <h2 className="mb-6 text-4xl font-bold text-yellow-400">
            🏆 Level Up Your Strength
          </h2>
          <p className="mb-8 text-xl text-gray-300">
            Earn XP, unlock achievements, maintain streaks, and compete on leaderboards.
            <br />
            Make strength training addictive.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-center">
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
              <div className="text-3xl font-bold text-blue-400">Levels & XP</div>
              <div className="text-sm text-gray-400">Rise to Soviet Legend</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
              <div className="text-3xl font-bold text-orange-400">Streak Tracking</div>
              <div className="text-sm text-gray-400">Don't break the chain</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
              <div className="text-3xl font-bold text-purple-400">Achievements</div>
              <div className="text-sm text-gray-400">Unlock epic badges</div>
            </div>
          </div>
        </div>

        {/* Pricing Teaser */}
        <div className="mt-32 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white">Simple Pricing</h2>
          <p className="mb-12 text-xl text-gray-400">
            Start building strength today
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border-2 border-blue-400/30 bg-white/5 p-8 backdrop-blur">
              <h3 className="mb-2 text-2xl font-bold text-white">Monthly</h3>
              <p className="mb-4 text-4xl font-bold text-blue-400">$14.99</p>
              <p className="text-gray-400">per month</p>
            </div>
            <div className="rounded-xl border-4 border-blue-400 bg-blue-900/20 p-8 backdrop-blur">
              <div className="mb-2 inline-block rounded-full bg-blue-400 px-3 py-1 text-xs font-bold text-white">
                BEST VALUE
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">Annual</h3>
              <p className="mb-4 text-4xl font-bold text-blue-400">$119</p>
              <p className="text-gray-400">$9.92/month - Save 30%</p>
            </div>
            <div className="rounded-xl border-2 border-blue-400/30 bg-white/5 p-8 backdrop-blur">
              <h3 className="mb-2 text-2xl font-bold text-white">Lifetime</h3>
              <p className="mb-4 text-4xl font-bold text-blue-400">$399</p>
              <p className="text-gray-400">one-time payment</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-32 text-center">
          <Link
            href="/signup"
            className="inline-block rounded-lg bg-blue-600 px-12 py-5 text-xl font-bold text-white transition hover:bg-blue-700"
          >
            Start Your Journey Now
          </Link>
        </div>
      </div>
    </div>
  )
}
