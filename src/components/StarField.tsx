import { useRef, useEffect } from 'react'

interface Star {
  x: number
  y: number
  radius: number
  brightness: number
  phase: number
  speed: number
}

interface Nebula {
  x: number
  y: number
  radius: number
  color: string
  alpha: number
  dx: number
  dy: number
}

interface Meteor {
  x: number
  y: number
  dx: number
  dy: number
  life: number
  maxLife: number
  length: number
}

const STAR_COUNT = 180
const METEOR_INTERVAL_MIN = 3000
const METEOR_INTERVAL_MAX = 8000

export default function StarField({ paused }: { paused: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const nebulaRef = useRef<Nebula[]>([])
  const meteorsRef = useRef<Meteor[]>([])
  const lastMeteorRef = useRef(performance.now())
  const nextMeteorDelayRef = useRef(randomBetween(METEOR_INTERVAL_MIN, METEOR_INTERVAL_MAX))

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
      ctx!.scale(dpr, dpr)
    }

    resize()
    window.addEventListener('resize', resize)

    // Initialize stars
    starsRef.current = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: 0.5 + Math.random() * 2,
      brightness: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5,
    }))

    // Initialize nebula clouds
    nebulaRef.current = [
      { x: window.innerWidth * 0.2, y: window.innerHeight * 0.3, radius: 200, color: '#1a0a40', alpha: 0.15, dx: 0.1, dy: 0.05 },
      { x: window.innerWidth * 0.7, y: window.innerHeight * 0.6, radius: 250, color: '#0a1a30', alpha: 0.12, dx: -0.08, dy: 0.1 },
      { x: window.innerWidth * 0.5, y: window.innerHeight * 0.8, radius: 180, color: '#2a0a20', alpha: 0.1, dx: 0.06, dy: -0.08 },
    ]

    let animId: number

    function animate(time: number) {
      if (!ctx || !canvas) return
      const W = window.innerWidth
      const H = window.innerHeight

      ctx.clearRect(0, 0, W, H)

      // Draw nebula
      for (const n of nebulaRef.current) {
        if (!paused) {
          n.x += n.dx
          n.y += n.dy
          if (n.x > W + n.radius) n.x = -n.radius
          if (n.x < -n.radius) n.x = W + n.radius
          if (n.y > H + n.radius) n.y = -n.radius
          if (n.y < -n.radius) n.y = H + n.radius
        }
        const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius)
        gradient.addColorStop(0, n.color + '66')
        gradient.addColorStop(0.5, n.color + '33')
        gradient.addColorStop(1, n.color + '00')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw stars
      for (const star of starsRef.current) {
        const twinkle = !paused
          ? 0.5 + 0.5 * Math.sin(time * 0.001 * star.speed + star.phase)
          : 0.8
        const alpha = star.brightness * twinkle
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(240, 230, 160, ${alpha})`
        ctx.fill()

        // Glow for brighter stars
        if (star.radius > 1.5) {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(240, 230, 160, ${alpha * 0.15})`
          ctx.fill()
        }
      }

      // Meteor logic
      if (!paused) {
        const now = performance.now()
        if (now - lastMeteorRef.current > nextMeteorDelayRef.current) {
          const angle = Math.PI / 4 + Math.random() * Math.PI / 6
          const speed = 800 + Math.random() * 400
          meteorsRef.current.push({
            x: Math.random() * W,
            y: 0,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            life: 0,
            maxLife: 1.5,
            length: 80 + Math.random() * 60,
          })
          lastMeteorRef.current = now
          nextMeteorDelayRef.current = randomBetween(METEOR_INTERVAL_MIN, METEOR_INTERVAL_MAX)
        }
      }

      // Draw & update meteors
      meteorsRef.current = meteorsRef.current.filter((m) => {
        m.life += 0.016
        const progress = m.life / m.maxLife
        if (progress >= 1) return false

        const headX = m.x + m.dx * progress
        const headY = m.y + m.dy * progress
        const dx = m.dx
        const dy = m.dy
        const len = Math.hypot(dx, dy)
        const tailX = headX - (dx / len) * m.length * (1 - progress * 0.5)
        const tailY = headY - (dy / len) * m.length * (1 - progress * 0.5)

        const gradient = ctx!.createLinearGradient(tailX, tailY, headX, headY)
        gradient.addColorStop(0, 'rgba(240, 230, 160, 0)')
        gradient.addColorStop(0.7, `rgba(240, 230, 160, ${0.6 * (1 - progress)})`)
        gradient.addColorStop(1, `rgba(255, 255, 255, ${0.9 * (1 - progress)})`)

        ctx!.beginPath()
        ctx!.moveTo(tailX, tailY)
        ctx!.lineTo(headX, headY)
        ctx!.strokeStyle = gradient
        ctx!.lineWidth = 2 * (1 - progress * 0.5)
        ctx!.stroke()

        return true
      })

      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [paused])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min)
}
