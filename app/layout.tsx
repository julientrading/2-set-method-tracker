import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '2 Set Method - Soviet-Inspired Strength Training',
  description: 'Build strength and muscle with minimal volume and maximum intensity. Science-backed training program based on Soviet principles.',
  keywords: ['workout tracker', 'strength training', 'calisthenics', '2 set method', 'soviet training', 'fitness app'],
  authors: [{ name: '2 Set Method' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://2setmethod.com',
    siteName: '2 Set Method',
    title: '2 Set Method - Soviet-Inspired Strength Training',
    description: 'Build strength and muscle with minimal volume and maximum intensity.',
  },
  twitter: {
    card: 'summary_large_image',
    title: '2 Set Method - Soviet-Inspired Strength Training',
    description: 'Build strength and muscle with minimal volume and maximum intensity.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
