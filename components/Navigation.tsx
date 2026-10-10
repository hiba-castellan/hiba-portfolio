'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface NavProps {
  theme: 'dark' | 'light'
  toggleTheme: () => void
}

const links = ['About', 'Skills', 'Projects', 'Research', 'Contact']

export default function Navigation({ theme, toggleTheme }: NavProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 1000,
        padding: '16px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: scrolled ? 'rgba(7,7,26,0.75)' : 'rgba(7,7,26,0.4)',
        borderBottom: `1px solid var(--border)`,
        transition: 'background 0.3s',
      }}
    >
      {/* Logo */}
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '1.6rem',
        fontWeight: 600,
        background: 'linear-gradient(135deg, var(--rose), var(--lavender))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '0.03em',
      }}>
        H V S
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        {links.map(link => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            style={{
              fontSize: '0.82rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              fontWeight: 400,
              position: 'relative',
              textDecoration: 'none',
              transition: 'color 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--rose)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            {link}
          </a>
        ))}
        <button
          onClick={toggleTheme}
          style={{
            width: 40, height: 40,
            borderRadius: '50%',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget
            el.style.borderColor = 'var(--rose)'
            el.style.boxShadow = '0 0 15px var(--glow-rose)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget
            el.style.borderColor = 'var(--border)'
            el.style.boxShadow = 'none'
          }}
        >
          {theme === 'dark' ? '🌸' : '🌙'}
        </button>
      </div>
    </motion.nav>
  )
}
