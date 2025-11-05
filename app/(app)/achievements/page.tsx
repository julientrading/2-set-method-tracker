import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="container mx-auto max-w-6xl space-y-8 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-white">Achievements</h1>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Achievement showcase with filtering and progress tracking</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
