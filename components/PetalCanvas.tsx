'use client'

import { useEffect, useRef } from 'react'

interface Petal {
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  rotation: number
  rotSpeed: number
  opacity: number
  color: string
  wobble: number
  wobbleSpeed: number
}

const PETAL_COLORS = [
  'rgba(240,160,192,',
  'rgba(220,130,170,',
  'rgba(196,168,232,',
  'rgba(250,180,210,',
  'rgba(152,220,200,',
  'rgba(224,200,120,',
]

export default function PetalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Assign to new locals — TypeScript can guarantee these are never null
    const c = ctx
    const el = canvas

    let W = 0
    let H = 0
    let petals: Petal[] = []
    let animFrameId: number

    function resize() {
      W = el.width = window.innerWidth
      H = el.height = window.innerHeight
    }

    function createPetal(init = false): Petal {
      return {
        x: Math.random() * W,
        y: init ? Math.random() * H : -20,
        size: 4 + Math.random() * 8,
        speedY: 0.3 + Math.random() * 0.8,
        speedX: (Math.random() - 0.5) * 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        opacity: 0.2 + Math.random() * 0.5,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.01 + Math.random() * 0.02,
      }
    }

    function drawPetal(p: Petal) {
      c.save()
      c.translate(p.x, p.y)
      c.rotate(p.rotation)
      c.fillStyle = p.color + p.opacity + ')'
      c.beginPath()
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
        const px = Math.cos(angle) * p.size
        const py = Math.sin(angle) * p.size
        const cx1 = Math.cos(angle - 0.4) * p.size * 0.5
        const cy1 = Math.sin(angle - 0.4) * p.size * 0.5
        const cx2 = Math.cos(angle + 0.4) * p.size * 0.5
        const cy2 = Math.sin(angle + 0.4) * p.size * 0.5
        if (i === 0) c.moveTo(0, 0)
        c.bezierCurveTo(cx1, cy1, px, py, cx2, cy2)
      }
      c.closePath()
      c.fill()
      c.restore()
    }

    function updatePetal(p: Petal): Petal {
      p.y += p.speedY
      p.x += p.speedX + Math.sin(p.wobble) * 0.3
      p.wobble += p.wobbleSpeed
      p.rotation += p.rotSpeed
      if (p.y > H + 20) return createPetal(false)
      return p
    }

    function animate() {
      c.clearRect(0, 0, W, H)
      petals = petals.map(updatePetal)
      petals.forEach(drawPetal)
      animFrameId = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    petals = Array.from({ length: 60 }, () => createPetal(true))
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.55,
      }}
    />
  )
}
