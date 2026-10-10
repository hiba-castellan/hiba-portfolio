'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, PanInfo } from 'framer-motion'

const GITHUB = 'https://github.com/hiba-castellan'
const CARD_W = 340
const CARD_H = 460
const N = 6

const PROJECTS = [
  {
    id: 0, num: '01', featured: true, accent: '#f0a0c0',
    title: 'FaceGuard',
    subtitle: 'Deepfake Detection & Identity Forensics',
    summary: 'AI forensics platform detecting deepfake manipulations with precision and full explainability.',
    description: 'An AI-powered forensics system engineered to detect deepfake manipulations in video and image content. Leverages computer vision pipelines, frequency-domain analysis, and SHAP-based explainability — delivering not just a verdict but a full forensic breakdown. Built for real-world security applications where transparency is non-negotiable.',
    tags: ['AI', 'Computer Vision', 'Security', 'XAI'],
    tech: ['Python', 'Computer Vision', 'SHAP', 'Scikit-learn', 'NumPy', 'Pandas'],
    github: "https://github.com/hiba-castellan/FaceGuard-Digital-Forensic-System",
    demo: 'https://faceguard-ui.vercel.app', // Add your demo URL here when available
    date: '',
    screenshots: ['/projects/faceguard.png','/projects/faceguard-2.png','/projects/faceguard-3.png'],
  },
  {
    id: 1, num: '02', featured: true, accent: '#a8d8f0',
    title: 'AirChalk',
    subtitle: 'Gesture-Driven AI Drawing System',
    summary: 'Touchless mid-air drawing that transforms hand-sketched objects into animated, intelligent entities using computer vision.',
    description: 'AirChalk is a gesture-driven drawing system enabling users to create digital content in mid-air — no physical input device needed. Real-time hand tracking interprets natural gestures as drawing commands, while an AI layer recognizes completed sketches and converts them into dynamic, animated objects. Draw a fish, watch it swim. Bridges human expression, computer vision, and intelligent systems for applications in education, creative design, and next-gen UIs.',
    tags: ['Computer Vision', 'AI', 'Gesture', 'Animation'],
    tech: ['Python', 'MediaPipe', 'OpenCV', 'Deep Learning', 'Real-time Rendering'],
    github: 'https://github.com/hiba-castellan/airchalk', // Replace with direct repo URL e.g. GITHUB + '/airchalk'
    demo: '#', // Add demo URL or video link when available
    date: 'Feb 2026 – Present',
    screenshots: [],
  },
  {
    id: 2, num: '03', featured: false, accent: '#c4a8e8',
    title: 'Melodigram',
    subtitle: 'Text-to-Music Converter',
    summary: 'Transforms any text into a unique musical composition — and decodes music back into text — with real-time audio and visual feedback.',
    description: 'Melodigram maps characters, words, and patterns to musical notes, letting users hear their name, a phrase, or any message as a melody. It also decodes musical sequences back into text, introducing a creative layer of data representation. Built with real-time audio playback and synchronized visual feedback — where language meets algorithmic music and sound.',
    tags: ['Music', 'Algorithms', 'Creative Tech', 'Audio'],
    tech: ['Python', 'Audio Processing', 'Streamlit', 'NumPy'],
    github: 'https://github.com/hiba-castellan/melodigram', // Replace with direct repo URL
    demo: 'https://melodigram.vercel.app/', // Add demo URL when available
    date: 'Jan 2025 – Mar 2025',
    screenshots: ['/projects/melodigram.png','/projects/melodigram-2.png','/projects/melodigram-3.png','/projects/melodigram-4.png'],
  },
  {
    id: 3, num: '04', featured: false, accent: '#98dcc8',
    title: 'Student Score Predictor',
    subtitle: 'ML-Powered Exam Score Estimator',
    summary: 'A beginner-friendly ML web app that predicts your exam score from study hours — built by a student, for students.',
    description: 'Ever studied all night and wondered what score you\'d get? This app answers that with real machine learning, not tarot cards. Built with scikit-learn and wrapped in a clean Streamlit UI, it predicts exam scores from hours studied, with support for custom subjects and total marks. A genuine, deployable ML project made to practice the fundamentals — and romanticize every small win.',
    tags: ['ML', 'Prediction', 'Education', 'Web App'],
    tech: ['Python', 'Scikit-learn', 'Streamlit', 'Pandas'],
    github: GITHUB, // Replace with direct repo URL
    demo: '#', // Add Streamlit deploy URL when live
    date: '',
    screenshots: [],
  },
  {
    id: 4, num: '05', featured: true, accent: '#f0a58a',
    title: 'Climate AQI Intelligence',
    subtitle: 'Global Air Quality Prediction & Analysis',
    summary: 'End-to-end ML pipeline that analyzes air quality across 15 global cities and predicts both AQI category and AQI value.',
    description: 'A complete data science pipeline covering 15 major cities from 2015 to 2023. It engineers domain-specific features such as a weighted pollutant load, PM ratio, wind dispersion and cyclical seasonality, then trains a Random Forest classifier for 6-class AQI category prediction and a Gradient Boosting regressor for AQI value (R² > 0.97). EDA surfaces regional, seasonal and pollutant-driven patterns, from winter temperature-inversion spikes to wind as the strongest natural mitigator.',
    tags: ['ML', 'Data Science', 'Climate', 'Analytics'],
    tech: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
    github: 'https://github.com/hiba-castellan/climate-aqi-project',
    demo: '#', // Add a Streamlit/Gradio dashboard URL if you build one
    date: '',
    screenshots: [], // e.g. ['/projects/aqi.png', '/projects/aqi-2.png']
  },
  {
    id: 5, num: '06', featured: true, accent: '#f5c97a',
    title: 'MS-DCAFNet',
    subtitle: 'Building Damage Assessment from Satellite Imagery',
    summary: 'Siamese deep learning model that maps pre- and post-disaster satellite images to pixel-level, five-class building damage, with a full explainability pipeline.',
    description: 'Research project from my internship at FACTS-H Lab, IIIT Kottayam. MS-DCAFNet replaces conventional downsampling with a learnable Haar wavelet encoder to preserve building edges, and fuses pre/post-disaster features at all four scales with a Hierarchical Damage-Conditioned Attention Fusion (H-DCAF) module. Trained on xBD with event-based splits to avoid spatial leakage: 94.0% overall accuracy, 0.446 mIoU, 0.612 Kappa. Ablations show H-DCAF beating subtraction and concatenation fusion, and an XAI suite (Grad-CAM, Integrated Gradients, LRP, LIME) checks that predictions follow real structural damage.',
    tags: ['Research', 'Computer Vision', 'Remote Sensing', 'XAI'],
    tech: ['Python', 'PyTorch', 'Siamese Network', 'Wavelets', 'Captum', 'Zennit', 'LIME'],
    github: 'https://github.com/hiba-castellan/ms-dcafnet', // Repo is private for now, so visitors will get a 404 until you make it public
    demo: '#',
    date: 'May 2026 – Jul 2026',
    screenshots: ['/projects/msdcafnet.png', '/projects/msdcafnet-xai.png', '/projects/msdcafnet-gradcam.png'],
  },
]

function signedOffset(i: number, active: number): number {
  let o = i - active
  if (o > N / 2) o -= N
  if (o < -(N / 2)) o += N
  return o
}

export default function Projects() {
  const [active, setActive] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [spread, setSpread] = useState(false)
  const [screenshotIdx, setScreenshotIdx] = useState(0)

  // Reset screenshot index when active card changes or flips
  useEffect(() => { setScreenshotIdx(0) }, [active, flipped])

  // Auto-advance slideshow when flipped and active card has multiple screenshots
  useEffect(() => {
    const shots = PROJECTS[active].screenshots
    if (!flipped || shots.length <= 1) return
    const t = setInterval(() => {
      setScreenshotIdx(i => (i + 1) % shots.length)
    }, 2500)
    return () => clearInterval(t)
  }, [flipped, active])

  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.25 })

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setSpread(true), 350)
      return () => clearTimeout(t)
    }
  }, [inView])

  // Wheel navigation
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    let wheelTimer: ReturnType<typeof setTimeout>
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < 20 && Math.abs(e.deltaY) < 20) return
      clearTimeout(wheelTimer)
      wheelTimer = setTimeout(() => {
        const dir = e.deltaX > 0 || e.deltaY > 0 ? 1 : -1
        setActive(prev => (prev + dir + N) % N)
        setFlipped(false)
      }, 60)
    }
    el.addEventListener('wheel', onWheel, { passive: true })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (info.offset.x < -65 || info.velocity.x < -350) {
      setActive(prev => (prev + 1) % N)
      setFlipped(false)
    } else if (info.offset.x > 65 || info.velocity.x > 350) {
      setActive(prev => (prev - 1 + N) % N)
      setFlipped(false)
    }
  }

  function handleCardClick(off: number) {
    if (off === 0) {
      setFlipped(f => !f)
    } else {
      setActive(prev => (prev + off + N) % N)
      setFlipped(false)
    }
  }

  function getTransform(i: number) {
    const off = signedOffset(i, active)
    const abs = Math.abs(off)
    const isCenter = off === 0

    if (!spread) {
      return {
        x: off * 13, y: abs * 5,
        scale: Math.max(0.82, 1 - abs * 0.06),
        opacity: abs > 3 ? 0 : Math.max(0.25, 1 - abs * 0.28),
        rotateY: off * 2.5,
        zIndex: 10 - abs,
      }
    }
    if (abs > 2) {
      return { x: off > 0 ? 980 : -980, y: 0, scale: 0.45, opacity: 0, rotateY: 0, zIndex: 0 }
    }

    const xArr = [0, 415, 680]
    const sArr = [1.0, 0.77, 0.59]
    const oArr = [1.0, 0.62, 0.28]
    const ryArr = [isCenter && flipped ? 180 : 0, off > 0 ? -6 : 6, off > 0 ? -14 : 14]
    const zArr = [10, 6, 2]

    return {
      x: off >= 0 ? xArr[abs] : -xArr[abs],
      y: abs * 14,
      scale: sArr[abs],
      opacity: oArr[abs],
      rotateY: ryArr[abs],
      zIndex: zArr[abs],
    }
  }

  const current = PROJECTS[active]

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{ padding: '100px 20px 120px', position: 'relative', zIndex: 1, overflow: 'hidden' }}
    >
      <style>{`@keyframes ssfade { from { opacity: 0; transform: scale(1.03); } to { opacity: 1; transform: scale(1); } }`}</style>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{
            fontFamily: "'Fira Code', monospace", fontSize: '0.72rem',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'var(--rose)', marginBottom: 12, textAlign: 'center',
          }}
        >
          // selected work
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          style={{
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15,
            letterSpacing: '-0.02em', marginBottom: 12, textAlign: 'center',
          }}
        >
          Projects that <em style={{ fontStyle: 'italic', color: 'var(--lavender)' }}>Think</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.25 }}
          style={{
            textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem',
            fontFamily: "'Fira Code', monospace", letterSpacing: '0.06em',
            marginBottom: 56,
          }}
        >
          drag · swipe · click center card to reveal details
        </motion.p>
      </div>

      {/* ── CAROUSEL ── */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.08}
        onDragEnd={handleDragEnd}
        style={{
          position: 'relative',
          height: CARD_H + 90,
          cursor: 'grab',
          touchAction: 'pan-y',
          userSelect: 'none',
        }}
        whileDrag={{ cursor: 'grabbing' }}
      >
        {/* Perspective container anchored to centre */}
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          perspective: 1400,
          width: 0, height: 0,
        }}>
          {PROJECTS.map((p, i) => {
            const tf = getTransform(i)
            const off = signedOffset(i, active)
            const isCenter = off === 0
            const abs = Math.abs(off)
            const isHidden = (!spread && abs > 3) || (spread && abs > 2)

            return (
              <motion.div
                key={p.id}
                animate={{
                  x: tf.x, y: tf.y, scale: tf.scale,
                  opacity: tf.opacity, rotateY: tf.rotateY,
                }}
                transition={{ type: 'spring', stiffness: 220, damping: 28 }}
                style={{
                  position: 'absolute',
                  left: -(CARD_W / 2),
                  top: -(CARD_H / 2),
                  width: CARD_W, height: CARD_H,
                  zIndex: tf.zIndex,
                  transformStyle: 'preserve-3d',
                  pointerEvents: isHidden ? 'none' : 'auto',
                  cursor: isCenter ? 'pointer' : 'pointer',
                }}
                onClick={e => { e.stopPropagation(); handleCardClick(off) }}
              >
                {/* ── FRONT ── */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  borderRadius: 20,
                  border: isCenter ? `1px solid ${p.accent}55` : '1px solid var(--border)',
                  background: isCenter
                    ? `linear-gradient(135deg, ${p.accent}0f, rgba(13,13,38,0.96))`
                    : 'var(--surface)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  padding: 28,
                  display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden',
                  boxShadow: isCenter
                    ? `0 24px 70px ${p.accent}22, 0 6px 24px rgba(0,0,0,0.25)`
                    : '0 4px 20px rgba(0,0,0,0.12)',
                  transition: 'border-color 0.4s, box-shadow 0.4s',
                }}>
                  {/* Number watermark */}
                  <div style={{
                    position: 'absolute', bottom: 14, right: 18,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '5.5rem', fontWeight: 300,
                    color: `${p.accent}18`, lineHeight: 1, pointerEvents: 'none',
                  }}>
                    {p.num}
                  </div>

                  {/* Accent top bar */}
                  {isCenter && (
                    <div style={{
                      position: 'absolute', top: 0, left: 32, right: 32, height: 2,
                      background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)`,
                      borderRadius: '0 0 4px 4px',
                    }} />
                  )}

                  {p.featured && (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '3px 10px', borderRadius: 4,
                      background: 'linear-gradient(135deg, var(--rose-deep), var(--lavender))',
                      fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                      fontWeight: 600, color: '#fff', alignSelf: 'flex-start',
                    }}>
                      ✦ Featured
                    </div>
                  )}

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {p.tags.map(t => (
                      <span key={t} style={{
                        padding: '2px 8px', borderRadius: 4,
                        border: `1px solid ${p.accent}40`,
                        fontSize: '0.62rem', letterSpacing: '0.06em', textTransform: 'uppercase',
                        color: p.accent, fontFamily: "'Fira Code', monospace",
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <div>
                    <h3 style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '1.6rem', fontWeight: 400, letterSpacing: '-0.01em',
                      lineHeight: 1.15, color: 'var(--text)', marginBottom: 4,
                    }}>
                      {p.title}
                    </h3>
                    <div style={{
                      fontFamily: "'Fira Code', monospace", fontSize: '0.7rem',
                      color: p.accent, letterSpacing: '0.03em', opacity: 0.85,
                    }}>
                      {p.subtitle}
                    </div>
                  </div>

                  <p style={{
                    fontSize: '0.87rem', color: 'var(--text-muted)',
                    lineHeight: 1.72, fontWeight: 300, flex: 1,
                  }}>
                    {p.summary}
                  </p>

                  {p.date && (
                    <div style={{
                      fontSize: '0.62rem', color: p.date === 'In Progress' ? p.accent : 'var(--text-muted)',
                      fontFamily: "'Fira Code', monospace", letterSpacing: '0.06em',
                      display: 'flex', alignItems: 'center', gap: 5,
                    }}>
                      {p.date === 'In Progress'
                        ? <><span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: p.accent, boxShadow: `0 0 6px ${p.accent}` }} />🚧 In Progress</>
                        : `📅 ${p.date}`}
                    </div>
                  )}

                  {isCenter ? (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: '0.68rem', color: p.accent,
                      fontFamily: "'Fira Code', monospace", letterSpacing: '0.06em', opacity: 0.85,
                    }}>
                      <span style={{ fontSize: '0.8rem' }}>↩</span> Click to explore details
                    </div>
                  ) : (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: '0.66rem', color: 'var(--text-muted)',
                      fontFamily: "'Fira Code', monospace", letterSpacing: '0.06em', opacity: 0.6,
                    }}>
                      Click to bring forward
                    </div>
                  )}
                </div>

                {/* ── BACK ── */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  borderRadius: 20,
                  border: `1px solid ${p.accent}66`,
                  background: `linear-gradient(160deg, ${p.accent}16, rgba(7,7,26,0.97))`,
                  backdropFilter: 'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                  padding: '28px 26px',
                  display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden',
                  boxShadow: `0 24px 70px ${p.accent}28`,
                }}>
                  {/* Accent bar */}
                  <div style={{
                    position: 'absolute', top: 0, left: 32, right: 32, height: 2,
                    background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)`,
                    borderRadius: '0 0 4px 4px',
                  }} />

                  <div style={{
                    fontFamily: "'Fira Code', monospace", fontSize: '0.68rem',
                    color: p.accent, letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}>
                    {p.num} / Details
                  </div>

                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.45rem', fontWeight: 400, color: 'var(--text)',
                    lineHeight: 1.2,
                  }}>
                    {p.title}
                  </h3>

                  <p style={{
                    fontSize: '0.85rem', color: 'var(--text-muted)',
                    lineHeight: 1.75, fontWeight: 300,
                    flex: (isCenter && p.screenshots && p.screenshots.length > 0) ? '0 1 auto' : 1,
                    overflow: 'hidden',
                    display: '-webkit-box', WebkitLineClamp: isCenter && p.screenshots && p.screenshots.length > 0 ? 4 : 10,
                    WebkitBoxOrient: 'vertical' as const,
                  }}>
                    {p.description}
                  </p>

                  {/* ── SCREENSHOT SLIDESHOW ── */}
                  {isCenter && p.screenshots && p.screenshots.length > 0 && (
                    <div
                      onClick={e => e.stopPropagation()}
                      style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}
                    >
                      <img
                        key={screenshotIdx}
                        src={p.screenshots[screenshotIdx]}
                        alt={`${p.title} screenshot ${screenshotIdx + 1}`}
                        style={{
                          width: '100%', height: 110, objectFit: 'cover', display: 'block',
                          borderRadius: 10, border: `1px solid ${p.accent}30`,
                          animation: 'ssfade 0.5s ease',
                        }}
                      />
                      {p.screenshots.length > 1 && (
                        <div style={{
                          position: 'absolute', bottom: 5, left: '50%', transform: 'translateX(-50%)',
                          display: 'flex', gap: 5,
                        }}>
                          {p.screenshots.map((_, si) => (
                            <button
                              key={si}
                              onClick={e => { e.stopPropagation(); setScreenshotIdx(si) }}
                              style={{
                                width: si === screenshotIdx ? 16 : 6, height: 6, borderRadius: 3,
                                border: 'none', padding: 0, cursor: 'pointer',
                                background: si === screenshotIdx ? p.accent : 'rgba(255,255,255,0.35)',
                                transition: 'all 0.3s',
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {p.tech.map(t => (
                      <span key={t} style={{
                        padding: '3px 9px', borderRadius: 4,
                        background: `${p.accent}18`, border: `1px solid ${p.accent}30`,
                        fontSize: '0.68rem', color: p.accent,
                        fontFamily: "'Fira Code', monospace",
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <a
                      href={p.github} target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        padding: '9px 20px', borderRadius: 50,
                        background: `linear-gradient(135deg, ${p.accent}, var(--lavender))`,
                        color: '#fff', fontSize: '0.76rem', fontWeight: 500,
                        textDecoration: 'none',
                      }}
                    >
                      GitHub →
                    </a>
                    {p.demo && p.demo !== '#' ? (
                      <a
                        href={p.demo} target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{
                          padding: '9px 20px', borderRadius: 50,
                          border: '1px solid var(--border)', background: 'transparent',
                          color: 'var(--text-muted)', fontSize: '0.76rem', textDecoration: 'none',
                        }}
                      >
                        Live Demo →
                      </a>
                    ) : (
                      <span style={{
                        padding: '9px 20px', borderRadius: 50,
                        border: '1px solid var(--border)', background: 'transparent',
                        color: 'var(--text-muted)', fontSize: '0.76rem', opacity: 0.45,
                        fontFamily: "'Fira Code', monospace",
                      }}>
                        {p.date === 'In Progress' ? '🚧 demo soon' : 'no demo'}
                      </span>
                    )}
                  </div>

                  <div style={{
                    fontSize: '0.65rem', color: 'var(--text-muted)',
                    fontFamily: "'Fira Code', monospace", opacity: 0.55,
                  }}>
                    ↩ Click to flip back
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* ── CONTROLS ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 8 }}>
        {/* Active card name */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '0.95rem', color: 'var(--text-muted)',
            letterSpacing: '0.04em', fontStyle: 'italic',
          }}
        >
          {current.title}
        </motion.div>

        {/* Dots */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {PROJECTS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setActive(i); setFlipped(false) }}
              style={{
                width: i === active ? 28 : 8,
                height: 8, borderRadius: 4, border: 'none', padding: 0,
                background: i === active
                  ? `linear-gradient(90deg, ${PROJECTS[i].accent}, var(--lavender))`
                  : 'var(--border)',
                cursor: 'pointer',
                transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                boxShadow: i === active ? `0 0 10px ${PROJECTS[i].accent}55` : 'none',
              }}
            />
          ))}
        </div>

        {/* Arrows */}
        <div style={{ display: 'flex', gap: 12 }}>
          {[{ dir: -1, label: '←' }, { dir: 1, label: '→' }].map(({ dir, label }) => (
            <button
              key={dir}
              onClick={() => { setActive(p => (p + dir + N) % N); setFlipped(false) }}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                border: '1px solid var(--border)', background: 'var(--surface)',
                backdropFilter: 'blur(10px)', cursor: 'pointer',
                fontSize: '1rem', color: 'var(--text-muted)',
                transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--rose)'
                e.currentTarget.style.color = 'var(--rose)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-muted)'
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
