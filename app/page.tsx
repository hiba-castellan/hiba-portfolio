'use client'

import { useEffect, useRef, useState } from 'react'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Projects from '@/components/Projects'
import Research from '@/components/Research'
import Resume from '@/components/Resume'
import Contact from '@/components/Contact'
import PetalCanvas from '@/components/PetalCanvas'
import ScrollProgress from '@/components/ScrollProgress'
import CustomCursor from '@/components/CustomCursor'

export default function Home() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  useEffect(() => {
    document.documentElement.className = theme === 'light' ? 'light' : ''
  }, [theme])

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <CustomCursor />
      <ScrollProgress />
      <PetalCanvas />
      <Navigation theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <Stats />
        <About />
        <Skills />
        <Projects />
        <Research />
        <Resume />
        <Contact />
      </main>
      <footer style={{
        textAlign: 'center',
        padding: '32px',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border)',
        fontFamily: "'Fira Code', monospace",
        letterSpacing: '0.06em'
      }}>
        ✦ Designed &amp; Built by{' '}
        <span style={{ color: 'var(--rose)' }}>Hiba V S</span>
        {' '}· 2026 · All Rights Reserved
      </footer>
    </div>
  )
}
