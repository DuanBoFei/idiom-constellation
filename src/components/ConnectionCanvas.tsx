import { useRef, useEffect } from 'react'

interface ConnectionCanvasProps {
  connections: Array<{ from: { x: number; y: number }; to: { x: number; y: number }; state: 'completed' | 'active' | 'future' }>
  containerWidth: number
  containerHeight: number
  glowMode: boolean
}

export default function ConnectionCanvas({
  connections,
  containerWidth,
  containerHeight,
  glowMode,
}: ConnectionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
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
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, containerWidth, containerHeight)

    for (const conn of connections) {
      const { from, to, state } = conn
      const glowWidth = state === 'completed' ? 8 : state === 'active' ? 10 : 0
      const lineWidth = state === 'completed' ? 2.5 : state === 'active' ? 2 : 0

      if (lineWidth === 0) continue

      // If glowMode, render flowing particles for completed connections
      if (glowMode && state === 'completed') {
        // Animated flowing glow line
        ctx.save()
        const dashOffset = (Date.now() / 50) % 24
        ctx.setLineDash([12, 8])
        ctx.lineDashOffset = -dashOffset
        ctx.strokeStyle = 'rgba(232,201,122,0.85)'
        ctx.lineWidth = 3
        ctx.shadowColor = '#E8C97A'
        ctx.shadowBlur = 15
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.stroke()
        ctx.restore()
      } else {
        // Outer glow
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.strokeStyle = state === 'completed'
          ? 'rgba(212,160,76,0.18)'
          : 'rgba(232,201,122,0.08)'
        ctx.lineWidth = glowWidth
        ctx.lineCap = 'round'
        ctx.stroke()

        // Main line
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.strokeStyle = state === 'completed'
          ? 'rgba(212,160,76,0.85)'
          : 'rgba(232,201,122,0.6)'
        ctx.lineWidth = lineWidth
        ctx.setLineDash(state === 'active' ? [8, 4] : [])
        ctx.stroke()
        ctx.setLineDash([])
      }
    }
  }, [connections, containerWidth, containerHeight, glowMode])

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
