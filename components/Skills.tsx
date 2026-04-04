'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// ── DATA ──────────────────────────────────────────────────────────

const SKILL_CATEGORIES = [
  {
    icon: '🧠',
    label: 'Machine Learning & Data Science',
    skills: [
      'Python', 'Scikit-learn', 'SciPy', 'Pandas', 'NumPy',
      'SHAP — Explainable AI', 'Data Analysis / EDA',
      'Data Visualization', 'Predictive Modelling',
      'Statistical Analysis', 'Model Evaluation', 'AI Decision Systems',
    ],
  },
  {
    icon: '⚡',
    label: 'Development',
    skills: ['Next.js', 'React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Web Design'],
  },
  {
    icon: '🛠',
    label: 'Tools & Systems',
    skills: ['PostgreSQL', 'SQL', 'Pydantic', 'MLOps', 'Git & GitHub', 'Vercel'],
  },
]

// ── NOTE LAYOUT ───────────────────────────────────────────────────
// Each note rises from below; delay staggers them nicely.
// `riseFrom` = how far below (px) each note starts before rising up.

const NOTE_CONFIG = [
  {
    catIdx: 0,
    top: '12%', left: '3%',
    rotate: -3.5,
    bg: 'rgba(240,160,192,0.10)',
    border: 'rgba(240,160,192,0.28)',
    pinColor: '#f0a0c0',
    riseFrom: 120,
    delay: 0.05,
  },
  {
    catIdx: 1,
    top: '9%', left: '36%',
    rotate: 1.8,
    bg: 'rgba(196,168,232,0.10)',
    border: 'rgba(196,168,232,0.28)',
    pinColor: '#c4a8e8',
    riseFrom: 150,
    delay: 0.18,
  },
  {
    catIdx: 2,
    top: '13%', left: '68%',
    rotate: -1.2,
    bg: 'rgba(152,220,200,0.10)',
    border: 'rgba(152,220,200,0.28)',
    pinColor: '#98dcc8',
    riseFrom: 110,
    delay: 0.32,
  },
  // Mini accent notes
  {
    catIdx: 0,
    top: '55%', left: '7%',
    rotate: 3.0,
    bg: 'rgba(224,200,120,0.10)',
    border: 'rgba(224,200,120,0.25)',
    pinColor: '#e0c878',
    riseFrom: 90,
    delay: 0.42,
    mini: true,
    miniSkills: ['Python', 'NumPy', 'Pandas', 'SciPy'],
    miniLabel: 'Core Libraries',
  },
  {
    catIdx: 1,
    top: '53%', left: '39%',
    rotate: -2.2,
    bg: 'rgba(240,160,192,0.08)',
    border: 'rgba(240,160,192,0.22)',
    pinColor: '#f0a0c0',
    riseFrom: 100,
    delay: 0.55,
    mini: true,
    miniSkills: ['Next.js', 'React', 'TypeScript'],
    miniLabel: 'Frontend Stack',
  },
  {
    catIdx: 2,
    top: '57%', left: '71%',
    rotate: 2.8,
    bg: 'rgba(196,168,232,0.08)',
    border: 'rgba(196,168,232,0.22)',
    pinColor: '#c4a8e8',
    riseFrom: 130,
    delay: 0.68,
    mini: true,
    miniSkills: ['Git & GitHub', 'MLOps', 'Vercel'],
    miniLabel: 'DevOps & Deploy',
  },
]

type NoteConfig = typeof NOTE_CONFIG[number]
type Phase = 'hidden' | 'rising' | 'pinned' | 'chips'

// ── STICKY NOTE ───────────────────────────────────────────────────

function StickyNote({ note, phase }: { note: NoteConfig; phase: Phase }) {
  const isMini = 'mini' in note && note.mini
  const cat = SKILL_CATEGORIES[note.catIdx]

  // Animate: starts below + invisible → rises to final position → tiny settle bounce
  const isVisible = phase === 'rising' || phase === 'pinned'

  return (
    <motion.div
      initial={{ y: note.riseFrom, opacity: 0, scale: 0.88, rotate: note.rotate - 4 }}
      animate={
        isVisible
          ? { y: 0, opacity: 1, scale: 1, rotate: note.rotate }
          : { y: note.riseFrom, opacity: 0, scale: 0.88, rotate: note.rotate - 4 }
      }
      transition={
        isVisible
          ? {
              duration: 0.72,
              delay: note.delay,
              ease: [0.22, 1, 0.36, 1],   // snappy spring-like ease
            }
          : { duration: 0 }
      }
      style={{
        position: 'absolute',
        top: note.top,
        left: note.left,
        width: isMini ? 162 : 222,
        background: note.bg,
        border: `1px solid ${note.border}`,
        borderRadius: 6,
        padding: isMini ? '14px 16px' : '18px 20px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow:
          '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.06)',
        zIndex: 2,
      }}
    >
      {/* Pin dot */}
      <div style={{
        position: 'absolute', top: -5, left: '50%',
        transform: 'translateX(-50%)',
        width: 9, height: 9, borderRadius: '50%',
        background: note.pinColor,
        boxShadow: `0 2px 8px ${note.pinColor}66`,
        zIndex: 3,
      }} />

      {isMini ? (
        <>
          <div style={{
            fontFamily: "'Fira Code', monospace", fontSize: '0.6rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--text-muted)', marginBottom: 8, opacity: 0.7,
          }}>
            {'miniLabel' in note ? note.miniLabel : ''}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {'miniSkills' in note && Array.isArray(note.miniSkills) &&
              note.miniSkills.map((s: string) => (
                <span key={s} style={{
                  fontSize: '0.78rem', color: 'var(--text)',
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                }}>
                  · {s}
                </span>
              ))}
          </div>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: '0.9rem' }}>{cat.icon}</span>
            <span style={{
              fontFamily: "'Fira Code', monospace", fontSize: '0.6rem',
              letterSpacing: '0.09em', textTransform: 'uppercase',
              color: 'var(--text-muted)', lineHeight: 1.3,
            }}>
              {cat.label}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {cat.skills.slice(0, 5).map(s => (
              <span key={s} style={{
                fontSize: '0.79rem', color: 'var(--text)',
                fontFamily: "'DM Sans', sans-serif", fontWeight: 300, lineHeight: 1.5,
              }}>
                · {s}
              </span>
            ))}
            {cat.skills.length > 5 && (
              <span style={{
                fontSize: '0.68rem', color: 'var(--text-muted)',
                fontFamily: "'Fira Code', monospace",
              }}>
                +{cat.skills.length - 5} more
              </span>
            )}
          </div>
        </>
      )}
    </motion.div>
  )
}

// ── SKILL CHIP ────────────────────────────────────────────────────

function SkillChip({ name, delay }: { name: string; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.38, ease: 'easeOut' }}
      className="skill-chip"
      style={{ display: 'inline-block' }}
    >
      {name}
    </motion.span>
  )
}

// ── MAIN ──────────────────────────────────────────────────────────

export default function Skills() {
  const [phase, setPhase] = useState<Phase>('hidden')
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.25 })

  useEffect(() => {
    if (!inView || phase !== 'hidden') return
    // Short delay after scroll triggers, then start rising
    const t1 = setTimeout(() => setPhase('rising'), 200)
    // Notes are all up → mark as pinned (purely for label text)
    const t2 = setTimeout(() => setPhase('pinned'), 1200)
    // After a beat of showing the board, transition to chips
    const t3 = setTimeout(() => setPhase('chips'), 3200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [inView, phase])

  const showBoard = phase === 'rising' || phase === 'pinned'
  const showChips = phase === 'chips'

  return (
    <section
      id="skills"
      ref={ref}
      style={{
        padding: '100px 40px',
        background: 'linear-gradient(135deg, rgba(240,160,192,0.02), rgba(196,168,232,0.02))',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        position: 'relative', zIndex: 1,
        minHeight: '80vh',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "'Fira Code', monospace", fontSize: '0.72rem',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'var(--rose)', marginBottom: 12,
          }}
        >
          // expertise
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15,
            letterSpacing: '-0.02em', marginBottom: 12,
          }}
        >
          Craft &amp; <em style={{ fontStyle: 'italic', color: 'var(--lavender)' }}>Capability</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          style={{
            fontFamily: "'Fira Code', monospace", fontSize: '0.7rem',
            color: 'var(--text-muted)', letterSpacing: '0.08em',
          }}
        >
          {!inView    && '— skills pinned to the board'}
          {phase === 'hidden'  && '— skills pinned to the board'}
          {phase === 'rising'  && '— pinning skills to the board…'}
          {phase === 'pinned'  && '— skills pinned ✓'}
          {phase === 'chips'   && '— full skill set below'}
        </motion.p>

        {/* ── STICKY NOTE BOARD ── */}
        <AnimatePresence>
          {showBoard && (
            <motion.div
              key="board"
              exit={{ opacity: 0, y: -18, transition: { duration: 0.45, ease: 'easeIn' } }}
              style={{
                position: 'relative',
                height: 490,
                marginTop: 40,
              }}
            >
              {NOTE_CONFIG.map((note, i) => (
                <StickyNote key={i} note={note} phase={phase} />
              ))}

              {/* Subtle "↑ pinning" hint while rising */}
              {phase === 'rising' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{
                    position: 'absolute', bottom: 0, left: '50%',
                    transform: 'translateX(-50%)',
                    fontFamily: "'Fira Code', monospace",
                    fontSize: '0.65rem', color: 'var(--text-muted)',
                    letterSpacing: '0.1em', whiteSpace: 'nowrap',
                    animation: 'floatY 2s ease-in-out infinite',
                  }}
                >
                  ↑ pinning to board
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SKILL CHIPS (replaces board smoothly) ── */}
        <AnimatePresence>
          {showChips && (
            <motion.div
              key="chips"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              style={{ marginTop: 40 }}
            >
              {SKILL_CATEGORIES.map((cat, catIdx) => (
                <motion.div
                  key={cat.label}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: catIdx * 0.13 }}
                  style={{ marginBottom: 44 }}
                >
                  {/* Category header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    fontSize: '0.8rem', letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: 'var(--text-muted)',
                    marginBottom: 20, fontWeight: 500,
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                    {cat.label}
                    <div style={{
                      flex: 1, height: 1,
                      background: 'linear-gradient(to right, var(--border), transparent)',
                    }} />
                  </div>

                  {/* Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {cat.skills.map((skill, i) => (
                      <SkillChip
                        key={skill}
                        name={skill}
                        delay={catIdx * 0.08 + i * 0.04}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}
