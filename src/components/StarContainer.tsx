import { useRef, useState, useEffect, useCallback } from 'react'
import type { StarPosition, Question } from '../types'
import { generateStarLayout } from '../utils/starLayout'
import { shuffle } from '../utils/shuffle'
import StarButton from './StarButton'
import ConnectionCanvas from './ConnectionCanvas'
import { audioEngine } from '../audio/AudioEngine'

interface StarContainerProps {
  question: Question
  selectedChars: string[]
  onSelectStar: (char: string) => void
  isSuccess: boolean
  isError: boolean
  completedStars?: string[]
}

export default function StarContainer({
  question,
  selectedChars,
  onSelectStar,
  isSuccess,
  isError,
  completedStars,
}: StarContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [wrongFlash, setWrongFlash] = useState(false)
  const [stars, setStars] = useState<StarPosition[]>([])

  // Track container size
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSize({ width: entry.contentRect.width, height: entry.contentRect.height })
      }
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Flash red on error
  useEffect(() => {
    if (isError) {
      setWrongFlash(true)
      const t = setTimeout(() => setWrongFlash(false), 600)
      return () => clearTimeout(t)
    }
  }, [isError])

  // Generate star layout when question or size changes
  useEffect(() => {
    if (size.width === 0 || size.height === 0) return

    let answerChars: string[]
    let distractorChars: string[]

    if ('rounds' in question) {
      // Double idiom: place all 8 answer chars + distractors
      answerChars = [...question.rounds[0].idiom.split(''), ...question.rounds[1].idiom.split('')]
      distractorChars = [...question.rounds[0].distractors, ...question.rounds[1].distractors]
    } else {
      answerChars = question.idiom.split('')
      distractorChars = question.distractors
    }

    // Remove duplicate distractors
    const uniqueDistractors = [...new Set(distractorChars)]
    // Filter out any distractor that appears in the answer
    const filteredDistractors = uniqueDistractors.filter((d) => !answerChars.includes(d))

    const generated = generateStarLayout(
      answerChars,
      filteredDistractors,
      size.width,
      size.height,
    )

    setStars(shuffle(generated))
  }, [question, size.width, size.height])

  const handleTap = useCallback(
    (char: string) => {
      if (isSuccess || isError) return
      const pitchIdx = selectedChars.length
      const pitches = [262, 330, 392, 524]
      audioEngine.playClick(pitches[Math.min(pitchIdx, 3)])
      onSelectStar(char)
    },
    [isSuccess, isError, selectedChars.length, onSelectStar],
  )

  if (size.width === 0) {
    return <div ref={containerRef} style={{ position: 'absolute', top: 80, left: 0, right: 0, bottom: 0 }} />
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
      }}
    >
      <ConnectionCanvas
        stars={stars}
        selectedCharacters={selectedChars}
        isSuccess={isSuccess}
        isError={wrongFlash}
        containerWidth={size.width}
        containerHeight={size.height}
        completedIds={completedStars}
      />

      {stars.map((star) => {
        const isSelected = selectedChars.includes(star.character)
        const selectionOrder = selectedChars.indexOf(star.character) + 1
        const isCompleted = completedStars?.includes(star.character) ?? false

        return (
          <StarButton
            key={star.id}
            star={star}
            isSelected={isSelected}
            isWrong={wrongFlash && isSelected}
            isCompleted={isCompleted}
            selectionOrder={selectionOrder}
            disabled={isSuccess || isError || isCompleted}
            onSelect={handleTap}
            containerWidth={size.width}
            containerHeight={size.height}
          />
        )
      })}
    </div>
  )
}
