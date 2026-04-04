import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hiba V S — ML Engineer & Data Scientist',
  description: 'Computer Science Engineering student specializing in Data Science and Machine Learning. Building intelligent systems that decode complexity into clarity.',
  keywords: ['Machine Learning', 'Data Science', 'AI', 'Computer Vision', 'Python', 'Next.js'],
  authors: [{ name: 'Hiba V S' }],
  openGraph: {
    title: 'Hiba V S — ML Engineer & Data Scientist',
    description: 'Portfolio of Hiba V S — aspiring ML Engineer specializing in Data Science and AI.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Fira+Code:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
