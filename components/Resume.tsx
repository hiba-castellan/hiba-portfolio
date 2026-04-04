'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function Resume() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <div
      id="resume"
      ref={ref}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
        padding: '80px 40px', textAlign: 'center',
        borderTop: '1px solid var(--border)',
        position: 'relative', zIndex: 1,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{
          fontFamily: "'Fira Code', monospace",
          fontSize: '0.72rem', letterSpacing: '0.15em',
          textTransform: 'uppercase', color: 'var(--rose)',
        }}
      >
        // resume
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          fontWeight: 300, letterSpacing: '-0.02em',
        }}
      >
        Download My CV
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          color: 'var(--text-muted)', maxWidth: 440,
          lineHeight: 1.7, fontWeight: 300, fontSize: '0.97rem',
        }}
      >
        My full resume details my academic record, project outcomes, and technical skills —
        available on request or via the button below.
      </motion.p>

      <motion.a
        href="/resume.pdf"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(212,96,122,0.5)' }}
        whileTap={{ scale: 0.97 }}
        style={{
          padding: '16px 40px', borderRadius: 50,
          background: 'linear-gradient(135deg, var(--rose-deep), rgba(196,168,232,0.8))',
          color: '#fff', fontSize: '0.9rem', fontWeight: 500,
          letterSpacing: '0.05em', textDecoration: 'none',
          boxShadow: '0 4px 20px rgba(212,96,122,0.3)',
          display: 'inline-block',
        }}
      >
        📄 Download Resume
      </motion.a>
    </div>
  )
}
