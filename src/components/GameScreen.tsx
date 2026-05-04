import { useEffect, useCallback, useRef, useState } from 'react'
import { useGame } from '../hooks/useGameReducer'
import type { IdiomQuestion } from '../types'
import StarField from './StarField'
import HUD from './HUD'
import StarContainer from './StarContainer'
import ResultCard from './ResultCard'
import { audioEngine } from '../audio/AudioEngine'

export default function GameScreen() {
  const { state, dispatch } = useGame()
  const currentQ = state.questions[state.currentQuestionIndex]
  const isSuccess = state.lastResult === 'correct'
  const isError = state.lastResult === 'wrong'
  const timeout = state.lastResult === 'timeout'
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [showResultCard, setShowResultCard] = useState(false)
  const checkingHandled = useRef(false)

  // Timer tick every 1 second
  useEffect(() => {
    if (state.phase === 'PLAYING') {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'TICK' })
      }, 1000)
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [state.phase, dispatch])

  // Handle CHECKING phase: validate stars
  useEffect(() => {
    if (state.phase !== 'CHECKING' || checkingHandled.current) return
    checkingHandled.current = true

    const selected = state.selectedStars

    // If fewer than 4 stars and time run out = timeout
    if (selected.length < 4) {
      dispatch({ type: 'TIMEOUT' })
      return
    }

    if (!currentQ) return

    let isCorrect = false
    if ('rounds' in currentQ) {
      // Double idiom — validate first round
      isCorrect = selected.join('') === currentQ.rounds[0].idiom
    } else {
      isCorrect = selected.join('') === currentQ.idiom
    }

    if (isCorrect) {
      const melody = 'rounds' in currentQ ? [262, 330, 392, 524] : (currentQ as IdiomQuestion).melody
      audioEngine.playMelody(melody)
      setTimeout(() => {
        dispatch({ type: 'VALIDATE_SUCCESS' })
        setShowResultCard(true)
      }, 500)
    } else {
      audioEngine.playError()
      dispatch({ type: 'VALIDATE_FAIL' })
      setTimeout(() => {
        dispatch({ type: 'NEXT_QUESTION' })
      }, 1200)
    }
  }, [state.phase, state.selectedStars, currentQ, dispatch])

  // Reset checking guard when phase changes
  useEffect(() => {
    if (state.phase === 'PLAYING') {
      checkingHandled.current = false
    }
  }, [state.phase])

  const handleSelectStar = useCallback(
    (char: string) => {
      if (state.phase !== 'PLAYING') return
      dispatch({ type: 'SELECT_STAR', character: char })
    },
    [state.phase, dispatch],
  )

  const handleContinue = useCallback(() => {
    setShowResultCard(false)
    dispatch({ type: 'NEXT_QUESTION' })
  }, [dispatch])

  if (!currentQ) return null

  // Determine total time for this question
  const totalTime = currentQ.difficulty === 3 ? 25 : 20

  // Get clue text
  const clue = 'rounds' in currentQ ? currentQ.rounds[0].hint : (currentQ as IdiomQuestion).hint

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <StarField paused={state.phase !== 'PLAYING'} />

      <HUD
        clue={clue}
        timeRemaining={state.timeRemaining}
        totalTime={totalTime}
        questionNumber={state.currentQuestionIndex + 1}
        totalQuestions={state.questions.length}
      />

      <StarContainer
        question={currentQ}
        selectedChars={state.selectedStars}
        onSelectStar={handleSelectStar}
        isSuccess={isSuccess}
        isError={isError}
      />

      {showResultCard && isSuccess && (
        <ResultCard question={currentQ} onContinue={handleContinue} />
      )}

      {timeout && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{
            padding: 24, textAlign: 'center',
            background: 'linear-gradient(135deg, #1a1e3e, #0a0e2a)',
            borderRadius: 16, border: '1px solid rgba(231, 76, 60, 0.3)',
            maxWidth: 280,
          }}>
            <p style={{ fontSize: 14, color: '#e74c3c', marginBottom: 8 }}>时间到！</p>
            <p style={{
              fontSize: 28, fontFamily: 'var(--font-title)',
              color: 'var(--color-text-secondary)', letterSpacing: 6,
            }}>
              {'rounds' in currentQ ? currentQ.rounds[0].idiom : (currentQ as IdiomQuestion).idiom}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
