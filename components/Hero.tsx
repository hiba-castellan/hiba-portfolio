'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const PHRASES = [
  'Data Science Enthusiast',
  'Aspiring ML Engineer',
  'Explainable AI Advocate',
  'Computer Vision Builder',
  'Statistical Thinker',
]

function useTyping(phrases: string[]) {
  const [text, setText] = useState('')
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const phrase = phrases[phraseIdx]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting) {
      if (charIdx < phrase.length) {
        timeout = setTimeout(() => {
          setText(phrase.slice(0, charIdx + 1))
          setCharIdx(c => c + 1)
        }, 60 + Math.random() * 40)
      } else {
        timeout = setTimeout(() => setDeleting(true), 1800)
      }
    } else {
      if (charIdx > 0) {
        timeout = setTimeout(() => {
          setText(phrase.slice(0, charIdx - 1))
          setCharIdx(c => c - 1)
        }, 30)
      } else {
        setDeleting(false)
        setPhraseIdx(i => (i + 1) % phrases.length)
      }
    }

    return () => clearTimeout(timeout)
  }, [charIdx, deleting, phraseIdx, phrases])

  return text
}

function MagneticBtn({ children, href, primary }: { children: React.ReactNode, href: string, primary?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null)

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.25
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.25
    el.style.transform = `translate(${dx}px, ${dy}px)`
  }

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        padding: '14px 32px',
        borderRadius: 50,
        fontSize: '0.88rem',
        fontWeight: 500,
        letterSpacing: '0.05em',
        cursor: 'pointer',
        transition: 'box-shadow 0.3s, opacity 0.3s',
        display: 'inline-block',
        textDecoration: 'none',
        ...(primary ? {
          background: 'linear-gradient(135deg, var(--rose-deep), rgba(196,168,232,0.8))',
          color: '#fff',
          border: 'none',
          boxShadow: '0 4px 20px rgba(212,96,122,0.3)',
        } : {
          background: 'var(--surface)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
        }),
      }}
      onMouseEnter={e => {
        if (primary) {
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(212,96,122,0.5)'
        } else {
          e.currentTarget.style.borderColor = 'var(--rose)'
          e.currentTarget.style.color = 'var(--rose)'
          e.currentTarget.style.boxShadow = '0 4px 20px var(--glow-rose)'
        }
      }}
    >
      {children}
    </a>
  )
}

export default function Hero() {
  const typingText = useTyping(PHRASES)

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 40px 40px',
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      {/* Background radial gradients */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: -1,
        background: `
          radial-gradient(ellipse 80% 60% at 50% 40%, rgba(196,168,232,0.08) 0%, transparent 70%),
          radial-gradient(ellipse 60% 40% at 20% 60%, rgba(240,160,192,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 50% 50% at 80% 30%, rgba(152,220,200,0.04) 0%, transparent 60%)
        `,
      }} />

      <div style={{
        maxWidth: 900,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
      }}>
        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 50,
            border: '1px solid var(--border)', background: 'var(--surface)',
            backdropFilter: 'blur(10px)',
            fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--rose)', fontFamily: "'Fira Code', monospace",
          }}
        >
          <span style={{
            display: 'inline-block', width: 6, height: 6,
            background: 'var(--rose)', borderRadius: '50%',
            animation: 'pulseDot 2s infinite',
          }} />
          Open to Opportunities
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(3.5rem, 9vw, 7rem)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, var(--text) 0%, var(--rose) 40%, var(--lavender) 70%, var(--text) 100%)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shimmer 6s ease infinite',
          }}
        >
          Hiba V S
        </motion.h1>

        {/* Typing */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
            color: 'var(--lavender)',
            minHeight: '1.8em',
            letterSpacing: '0.04em',
          }}
        >
          {typingText}
          <span className="blink" style={{ borderRight: '2px solid var(--lavender)', marginLeft: 2 }} />
        </motion.div>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          style={{
            maxWidth: 620,
            fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)',
            lineHeight: 1.8,
            color: 'var(--text-muted)',
            fontWeight: 300,
          }}
        >
          Computer Science Engineering student specializing in Data Science —
          building intelligent systems that decode complexity into clarity.
          I architect data-driven solutions at the intersection of precision, creativity, and real-world impact.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}
        >
          <MagneticBtn href="#projects" primary>View My Work</MagneticBtn>
          <MagneticBtn href="#contact">Get In Touch</MagneticBtn>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        style={{
          position: 'absolute', bottom: 40, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          color: 'var(--text-muted)', fontSize: '0.7rem', letterSpacing: '0.12em',
          textTransform: 'uppercase',
          animation: 'floatY 3s ease-in-out infinite',
        }}
      >
        <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--rose), transparent)' }} />
        <span>Scroll</span>
      </motion.div>
    </section>
  )
}
