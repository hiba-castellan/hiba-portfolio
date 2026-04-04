'use client'

import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY
      const max = document.body.scrollHeight - window.innerHeight
      setProgress((scrolled / max) * 100)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0,
        height: 2,
        background: 'linear-gradient(90deg, var(--rose), var(--lavender), var(--gold))',
        zIndex: 9999,
        width: `${progress}%`,
        boxShadow: '0 0 10px var(--rose)',
        transition: 'width 0.1s',
      }}
    />
  )
}
