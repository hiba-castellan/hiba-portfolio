'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

/* ───────── CONFIG ───────── */
const GOLD = '#f5c97a'
const REPO = 'https://github.com/hiba-castellan/ms-dcafnet' // 404 for visitors while the repo is private
const REPORT = '/research/msdcafnet-report.pdf'             // set to '' to hide the report button

const MONO = "'Fira Code', monospace"
const SERIF = "'Cormorant Garamond', serif"

/* ───────── DATA (all numbers come from the internship report) ───────── */
const STEPS = [
  { icon: '🛰️', name: 'Image pair', text: 'A pre- and post-disaster tile from xBD (256×256) enters a Siamese network with shared weights, so any difference between the two streams is real change.' },
  { icon: '🌊', name: 'Wavelet encoder', text: 'Learnable Haar downsampling splits each 2×2 patch into LL, LH, HL and HH bands, so building edges survive instead of being pooled away.' },
  { icon: '🔀', name: 'H-DCAF fusion', text: 'Pre, post and change features are fused at all four scales. A change-driven Scale-Weight MLP then decides which scale to trust.' },
  { icon: '🧩', name: 'UNet++ decoder', text: 'The fused features act as skip connections. Two auxiliary heads supervise training and are dropped at inference.' },
  { icon: '🏚️', name: 'Damage map', text: 'Every pixel is labelled Background, No damage, Minor, Major or Destroyed.' },
]
const LAST = STEPS.length - 1

// . = terrain, n = no damage, a = minor, j = major, d = destroyed
const MAP = [
  '..n.n....a..',
  '.nn..n..n.j.',
  '....n.dd.j..',
  '.n.a..dd....',
  '..n.....n.a.',
  '.a..jj.n....',
  '...n.jj..d.n',
]

const DMG: Record<string, { color: string; label: string }> = {
  n: { color: '#3b82d6', label: 'No damage' },
  a: { color: '#f0a030', label: 'Minor' },
  j: { color: '#e04848', label: 'Major' },
  d: { color: '#9b4fa0', label: 'Destroyed' },
}

const METRICS = [
  { label: 'F1 damaged', value: 39.83, decimals: 2, suffix: '%', note: 'primary metric' },
  { label: 'Overall accuracy', value: 94.03, decimals: 2, suffix: '%', note: 'inflated by background' },
  { label: 'mIoU', value: 0.446, decimals: 3, suffix: '', note: 'all 5 classes' },
  { label: "Cohen's kappa", value: 0.612, decimals: 3, suffix: '', note: 'substantial agreement' },
]

const ABLATION = [
  { name: 'Subtraction', v: 0.1687, ours: false },
  { name: 'Concatenation', v: 0.1785, ours: false },
  { name: 'Single-scale DCAF', v: 0.1715, ours: false },
  { name: 'H-DCAF ×4 (ours)', v: 0.2025, ours: true },
]

const CLASSES = [
  { name: 'Background', v: 0.9716, color: '#8a8a95' },
  { name: 'No damage', v: 0.6917, color: DMG.n.color },
  { name: 'Minor', v: 0.2811, color: DMG.a.color },
  { name: 'Major', v: 0.4404, color: DMG.j.color },
  { name: 'Destroyed', v: 0.4733, color: DMG.d.color },
]

const FINDINGS = [
  { title: 'Edges survive the downsampling', text: 'The learned Haar weights favour the horizontal and vertical detail bands over the smooth band at every active stage.' },
  { title: 'Where you fuse matters', text: 'The same fusion module applied at all four scales beats the bottleneck-only version by 3.1 points of F1 damaged.' },
  { title: 'Predictions follow buildings', text: 'Grad-CAM, Integrated Gradients and LRP concentrate on annotated building footprints. The fused map is sharper than either single branch.' },
]

const XAI = [
  { id: 'master', label: 'All methods', src: '/research/fig_master_xai.png', caption: 'One panel for the Destroyed class: native attention, Grad-CAM, Integrated Gradients, LRP, LIME, Gradient×Input and occlusion.' },
  { id: 'gradcam', label: 'Grad-CAM', src: '/research/fig_gradcam.png', caption: 'Per-class saliency through the pre-disaster branch, post-disaster branch and fused bottleneck.' },
  { id: 'ig', label: 'Integrated Gradients', src: '/research/fig_integrated_gradients.png', caption: 'Pixel attributions for Minor, Major and Destroyed (10 steps, zero baseline).' },
  { id: 'lrp', label: 'LRP', src: '/research/fig_lrp.png', caption: 'Relevance propagated back to the pre-disaster pixels for all five classes.' },
  { id: 'native', label: 'Native attention', src: '/research/fig_native_attention.png', caption: 'H-DCAF scale weights, CBAM maps, DCAF change gates and Haar band weights from a single forward pass.' },
]

/* ───────── HELPERS ───────── */
function CountUp({ to, decimals, suffix, run }: { to: number; decimals: number; suffix: string; run: boolean }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf = 0
    const start = performance.now()
    const dur = 1400
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1)
      setV(to * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, to])
  return <>{v.toFixed(decimals)}{suffix}</>
}

const glass: React.CSSProperties = {
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  borderRadius: 20,
}

const label: React.CSSProperties = {
  fontFamily: MONO, fontSize: '0.68rem', letterSpacing: '0.1em',
  textTransform: 'uppercase', color: 'var(--text-muted)',
}

const ease = [0.4, 0, 0.2, 1] as const

/* ───────── COMPONENT ───────── */
export default function Research() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  const [open, setOpen] = useState(false)
  const [grown, setGrown] = useState(false) // lets bars animate after the panel mounts
  const [reduced, setReduced] = useState(false)
  const [step, setStep] = useState(LAST)    // starts on the finished damage map
  const [auto, setAuto] = useState(false)
  const [tab, setTab] = useState(0)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // bars and counters start a moment after the panel opens
  useEffect(() => {
    if (!open) { setGrown(false); return }
    const t = setTimeout(() => setGrown(true), 250)
    return () => clearTimeout(t)
  }, [open])

  // pipeline auto-advance, only while open
  useEffect(() => {
    if (!open || !auto) return
    const t = setInterval(() => setStep(s => (s + 1) % STEPS.length), 3200)
    return () => clearInterval(t)
  }, [open, auto])

  function toggle() {
    if (open) {
      setOpen(false)
      setAuto(false)
      setStep(LAST)
      document.getElementById('research')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
    } else {
      setOpen(true)
      setStep(0)
      setAuto(!reduced)
    }
  }

  const revealed = step === LAST
  const detecting = open && step === 2
  let bIdx = 0

  return (
    <section id="research" ref={ref} style={{ padding: '100px 20px 120px', position: 'relative', zIndex: 1 }}>
      <style>{`
        @keyframes rsPulse { 0%,100% { box-shadow: 0 0 0 0 ${GOLD}66 } 50% { box-shadow: 0 0 0 6px ${GOLD}00 } }
        .rs-btn:hover { transform: translateY(-1px); }
        .rs-btn:focus-visible, .rs-tab:focus-visible, .rs-step:focus-visible { outline: 2px solid ${GOLD}; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { .rs-pulse { animation: none !important; } }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ ...label, color: 'var(--rose)', fontSize: '0.72rem', letterSpacing: '0.15em', marginBottom: 12, textAlign: 'center' }}>
          // research
        </div>
        <h2 style={{
          fontFamily: SERIF, fontWeight: 300, fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 12, textAlign: 'center',
        }}>
          Research that <em style={{ fontStyle: 'italic', color: 'var(--lavender)' }}>Sees</em>
        </h2>
        <p style={{
          textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem',
          fontFamily: MONO, letterSpacing: '0.06em', marginBottom: 56,
        }}>
          teaching a network to read disaster damage from orbit
        </p>

        {/* ── PAPER CARD (always visible) ── */}
        <div style={{
          ...glass, padding: 'clamp(22px, 4vw, 40px)',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'clamp(24px, 4vw, 48px)',
          boxShadow: `0 24px 70px ${GOLD}14`, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 32, right: 32, height: 2,
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          }} />

          {/* Paper info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start', ...label, color: GOLD }}>
              <span className="rs-pulse" style={{
                width: 7, height: 7, borderRadius: '50%', background: GOLD,
                animation: 'rsPulse 2.4s ease-in-out infinite',
              }} />
              Manuscript in preparation
            </div>

            <h3 style={{
              fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(1.35rem, 2.6vw, 1.85rem)',
              lineHeight: 1.25, letterSpacing: '-0.01em', color: 'var(--text)',
            }}>
              MS-DCAFNet: Multi-Scale Damage-Conditioned Adaptive Fusion Network for Building Damage Assessment from Bi-Temporal Satellite Imagery
            </h3>

            <div style={{ fontFamily: MONO, fontSize: '0.72rem', color: GOLD, lineHeight: 1.8 }}>
              Hiba V S<br />
              <span style={{ color: 'var(--text-muted)' }}>
                FACTS-H Lab, IIIT Kottayam, supervised by Dr. Ansith S<br />
                Summer research internship, May to July 2026
              </span>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.75, fontWeight: 300, maxWidth: '62ch' }}>
              Most damage-assessment models lose building edges when they downsample, then fuse the before and after images with a simple subtraction. MS-DCAFNet keeps the edges with learnable wavelets and fuses the pair at every scale with an attention module conditioned on how much changed. Trained on xBD with an event-based split, and opened up with eight explanation methods.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['xBD', 'Event-based split', 'Siamese', 'Haar wavelets', 'Explainable AI'].map(t => (
                <span key={t} style={{
                  padding: '3px 9px', borderRadius: 4, border: `1px solid ${GOLD}40`,
                  fontSize: '0.68rem', color: GOLD, fontFamily: MONO,
                }}>{t}</span>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
              <button
                className="rs-btn" onClick={toggle}
                aria-expanded={open} aria-controls="research-details"
                style={{
                  padding: '10px 22px', borderRadius: 50, cursor: 'pointer', border: 'none',
                  fontSize: '0.78rem', fontWeight: 500, color: '#fff', fontFamily: 'inherit',
                  background: `linear-gradient(135deg, ${GOLD}, var(--lavender))`,
                  transition: 'transform 0.2s', display: 'inline-flex', alignItems: 'center', gap: 8,
                }}
              >
                {open ? 'Hide the details' : 'Explore the research'}
                <span aria-hidden style={{ display: 'inline-block', transition: 'transform 0.4s', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
              </button>
              {REPORT && (
                <a className="rs-btn" href={REPORT} target="_blank" rel="noopener noreferrer" style={{
                  padding: '10px 22px', borderRadius: 50, textDecoration: 'none', fontSize: '0.78rem',
                  color: 'var(--text-muted)', border: '1px solid var(--border)', transition: 'transform 0.2s',
                }}>Read the report</a>
              )}
              <a className="rs-btn" href={REPO} target="_blank" rel="noopener noreferrer" style={{
                padding: '10px 22px', borderRadius: 50, textDecoration: 'none', fontSize: '0.78rem',
                color: 'var(--text-muted)', border: '1px solid var(--border)', transition: 'transform 0.2s',
              }}>GitHub</a>
            </div>
          </div>

          {/* Damage map (+ pipeline controls when open) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={label}>{open ? 'how one tile becomes a damage map' : 'a predicted damage map'}</div>

            <div
              role="img"
              aria-label="Illustrative damage map: a grid of buildings coloured by predicted damage class"
              style={{
                display: 'grid', gridTemplateColumns: `repeat(${MAP[0].length}, 1fr)`, gap: 4,
                padding: 12, borderRadius: 12, border: '1px solid var(--border)',
                background: 'rgba(128,128,140,0.06)',
              }}
            >
              {MAP.flatMap((row, r) => row.split('').map((ch, c) => {
                const isB = ch !== '.'
                const idx = isB ? bIdx++ : 0
                const damaged = ch === 'a' || ch === 'j' || ch === 'd'
                return (
                  <div key={`${r}-${c}`} style={{
                    aspectRatio: '1', borderRadius: 3,
                    background: !isB ? 'transparent' : revealed ? DMG[ch].color : 'rgba(150,150,170,0.35)',
                    border: isB && detecting && damaged ? `1px solid ${GOLD}` : '1px solid transparent',
                    boxShadow: isB && detecting && damaged ? `0 0 8px ${GOLD}88` : 'none',
                    transition: `background 0.5s ease ${revealed && open ? idx * 30 : 0}ms, box-shadow 0.4s, border-color 0.4s`,
                  }} />
                )
              }))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: MONO }}>
              {Object.values(DMG).map(d => (
                <span key={d.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />{d.label}
                </span>
              ))}
              <span style={{ opacity: 0.7 }}>(illustrative)</span>
            </div>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="steps"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '2px 2px 4px' }}>
                    <div role="tablist" aria-label="Pipeline stages" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {STEPS.map((s, i) => (
                        <button
                          key={s.name} role="tab" aria-selected={i === step}
                          className="rs-step"
                          onClick={() => { setStep(i); setAuto(false) }}
                          style={{
                            padding: '6px 11px', borderRadius: 50, cursor: 'pointer',
                            fontSize: '0.72rem', fontFamily: MONO,
                            border: `1px solid ${i === step ? GOLD : 'var(--border)'}`,
                            background: i === step ? `${GOLD}22` : 'transparent',
                            color: i === step ? GOLD : 'var(--text-muted)',
                            transition: 'all 0.3s',
                          }}
                        >
                          {s.icon} {s.name}
                        </button>
                      ))}
                    </div>
                    <p style={{ minHeight: '5.2em', fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 300 }} aria-live="polite">
                      {STEPS[step].text}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── FULL DETAILS (only after the button is pressed) ── */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="research-details"
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ paddingTop: 28 }}>
                {/* Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 10 }}>
                  {METRICS.map(m => (
                    <div key={m.label} style={{ ...glass, padding: '20px 22px' }}>
                      <div style={{ fontFamily: SERIF, fontSize: '2.4rem', fontWeight: 300, lineHeight: 1, color: 'var(--text)' }}>
                        <CountUp to={m.value} decimals={m.decimals} suffix={m.suffix} run={grown} />
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text)', marginTop: 8 }}>{m.label}</div>
                      <div style={{ ...label, textTransform: 'none', letterSpacing: '0.03em', marginTop: 2 }}>{m.note}</div>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily: MONO, fontSize: '0.66rem', color: 'var(--text-muted)', opacity: 0.8, marginBottom: 28 }}>
                  Official xBD test set, 933 tiles. Accuracy is inflated by background pixels, so F1 damaged is the number to compare.
                </p>

                {/* Ablation + per-class */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 28 }}>
                  <div style={{ ...glass, padding: 26 }}>
                    <div style={label}>ablation: how the two images are fused</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18 }}>
                      {ABLATION.map((a, i) => (
                        <div key={a.name}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 5, color: a.ours ? GOLD : 'var(--text-muted)' }}>
                            <span>{a.name}</span>
                            <span style={{ fontFamily: MONO }}>{a.v.toFixed(4)}</span>
                          </div>
                          <div style={{ height: 8, borderRadius: 4, background: 'rgba(150,150,170,0.15)', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%', borderRadius: 4,
                              width: grown ? `${(a.v / 0.22) * 100}%` : '0%',
                              background: a.ours ? `linear-gradient(90deg, ${GOLD}, var(--lavender))` : 'rgba(150,150,170,0.5)',
                              transition: `width 1.1s cubic-bezier(0.4,0,0.2,1) ${i * 130}ms`,
                            }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontFamily: MONO, fontSize: '0.66rem', color: 'var(--text-muted)', opacity: 0.8, marginTop: 16 }}>
                      Validation F1 damaged on one held-out disaster event. Same encoder, decoder, loss and schedule in every row.
                    </p>
                  </div>

                  <div style={{ ...glass, padding: 26 }}>
                    <div style={label}>F1 by class (test)</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18 }}>
                      {CLASSES.map((c, i) => (
                        <div key={c.name}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 5, color: 'var(--text-muted)' }}>
                            <span>{c.name}</span>
                            <span style={{ fontFamily: MONO }}>{c.v.toFixed(3)}</span>
                          </div>
                          <div style={{ height: 8, borderRadius: 4, background: 'rgba(150,150,170,0.15)', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%', borderRadius: 4, background: c.color,
                              width: grown ? `${c.v * 100}%` : '0%',
                              transition: `width 1.1s cubic-bezier(0.4,0,0.2,1) ${i * 130}ms`,
                            }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontFamily: MONO, fontSize: '0.66rem', color: 'var(--text-muted)', opacity: 0.8, marginTop: 16 }}>
                      Minor damage is the hardest class: it is the rarest and the subtlest at 256×256.
                    </p>
                  </div>
                </div>

                {/* Findings */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28, marginBottom: 36, padding: '0 6px' }}>
                  {FINDINGS.map(f => (
                    <div key={f.title} style={{ borderLeft: `2px solid ${GOLD}`, paddingLeft: 16 }}>
                      <div style={{ fontFamily: SERIF, fontSize: '1.2rem', color: 'var(--text)', marginBottom: 6, lineHeight: 1.3 }}>{f.title}</div>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 300 }}>{f.text}</p>
                    </div>
                  ))}
                </div>

                {/* XAI gallery */}
                <div style={{ ...glass, padding: 'clamp(18px, 3vw, 28px)' }}>
                  <div style={{ ...label, marginBottom: 14 }}>looking inside the model</div>
                  <div role="tablist" aria-label="Explanation methods" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                    {XAI.map((x, i) => (
                      <button
                        key={x.id} role="tab" aria-selected={i === tab} className="rs-tab"
                        onClick={() => setTab(i)}
                        style={{
                          padding: '6px 13px', borderRadius: 50, cursor: 'pointer', fontSize: '0.74rem', fontFamily: MONO,
                          border: `1px solid ${i === tab ? GOLD : 'var(--border)'}`,
                          background: i === tab ? `${GOLD}22` : 'transparent',
                          color: i === tab ? GOLD : 'var(--text-muted)', transition: 'all 0.3s',
                        }}
                      >
                        {x.label}
                      </button>
                    ))}
                  </div>

                  <a href={XAI[tab].src} target="_blank" rel="noopener noreferrer" title="Open full size" style={{
                    display: 'block', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)',
                    background: 'rgba(0,0,0,0.25)',
                  }}>
                    <img
                      key={XAI[tab].src}
                      src={XAI[tab].src}
                      alt={`${XAI[tab].label} explanation for MS-DCAFNet`}
                      loading="lazy"
                      style={{ display: 'block', width: '100%', maxHeight: 440, objectFit: 'contain' }}
                    />
                  </a>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 300, marginTop: 12 }} aria-live="polite">
                    {XAI[tab].caption} <span style={{ fontFamily: MONO, fontSize: '0.66rem', opacity: 0.7 }}>Click the image to open it full size.</span>
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
                  <button
                    className="rs-btn" onClick={toggle}
                    style={{
                      padding: '10px 24px', borderRadius: 50, cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'inherit',
                      color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'transparent',
                      transition: 'transform 0.2s',
                    }}
                  >
                    Hide the details ▴
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
