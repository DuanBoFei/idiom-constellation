import { useRef, useEffect } from 'react'

interface Star {
  x: number; y: number; radius: number; brightness: number; phase: number; speed: number
}

interface Nebula {
  x: number; y: number; radius: number; col: number[]; alpha: number
}

const CHAR_STARS = [
  { char: '虎' }, { char: '龙' }, { char: '凤' }, { char: '鹤' },
  { char: '墨' }, { char: '云' }, { char: '山' }, { char: '水' },
  { char: '风' }, { char: '月' }, { char: '星' }, { char: '天' },
  { char: '地' }, { char: '诗' }, { char: '剑' },
]

export default function StarField({ paused, showCharStars = true }: { paused?: boolean; showCharStars?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const meteorRef = useRef({ x: 0, y: 0, active: false, progress: 0, nextAt: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      if (!canvas) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Stars
    starsRef.current = Array.from({ length: 220 }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: 0.4 + Math.random() * 1.8,
      brightness: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5,
    }))

    let animId: number

    function animate(time: number) {
      if (!ctx || !canvas) return
      const W = window.innerWidth
      const H = window.innerHeight

      ctx.clearRect(0, 0, W, H)

      // Background gradient
      const bg = ctx.createRadialGradient(W * 0.4, H * 0.35, 0, W * 0.5, H * 0.5, W * 0.8)
      bg.addColorStop(0, '#0F1E40')
      bg.addColorStop(0.4, '#0A1628')
      bg.addColorStop(1, '#060E1C')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // Nebulae
      const nebulae: Nebula[] = [
        { x: W * 0.18, y: H * 0.25, radius: W * 0.22, col: [80, 40, 160], alpha: 0.07 },
        { x: W * 0.75, y: H * 0.60, radius: W * 0.28, col: [20, 60, 120], alpha: 0.06 },
        { x: W * 0.50, y: H * 0.80, radius: W * 0.20, col: [120, 20, 60], alpha: 0.05 },
      ]
      for (const n of nebulae) {
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius)
        g.addColorStop(0, `rgba(${n.col},${n.alpha})`)
        g.addColorStop(0.5, `rgba(${n.col},${n.alpha * 0.5})`)
        g.addColorStop(1, `rgba(${n.col},0)`)
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2); ctx.fill()
      }

      // Stars
      const t = time * 0.001
      for (const star of starsRef.current) {
        const twinkle = paused ? 0.8 : 0.5 + 0.5 * Math.sin(t * star.speed + star.phase)
        const alpha = star.brightness * twinkle
        const sx = star.x * W
        const sy = star.y * H

        ctx.beginPath()
        ctx.arc(sx, sy, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(240,230,160,${alpha})`
        ctx.fill()

        if (star.radius > 1.2) {
          const g2 = ctx.createRadialGradient(sx, sy, 0, sx, sy, star.radius * 5)
          g2.addColorStop(0, `rgba(240,230,160,${alpha * 0.2})`)
          g2.addColorStop(1, 'rgba(240,230,160,0)')
          ctx.fillStyle = g2
          ctx.beginPath(); ctx.arc(sx, sy, star.radius * 5, 0, Math.PI * 2); ctx.fill()
        }
      }

      // Character stars
      if (showCharStars) {
        for (let i = 0; i < CHAR_STARS.length; i++) {
          const s = CHAR_STARS[i]
          const seedX = ((i * 137 + 80) % 1800) / 1800
          const seedY = ((i * 97 + 60) % 1000) / 1000
          const cx = 60 + seedX * (W - 120)
          const cy = 60 + seedY * (H - 120)
          const alpha = 0.15 + ((i * 7) % 5) * 0.06

          ctx.beginPath()
          ctx.arc(cx, cy, 20, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(212,160,76,${alpha})`
          ctx.lineWidth = 1
          ctx.stroke()

          ctx.fillStyle = `rgba(212,160,76,${0.2 + ((i * 3) % 4) * 0.07})`
          ctx.font = '14px "LXGW WenKai", "KaiTi", serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(s.char, cx, cy)
        }
      }

      // Meteor
      if (!paused) {
        const now = time
        if (!meteorRef.current.active && now > meteorRef.current.nextAt) {
          meteorRef.current = {
            x: Math.random() * W * 0.3,
            y: Math.random() * H * 0.15,
            active: true,
            progress: 0,
            nextAt: 0,
          }
        }

        if (meteorRef.current.active) {
          const m = meteorRef.current
          m.progress += 0.008
          if (m.progress >= 1) {
            m.active = false
            m.nextAt = now + (3000 + Math.random() * 5000)
          } else {
            const endX = m.x + W * 0.22
            const endY = m.y + H * 0.12
            const cx = m.x + (endX - m.x) * m.progress
            const cy = m.y + (endY - m.y) * m.progress

            const mg = ctx.createLinearGradient(m.x, m.y, endX, endY)
            mg.addColorStop(0, 'rgba(240,230,160,0)')
            mg.addColorStop(0.6, 'rgba(240,230,160,0.5)')
            mg.addColorStop(1, 'rgba(255,255,255,0.85)')
            ctx.beginPath()
            ctx.moveTo(m.x, m.y)
            ctx.lineTo(endX, endY)
            ctx.strokeStyle = mg
            ctx.lineWidth = 2
            ctx.stroke()

            // Meteor head
            ctx.beginPath()
            ctx.arc(cx, cy, 2, 0, Math.PI * 2)
            ctx.fillStyle = 'rgba(255,255,255,0.9)'
            ctx.fill()
          }
        }
      }

      animId = requestAnimationFrame(animate)
    }
    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [paused, showCharStars])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}
