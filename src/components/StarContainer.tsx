import { useRef, useState, useEffect, useMemo } from 'react'
import type { Question, GamePhase, SharedCharQuestion } from '../types'
import { generateStarLayout } from '../utils/starLayout'
import { shuffle } from '../utils/shuffle'
import { createSeededRandom, hashString } from '../utils/seededRandom'
import StarNode from './StarNode'
import ConnectionCanvas from './ConnectionCanvas'

interface StarContainerProps {
  question: Question
  selectedChars: string[]
  selectedStarIds: string[]
  onSelectStar: (char: string, starId: string) => void
  phase: GamePhase
  lastResult: 'correct' | 'wrong' | 'timeout' | null
  currentRound?: number
  completedRoundChars?: string[]
  sharedChars?: string[]
  isSharedCharMode?: boolean
  starGlowMode?: boolean
}

interface StarData {
  id: string
  character: string
  px: number
  py: number
}

export default function StarContainer({
  question,
  selectedChars,
  selectedStarIds,
  onSelectStar,
  phase,
  lastResult: _lastResult,
  currentRound = 0,
  completedRoundChars = [],
  sharedChars = [],
  isSharedCharMode = false,
  starGlowMode = false,
}: StarContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [stars, setStars] = useState<StarData[]>([])
  const layoutKeyRef = useRef('')

  // Track container size (only stable changes, not every resize noise)
  const sizeRef = useRef(size)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        // Only update if dimensions actually changed meaningfully
        if (Math.abs(width - sizeRef.current.width) > 1 || Math.abs(height - sizeRef.current.height) > 1) {
          sizeRef.current = { width, height }
          setSize({ width, height })
        }
      }
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Generate star layout — only when question identity truly changes
  useEffect(() => {
    if (size.width === 0 || size.height === 0) return

    const questionId = 'id' in question ? (question as any).id : ''
    const identityKey = `${questionId}-${currentRound}-${isSharedCharMode}-${completedRoundChars.join(',')}`
    if (identityKey === layoutKeyRef.current && stars.length > 0) return
    layoutKeyRef.current = identityKey

    let answerChars: string[]
    let distractorChars: string[]

    if ('rounds' in question) {
      answerChars = [...question.rounds[0].idiom.split(''), ...question.rounds[1].idiom.split('')]
      distractorChars = [...question.rounds[0].distractors, ...question.rounds[1].distractors]
    } else if ('type' in question && question.type === 'shared-char') {
      answerChars = [...(question as SharedCharQuestion).allChars]
      distractorChars = [...(question as SharedCharQuestion).distractors]
    } else if ('idiom' in question) {
      answerChars = question.idiom.split('')
      distractorChars = question.distractors
    } else {
      answerChars = []
      distractorChars = []
    }

    const uniqueDistractors = [...new Set(distractorChars)]

    // Shared-char round 2 filtering: only show shared chars + chars not yet used in round 1
    if (isSharedCharMode && currentRound === 1 && completedRoundChars.length > 0) {
      answerChars = answerChars.filter(c =>
        sharedChars.includes(c) || !completedRoundChars.includes(c)
      )
    }

    const filteredDistractors = uniqueDistractors.filter((d) => !answerChars.includes(d))

    // Seeded random for deterministic star positions per question
    const seed = hashString(`${questionId}-${currentRound}-${isSharedCharMode}`)
    const rand = createSeededRandom(seed)

    const generated = generateStarLayout(
      answerChars,
      filteredDistractors,
      size.width,
      size.height,
      undefined,
      rand,
    )

    const containerPadding = 40
    const usableW = size.width - containerPadding * 2
    const usableH = size.height - containerPadding * 2

    setStars(shuffle(generated, rand).map((s) => ({
      id: s.id,
      character: s.character,
      px: containerPadding + (s.x / 100) * usableW,
      py: containerPadding + (s.y / 100) * usableH,
    })))
  }, [question, size.width, size.height, currentRound, completedRoundChars, sharedChars, isSharedCharMode])

  // Build connection data
  const connections = useMemo(() => {
    const result: Array<{ from: { x: number; y: number }; to: { x: number; y: number }; state: 'completed' | 'active' | 'future' }> = []
    if (selectedChars.length < 2) return result

    for (let i = 0; i < selectedChars.length - 1; i++) {
      const fromStar = stars.find((s) => s.character === selectedChars[i])
      const toStar = stars.find((s) => s.character === selectedChars[i + 1])
      if (fromStar && toStar) {
        result.push({
          from: { x: fromStar.px, y: fromStar.py },
          to: { x: toStar.px, y: toStar.py },
          state: 'completed',
        })
      }
    }
    return result
  }, [selectedChars, stars, currentRound])

  const isLocked = phase !== 'PLAYING' && phase !== 'ROUND2_PLAYING'

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute', top: 110, left: 20, right: 20,
        bottom: 110, zIndex: 1,
      }}
    >
      <ConnectionCanvas
        connections={connections}
        containerWidth={size.width}
        containerHeight={size.height}
        glowMode={starGlowMode}
      />

      {stars.map((star) => {
        const selIdx = selectedStarIds.indexOf(star.id)

        return (
          <StarNode
            key={star.id}
            character={star.character}
            state={selIdx >= 0 ? 'completed' : 'idle'}
            order={selIdx >= 0 ? selIdx + 1 : undefined}
            x={star.px}
            y={star.py}
            disabled={isLocked || selIdx >= 0}
            onSelect={(char) => {
              if (isLocked) return
              onSelectStar(char, star.id)
            }}
            glowMode={starGlowMode}
          />
        )
      })}
    </div>
  )
}
