import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // If no profile exists, create one (for users who signed up before profile creation was implemented)
  if (!profile && profileError?.code === 'PGRST116') {
    await supabase.from('users').insert({
      id: user.id,
      email: user.email!,
      full_name: user.user_metadata?.full_name || null,
    })
  }

  // Fetch gamification stats
  const { data: gamificationStats } = await supabase
    .from('user_gamification')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Check if this is the user's first time (no workouts completed yet)
  const isFirstTime = (gamificationStats?.total_workouts_completed || 0) === 0
  // Use profile full_name, fallback to user metadata, then to 'Athlete'
  const firstName = profile?.full_name?.split(' ')[0] || user.user_metadata?.full_name?.split(' ')[0] || 'Athlete'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="container mx-auto max-w-6xl space-y-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">
              {isFirstTime ? `Welcome, ${firstName}! 🎉` : `Welcome back, ${firstName}!`}
            </h1>
            <p className="mt-2 text-gray-400">
              {isFirstTime
                ? "Let's start your strength journey with the 2 Set Method!"
                : "Ready to get stronger?"}
            </p>
          </div>
          <Link href="/login">
            <Button variant="outline">Sign Out</Button>
          </Link>
        </div>

        {/* Gamification Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-blue-400/30 bg-blue-900/20 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-blue-400">Level & Rank</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                Level {gamificationStats?.level || 1}
              </div>
              <p className="mt-1 text-sm text-gray-400">
                {gamificationStats?.rank_title || 'Novice'}
              </p>
              <div className="mt-4 h-2 rounded-full bg-gray-700">
                <div className="h-2 rounded-full bg-blue-400" style={{ width: '30%' }}></div>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                {gamificationStats?.total_xp || 0} XP
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-400/30 bg-orange-900/20 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-orange-400">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-3xl">🔥</span>
                <span className="text-3xl font-bold text-white">
                  {gamificationStats?.current_streak || 0}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Longest: {gamificationStats?.longest_streak || 0} days
              </p>
              {(gamificationStats?.current_streak || 0) > 0 && (
                <p className="mt-2 text-xs text-orange-400">
                  Don&apos;t break the chain!
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-purple-400/30 bg-purple-900/20 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-purple-400">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {gamificationStats?.total_workouts_completed || 0}
              </div>
              <p className="mt-1 text-sm text-gray-400">Workouts completed</p>
              <div className="mt-4">
                <div className="text-xl font-bold text-white">
                  {gamificationStats?.total_prs || 0}
                </div>
                <p className="text-xs text-gray-400">Personal Records</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-white/10 bg-white/5 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Start Workout
            </Button>
            <Link href="/history">
              <Button variant="outline" size="lg">
                View History
              </Button>
            </Link>
            <Link href="/progress">
              <Button variant="outline" size="lg">
                View Progress
              </Button>
            </Link>
            <Link href="/achievements">
              <Button variant="outline" size="lg">
                Achievements
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Coming Soon */}
        <div className="rounded-lg border-2 border-dashed border-white/10 p-8 text-center">
          <p className="text-lg text-gray-400">
            More dashboard features coming soon! 🚀
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Next workout preview, achievement showcase, and recent activity feed
          </p>
        </div>
      </div>
    </div>
  )
}
