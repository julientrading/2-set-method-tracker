import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome to 2 Set Method! 🎉</CardTitle>
          <CardDescription className="text-lg">
            Let&apos;s set up your account and get you started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
            <p className="text-lg text-muted-foreground">
              Onboarding flow coming soon!
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;ll help you determine your fitness level and customize your program
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg">Skip to Dashboard</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
