'use client'

import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: -100, y: -100 })
  const targetRef = useRef({ x: -100, y: -100 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY }
    }
    const onLeave = () => {
      targetRef.current = { x: -500, y: -500 }
    }

    let raf: number
    const animate = () => {
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.08
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.08
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${posRef.current.x - 150}px, ${posRef.current.y - 150}px, 0)`
      }
      raf = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999] w-[300px] h-[300px] rounded-full opacity-40"
      style={{
        background: 'radial-gradient(circle, rgba(0,113,227,0.06) 0%, rgba(139,92,246,0.03) 40%, transparent 70%)',
        filter: 'blur(40px)',
      }}
    />
  )
}
