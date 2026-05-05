import { useRef, useEffect, useCallback } from 'react'

interface ConnectionCanvasProps {
  connections: Array<{ from: { x: number; y: number }; to: { x: number; y: number }; state: 'completed' | 'active' | 'future' }>
  containerWidth: number
  containerHeight: number
  glowMode: boolean
}

const GOLD = '212,160,76'
const GOLD_LIGHT = '232,201,122'

export default function ConnectionCanvas({
  connections,
  containerWidth,
  containerHeight,
  glowMode,
}: ConnectionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (containerWidth === 0 || containerHeight === 0) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = containerWidth * dpr
    canvas.height = containerHeight * dpr
    canvas.style.width = containerWidth + 'px'
    canvas.style.height = containerHeight + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, containerWidth, containerHeight)

    for (const conn of connections) {
      const { from, to, state } = conn

      if (state === 'future') continue

      if (state === 'completed') {
        // Outer glow (wide, faint)
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.strokeStyle = `rgba(${GOLD},0.18)`
        ctx.lineWidth = 8
        ctx.lineCap = 'round'
        ctx.stroke()

        // Main line with glow
        ctx.shadowColor = glowMode ? `rgba(${GOLD_LIGHT},0.9)` : `rgba(${GOLD},0.5)`
        ctx.shadowBlur = glowMode ? 12 : 6
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.strokeStyle = `rgba(${GOLD},0.85)`
        ctx.lineWidth = 2.5
        ctx.lineCap = 'round'
        ctx.stroke()
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
      } else if (state === 'active') {
        // Outer glow
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.strokeStyle = `rgba(${GOLD_LIGHT},0.08)`
        ctx.lineWidth = 10
        ctx.lineCap = 'round'
        ctx.stroke()

        // Dashed main line
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.strokeStyle = `rgba(${GOLD_LIGHT},0.6)`
        ctx.lineWidth = 2
        ctx.setLineDash([8, 4])
        ctx.lineCap = 'round'
        ctx.stroke()
        ctx.setLineDash([])
      }
    }
  }, [connections, containerWidth, containerHeight, glowMode])

  useEffect(() => {
    draw()
  }, [draw])

  // Animate glow lines when glowMode is active
  useEffect(() => {
    if (!glowMode) return
    let running = true
    const animate = () => {
      if (!running) return
      draw()
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => {
      running = false
      cancelAnimationFrame(animRef.current)
    }
  }, [glowMode, draw])

  if (containerWidth === 0 || containerHeight === 0) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', top: 0, left: 0,
        width: containerWidth, height: containerHeight,
        zIndex: 2, pointerEvents: 'none',
      }}
    />
  )
}
