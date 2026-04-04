'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useRef, useEffect, useState } from 'react'

// ─── FLOWER DEFINITIONS ───────────────────────────────────────────
type FlowerKind = 'daisy' | 'dandelion' | 'tulip'

interface FlowerDef {
  id: number
  x: number
  kind: FlowerKind
  scale: number
  color: string
  stemHeight: number
  delay: number
  swayDur: number
  swayAmt: number
}

const FLOWERS: FlowerDef[] = [
  { id:0,  x:3,  kind:'daisy',     scale:0.70, color:'#f0a0c0', stemHeight:70,  delay:0.00, swayDur:3.2, swayAmt:4 },
  { id:1,  x:9,  kind:'dandelion', scale:0.85, color:'#e0c878', stemHeight:95,  delay:0.12, swayDur:2.8, swayAmt:5 },
  { id:2,  x:15, kind:'tulip',     scale:0.65, color:'#c4a8e8', stemHeight:62,  delay:0.25, swayDur:3.5, swayAmt:3 },
  { id:3,  x:21, kind:'daisy',     scale:1.00, color:'#ffffff', stemHeight:82,  delay:0.04, swayDur:3.0, swayAmt:6 },
  { id:4,  x:28, kind:'dandelion', scale:0.75, color:'#c4a8e8', stemHeight:88,  delay:0.38, swayDur:3.8, swayAmt:4 },
  { id:5,  x:35, kind:'tulip',     scale:0.90, color:'#f0a0c0', stemHeight:76,  delay:0.18, swayDur:2.6, swayAmt:5 },
  { id:6,  x:42, kind:'daisy',     scale:0.80, color:'#e0c878', stemHeight:66,  delay:0.32, swayDur:3.3, swayAmt:3 },
  { id:7,  x:49, kind:'dandelion', scale:1.05, color:'#e0c878', stemHeight:100, delay:0.08, swayDur:2.9, swayAmt:6 },
  { id:8,  x:56, kind:'tulip',     scale:0.70, color:'#98dcc8', stemHeight:70,  delay:0.44, swayDur:3.6, swayAmt:4 },
  { id:9,  x:63, kind:'daisy',     scale:0.95, color:'#f0a0c0', stemHeight:84,  delay:0.22, swayDur:3.1, swayAmt:5 },
  { id:10, x:70, kind:'dandelion', scale:0.80, color:'#c4a8e8', stemHeight:90,  delay:0.50, swayDur:4.0, swayAmt:3 },
  { id:11, x:77, kind:'tulip',     scale:0.85, color:'#f0a0c0', stemHeight:73,  delay:0.14, swayDur:2.7, swayAmt:6 },
  { id:12, x:84, kind:'daisy',     scale:0.70, color:'#ffffff', stemHeight:63,  delay:0.36, swayDur:3.4, swayAmt:4 },
  { id:13, x:91, kind:'dandelion', scale:0.90, color:'#e0c878', stemHeight:83,  delay:0.06, swayDur:3.0, swayAmt:5 },
  { id:14, x:97, kind:'tulip',     scale:0.75, color:'#98dcc8', stemHeight:68,  delay:0.28, swayDur:3.7, swayAmt:3 },
]

// ─── SVG HEADS ────────────────────────────────────────────────────
function DaisyHead({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="-20 -20 40 40" style={{ overflow:'visible' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <ellipse key={i} cx={0} cy={-11} rx={3.5} ry={7}
          fill={color} opacity={0.88}
          transform={`rotate(${i * 45})`}
          style={{ filter:`drop-shadow(0 0 3px ${color}88)` }} />
      ))}
      <circle cx={0} cy={0} r={5} fill="#e0c878" style={{ filter:'drop-shadow(0 0 4px #e0c87888)' }} />
      <circle cx={0} cy={0} r={3} fill="#c8a840" />
    </svg>
  )
}

function DandelionHead({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="-22 -22 44 44" style={{ overflow:'visible' }}>
      {Array.from({ length: 18 }).map((_, i) => {
        const angle = (i / 18) * 360
        const rad = (angle * Math.PI) / 180
        const x2 = Math.cos(rad) * 18, y2 = Math.sin(rad) * 18
        return (
          <g key={i}>
            <line x1={0} y1={0} x2={x2} y2={y2} stroke={color} strokeWidth={0.8} opacity={0.6} />
            <circle cx={x2} cy={y2} r={2.2} fill={color} opacity={0.85}
              style={{ filter:`drop-shadow(0 0 2px ${color})` }} />
          </g>
        )
      })}
      <circle cx={0} cy={0} r={3.5} fill={color} opacity={0.9} />
    </svg>
  )
}

function TulipHead({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="-14 -20 28 30" style={{ overflow:'visible' }}>
      <path d="M0,8 C-12,-2 -14,-16 -4,-18 C0,-19 0,-8 0,-2 Z"
        fill={color} opacity={0.90} style={{ filter:`drop-shadow(0 0 4px ${color}88)` }} />
      <path d="M0,8 C12,-2 14,-16 4,-18 C0,-19 0,-8 0,-2 Z"
        fill={color} opacity={0.85} style={{ filter:`drop-shadow(0 0 4px ${color}88)` }} />
      <path d="M0,6 C-5,-4 -4,-18 0,-20 C4,-18 5,-4 0,6 Z"
        fill={color} opacity={0.95} style={{ filter:`drop-shadow(0 0 5px ${color})` }} />
    </svg>
  )
}

// ─── SINGLE FLOWER ────────────────────────────────────────────────
function Flower({ flower, progress }: { flower: FlowerDef; progress: number }) {
  // Each flower starts growing after its own delay offset
  const fp = Math.max(0, Math.min(1, (progress - flower.delay * 0.4) / 0.65))
  const headSize = 28 * flower.scale
  const stemH = flower.stemHeight * flower.scale
  const fullyGrown = fp >= 0.95
  const headVisible = Math.max(0, (fp - 0.5) * 2)

  return (
    <div style={{
      position:'absolute', bottom:0, left:`${flower.x}%`,
      transform:'translateX(-50%)',
      width: headSize + 20,
      height: stemH + headSize + 10,
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'flex-end',
      pointerEvents:'none',
    }}>
      {/* HEAD */}
      <div style={{
        opacity: headVisible,
        transform: `scale(${headVisible})`,
        marginBottom: -2,
        transformOrigin:'bottom center',
        animation: fullyGrown
          ? `flowerSway ${flower.swayDur}s ease-in-out ${flower.id * 0.15}s infinite`
          : 'none',
      }}>
        {flower.kind === 'daisy'     && <DaisyHead     color={flower.color} size={headSize} />}
        {flower.kind === 'dandelion' && <DandelionHead color={flower.color} size={headSize} />}
        {flower.kind === 'tulip'     && <TulipHead     color={flower.color} size={headSize} />}
      </div>

      {/* STEM */}
      <div style={{
        width: Math.max(1.2, 1.8 * flower.scale),
        height: stemH * fp,
        background:'linear-gradient(to top, #2a5a2a, #4a9a4a88)',
        borderRadius: 4,
        boxShadow:'0 0 6px rgba(74,154,74,0.3)',
        transformOrigin:'bottom',
        animation: fullyGrown
          ? `flowerSway ${flower.swayDur}s ease-in-out ${flower.id * 0.15}s infinite`
          : 'none',
      }} />

      {/* LEAF */}
      {fp > 0.55 && (
        <div style={{
          position:'absolute',
          bottom: stemH * flower.scale * 0.38,
          left:'50%',
          opacity: Math.max(0, (fp - 0.55) * 2.5),
          transformOrigin:'left center',
        }}>
          <svg width={14 * flower.scale} height={8 * flower.scale} viewBox="0 0 14 8" style={{ overflow:'visible' }}>
            <path d="M0,4 Q-7,0 -6,6 Q-2,3 0,4 Z" fill="#3a8a3a" opacity={0.7} />
            <path d="M0,4 Q7,0 6,6 Q2,3 0,4 Z"  fill="#4a9a4a" opacity={0.65} />
          </svg>
        </div>
      )}
    </div>
  )
}

// ─── GARDEN STRIP ─────────────────────────────────────────────────
function GardenStrip({ progress }: { progress: number }) {
  return (
    <div style={{
      position:'absolute', bottom:0, left:0, right:0,
      height:170, pointerEvents:'none', overflow:'hidden', zIndex:0,
    }}>
      {/* Ground tone */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height:24,
        background:'linear-gradient(to top, rgba(20,50,20,0.3), transparent)',
      }} />
      {FLOWERS.map(f => <Flower key={f.id} flower={f} progress={progress} />)}
    </div>
  )
}

// ─── ABOUT SECTION ────────────────────────────────────────────────
export default function About() {
  const { ref: inViewRef, inView } = useInView({ triggerOnce: false, threshold: 0.15 })
  const sectionRef = useRef<HTMLElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef as React.RefObject<HTMLElement>,
    offset: ['start end', 'end end'],
  })
  const springProgress = useSpring(scrollYProgress, { stiffness: 55, damping: 18 })
  const [gardenProgress, setGardenProgress] = useState(0)

  useEffect(() => {
    return springProgress.on('change', v =>
      setGardenProgress(Math.max(0, Math.min(1, v * 1.5)))
    )
  }, [springProgress])

  const setRefs = (el: HTMLElement | null) => {
    sectionRef.current = el
    inViewRef(el)
  }

  return (
    <section
      id="about"
      ref={setRefs}
      style={{ padding:'100px 40px 190px', position:'relative', zIndex:1, overflow:'hidden' }}
    >
      {/* Garden — sits at the very bottom, z-index 0 */}
      <GardenStrip progress={gardenProgress} />

      {/* Fog so garden blends into page background */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height:72,
        background:'linear-gradient(to top, var(--bg) 25%, transparent 100%)',
        pointerEvents:'none', zIndex:1,
      }} />

      {/* Main content — z-index 2, sits above garden */}
      <div style={{ maxWidth:1100, margin:'0 auto', position:'relative', zIndex:2 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>

          {/* TEXT */}
          <motion.div
            initial={{ opacity:0, x:-40 }}
            animate={inView ? { opacity:1, x:0 } : {}}
            transition={{ duration:0.8, ease:[0.4,0,0.2,1] }}
          >
            <div style={{
              fontFamily:"'Fira Code', monospace", fontSize:'0.72rem',
              letterSpacing:'0.15em', textTransform:'uppercase',
              color:'var(--rose)', marginBottom:12,
            }}>
              // about me
            </div>

            <h2 style={{
              fontFamily:"'Cormorant Garamond', serif", fontWeight:300,
              fontSize:'clamp(2rem, 5vw, 3.5rem)', lineHeight:1.15,
              letterSpacing:'-0.02em', marginBottom:32,
            }}>
              Turning <em style={{ fontStyle:'italic', color:'var(--lavender)' }}>Data</em><br />
              into Decisions
            </h2>

            {[
              `I'm a Computer Science Engineering student with a deep specialization in Data Science. My work lives at the confluence of statistical rigor and engineering elegance — I don't just build models; I build systems that think.`,
              `Passionate about Explainable AI, computer vision, and predictive analytics with a strong foundation in data analysis and statistical thinking. I believe the best machine learning earns trust — interpretable, robust, and grounded in real-world data.`,
              `Actively seeking full-time and internship opportunities where I can contribute to impactful work in Machine Learning and Data Science while continuously learning and growing alongside innovative teams.`,
            ].map((text, i) => (
              <p key={i} style={{ color:'var(--text-muted)', lineHeight:1.9, fontWeight:300, marginBottom:16, fontSize:'0.97rem' }}>
                {text}
              </p>
            ))}

            <a href="mailto:hibasareef@gmail.com" style={{
              display:'inline-block', marginTop:12, padding:'14px 32px',
              borderRadius:50,
              background:'linear-gradient(135deg, var(--rose-deep), rgba(196,168,232,0.8))',
              color:'#fff', fontSize:'0.88rem', fontWeight:500,
              letterSpacing:'0.05em', textDecoration:'none',
              boxShadow:'0 4px 20px rgba(212,96,122,0.3)', transition:'all 0.3s',
            }}>
              hibasareef@gmail.com
            </a>
          </motion.div>

          {/* PORTRAIT */}
          <motion.div
            initial={{ opacity:0, scale:0.9 }}
            animate={inView ? { opacity:1, scale:1 } : {}}
            transition={{ duration:0.8, delay:0.2 }}
            style={{ display:'flex', justifyContent:'center' }}
          >
            <div style={{ position:'relative', width:300, height:300 }}>
              <div style={{
                position:'absolute', inset:-2, borderRadius:'50%',
                background:'conic-gradient(from 0deg, var(--rose), var(--lavender), var(--mint), var(--gold), var(--rose))',
                animation:'spinSlow 8s linear infinite',
              }} />
              <div style={{ position:'absolute', inset:2, borderRadius:'50%', background:'var(--bg)', overflow:'hidden' }}>
                <img src="/photo.jpg" alt="Hiba V S" style={{
                  width:'100%', height:'100%', borderRadius:'50%',
                  objectFit:'cover', objectPosition:'center top', display:'block',
                }} />
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Sway keyframe */}
      <style>{`
        @keyframes flowerSway {
          0%, 100% { transform: rotate(0deg); }
          30%       { transform: rotate(4deg); }
          70%       { transform: rotate(-4deg); }
        }
      `}</style>
    </section>
  )
}
