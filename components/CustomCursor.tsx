'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)
  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const ringX = useRef(0)
  const ringY = useRef(0)
  const rafId = useRef<number>()

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.current = e.clientX
      mouseY.current = e.clientY
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX - 4 + 'px'
        dotRef.current.style.top = e.clientY - 4 + 'px'
      }
    }

    const animate = () => {
      ringX.current += (mouseX.current - ringX.current - 18) * 0.12
      ringY.current += (mouseY.current - ringY.current - 18) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = ringX.current + 'px'
        ringRef.current.style.top = ringY.current + 'px'
      }
      rafId.current = requestAnimationFrame(animate)
    }

    const onEnter = () => setExpanded(true)
    const onLeave = () => setExpanded(false)

    document.addEventListener('mousemove', onMove)
    document.querySelectorAll('a, button, .skill-chip, .project-card').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    rafId.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMove)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--rose)',
          position: 'fixed', pointerEvents: 'none',
          zIndex: 99999, mixBlendMode: 'difference',
          transition: 'transform 0.15s',
        }}
      />
      <div
        ref={ringRef}
        style={{
          width: expanded ? 60 : 36,
          height: expanded ? 60 : 36,
          borderRadius: '50%',
          border: `${expanded ? 2 : 1}px solid ${expanded ? 'var(--rose)' : 'rgba(240,160,192,0.5)'}`,
          position: 'fixed', pointerEvents: 'none',
          zIndex: 99998,
          transition: 'width 0.3s, height 0.3s, border-color 0.3s',
        }}
      />
    </>
  )
}
