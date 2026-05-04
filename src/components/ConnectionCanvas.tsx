import { useRef, useEffect } from 'react'
import type { StarPosition } from '../types'

interface ConnectionCanvasProps {
  stars: StarPosition[]
  selectedCharacters: string[]
  isSuccess: boolean
  isError: boolean
  containerWidth: number
  containerHeight: number
  completedIds?: string[]
}

export default function ConnectionCanvas({
  stars,
  selectedCharacters,
  isSuccess,
  isError,
  containerWidth,
  containerHeight,
  completedIds,
}: ConnectionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = containerWidth * dpr
    canvas.height = containerHeight * dpr
    canvas.style.width = containerWidth + 'px'
    canvas.style.height = containerHeight + 'px'
    ctx.scale(dpr, dpr)

    const starMap = new Map(stars.map((s) => [s.character, s]))

    function getStarPos(char: string): { x: number; y: number } | null {
      const star = starMap.get(char)
      if (!star) return null
      return {
        x: (star.x / 100) * containerWidth,
        y: (star.y / 100) * containerHeight,
      }
    }

    let startTime = performance.now()
    const duration = 600
    let errorShake = 0

    function draw(time: number) {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, containerWidth, containerHeight)

      const elapsed = time - startTime
      const progress = Math.min(elapsed / duration, 1)

      if (isError && progress < 1) {
        errorShake = Math.sin(progress * Math.PI * 6) * (1 - progress) * 8
      } else {
        errorShake = 0
      }

      // Draw completed lines (golden, for double-idiom first round)
      if (completedIds && completedIds.length >= 2) {
        ctx.beginPath()
        for (let i = 0; i < completedIds.length; i++) {
          const pos = getStarPos(completedIds[i])
          if (!pos) continue

          if (i === 0) {
            ctx.moveTo(pos.x, pos.y)
          } else {
            const prev = getStarPos(completedIds[i - 1])
            if (!prev) continue
            const cp1x = (prev.x + pos.x) / 2
            const cp1y = Math.min(prev.y, pos.y) - 20
            ctx.bezierCurveTo(cp1x, cp1y, cp1x, cp1y, pos.x, pos.y)
          }
        }
        ctx.strokeStyle = 'rgba(245, 215, 66, 0.6)'
        ctx.lineWidth = 3
        ctx.stroke()
      }

      // Draw current selection lines
      if (selectedCharacters.length >= 2) {
        ctx.beginPath()
        for (let i = 0; i < selectedCharacters.length; i++) {
          const pos = getStarPos(selectedCharacters[i])
          if (!pos) continue
          const px = pos.x + (isError ? errorShake : 0)
          const py = pos.y

          if (i === 0) {
            ctx.moveTo(px, py)
          } else {
            const prev = getStarPos(selectedCharacters[i - 1])
            if (!prev) continue
            const prevPx = prev.x + (isError ? errorShake : 0)
            const prevPy = prev.y
            const cp1x = (prevPx + px) / 2
            const cp1y = Math.min(prevPy, py) - 20
            ctx.bezierCurveTo(cp1x, cp1y, cp1x, cp1y, px, py)
          }
        }

        if (isSuccess) {
          ctx.strokeStyle = `rgba(245, 215, 66, ${progress})`
          ctx.lineWidth = 3 + (1 - progress) * 3
          ctx.shadowColor = 'rgba(245, 215, 66, 0.5)'
          ctx.shadowBlur = 10 * progress
        } else if (isError) {
          ctx.strokeStyle = '#e74c3c'
          ctx.lineWidth = 2.5
        } else {
          ctx.strokeStyle = 'rgba(240, 230, 160, 0.7)'
          ctx.lineWidth = 2
        }

        ctx.stroke()
        ctx.shadowBlur = 0
      }

      if (isError && progress < 1) {
        requestAnimationFrame(draw)
      }
    }

    const animId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animId)
  }, [stars, selectedCharacters, isSuccess, isError, containerWidth, containerHeight, completedIds])

  if (containerWidth === 0 || containerHeight === 0) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: containerWidth,
        height: containerHeight,
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
  )
}
