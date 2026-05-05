import { useEffect, useCallback, useRef, useState, useMemo } from 'react'
import { useGame } from '../hooks/useGameReducer'
import { LEVELS, ERROR_PENALTY_THRESHOLD } from '../constants/levels'
import type { IdiomQuestion, ReverseQuestion, SharedCharQuestion } from '../types'
import ReverseMeaningPhase from './ReverseMeaningPhase'
import StarField from './StarField'
import HUD from './HUD'
import StarContainer from './StarContainer'
import ClueCard from './ClueCard'
import SelectionDisplay from './SelectionDisplay'
import IdiomCard from './IdiomCard'
import { audioEngine } from '../audio/AudioEngine'

interface GameScreenProps {
  levelId: number
  isEndless?: boolean
}

export default function GameScreen({ levelId, isEndless = false }: GameScreenProps) {
  const { state, dispatch } = useGame()
  const currentQ = state.questions[state.currentQuestionIndex]
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [showIdiomCard, setShowIdiomCard] = useState(false)
  const checkingHandled = useRef(false)
  const [showTimeout, setShowTimeout] = useState(false)
  const [penaltyFlash, setPenaltyFlash] = useState(false)

  const isSuccess = state.lastResult === 'correct'
  const timeout = state.lastResult === 'timeout'
  const levelConfig = LEVELS.find(l => l.id === levelId)
  const totalTime = levelConfig?.timePerQuestion ?? 20
  const levelName = levelConfig?.name ?? ''
  const isReverse = currentQ && 'type' in currentQ && currentQ.type === 'reverse'
  const isSharedChar = currentQ && 'type' in currentQ && currentQ.type === 'shared-char'

  // Timer tick
  useEffect(() => {
    if (state.phase === 'PLAYING' || state.phase === 'ROUND2_PLAYING') {
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

  // Handle CHECKING / ROUND2_CHECKING phase
  useEffect(() => {
    if ((state.phase !== 'CHECKING' && state.phase !== 'ROUND2_CHECKING') || checkingHandled.current) return
    checkingHandled.current = true

    const selected = state.selectedStars

    if (selected.length < 4) {
      dispatch({ type: 'TIMEOUT' })
      return
    }

    if (!currentQ) return

    let isCorrect = false
    if (isSharedChar && state.currentRound === 0) {
      // Round 1 of shared-char: check against first idiom
      isCorrect = selected.join('') === (currentQ as SharedCharQuestion).idioms[0]
    } else if (isSharedChar && state.currentRound === 1) {
      // Round 2: check against second idiom
      isCorrect = selected.join('') === (currentQ as SharedCharQuestion).idioms[1]
    } else if ('rounds' in currentQ) {
      isCorrect = selected.join('') === currentQ.rounds[0].idiom
    } else if ('idiom' in currentQ) {
      isCorrect = selected.join('') === (currentQ as import('../types').IdiomQuestion).idiom
    }

    if (isCorrect) {
      dispatch({ type: 'RECORD_CORRECT' })
      const melody = 'rounds' in currentQ ? [262, 330, 392, 524]
        : 'melody' in currentQ ? (currentQ as IdiomQuestion).melody
        : [262, 330, 392, 524]
      audioEngine.playMelody(melody)
      setTimeout(() => {
        if (isReverse) {
          // Reverse mode: go to meaning selection instead of result
          dispatch({ type: 'SHOW_MEANING_SELECT' })
        } else if (isSharedChar && state.currentRound === 0) {
          // Complete round 1, advance to round 2
          dispatch({ type: 'COMPLETE_SHARED_ROUND' })
        } else {
          dispatch({ type: 'VALIDATE_SUCCESS' })
          if (!isEndless) {
            setShowIdiomCard(true)
          }
        }
      }, 500)
    } else {
      dispatch({ type: 'RECORD_WRONG' })
      // Check if penalty was triggered
      if (state.consecutiveErrors >= ERROR_PENALTY_THRESHOLD - 1) {
        setPenaltyFlash(true)
        setTimeout(() => setPenaltyFlash(false), 1500)
      }
      audioEngine.playError()
      dispatch({ type: 'VALIDATE_FAIL' })
      setTimeout(() => {
        dispatch({ type: 'NEXT_QUESTION' })
      }, 1200)
    }
  }, [state.phase, state.selectedStars, currentQ, dispatch, isEndless, state.consecutiveErrors, isSharedChar, state.currentRound])

  // Handle timeout display
  useEffect(() => {
    if (timeout) {
      setShowTimeout(true)
      const t = setTimeout(() => {
        setShowTimeout(false)
        dispatch({ type: 'NEXT_QUESTION' })
      }, 2000)
      return () => clearTimeout(t)
    }
  }, [timeout, dispatch])

  // Reset handling guard
  useEffect(() => {
    if (state.phase === 'PLAYING' || state.phase === 'ROUND2_PLAYING') {
      checkingHandled.current = false
    }
  }, [state.phase])

  // Handle endless mode auto-advance (skip IdiomCard)
  useEffect(() => {
    if (isEndless && isSuccess && !showIdiomCard) {
      const t = setTimeout(() => {
        setShowIdiomCard(false)
        const nextIdx = state.currentQuestionIndex + 1
        if (nextIdx >= state.questions.length) {
          dispatch({ type: 'LEVEL_COMPLETE' })
        } else {
          dispatch({ type: 'NEXT_QUESTION' })
        }
      }, 800)
      return () => clearTimeout(t)
    }
  }, [isEndless, isSuccess, showIdiomCard, state.currentQuestionIndex, state.questions.length, dispatch])

  // Stable reference for completedRoundChars
  const completedRoundChars = useMemo(
    () => state.completedRounds.flat(),
    [state.completedRounds],
  )

  const handleSelectStar = useCallback(
    (char: string, starId: string) => {
      if (state.phase !== 'PLAYING' && state.phase !== 'ROUND2_PLAYING') return
      dispatch({ type: 'SELECT_STAR', character: char, starId })
    },
    [state.phase, dispatch],
  )

  const handleContinue = useCallback(() => {
    setShowIdiomCard(false)
    const nextIdx = state.currentQuestionIndex + 1
    if (nextIdx >= state.questions.length) {
      dispatch({ type: 'LEVEL_COMPLETE' })
    } else {
      dispatch({ type: 'NEXT_QUESTION' })
    }
  }, [dispatch, state.currentQuestionIndex, state.questions.length])

  if (!currentQ) return null

  const clue = 'rounds' in currentQ
    ? currentQ.rounds[0].hint
    : isSharedChar
      ? (currentQ as SharedCharQuestion).hints[state.currentRound]
      : (currentQ as IdiomQuestion).hint

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <StarField paused={state.phase !== 'PLAYING' && state.phase !== 'ROUND2_PLAYING'} showCharStars={false} />

      <HUD
        levelName={levelName}
        levelIndex={levelId - 1}
        timeRemaining={state.timeRemaining}
        totalTime={totalTime}
        score={state.score}
        streak={state.streak}
        starGlowMode={state.starGlowMode}
      />

      {state.phase === 'MEANING_SELECT' && isReverse && (
        <ReverseMeaningPhase
          fragments={(currentQ as ReverseQuestion).meaningFragments}
          correctMeaning={(currentQ as ReverseQuestion).meaning}
          onCorrect={() => {
            dispatch({ type: 'VALIDATE_MEANING', correct: true })
            if (!isEndless) setShowIdiomCard(true)
          }}
          onWrong={(wrong) => {
            const el = document.querySelector(`[data-fragment="${CSS.escape(wrong)}"]`) as HTMLElement
            if (el) {
              el.style.opacity = '0.3'
              el.style.pointerEvents = 'none'
            }
          }}
        />
      )}

      {!isReverse && <ClueCard clue={clue} />}

      {!(state.phase === 'MEANING_SELECT' && isReverse) && (
        <StarContainer
          question={currentQ}
          selectedChars={state.selectedStars}
          selectedStarIds={state.selectedStarIds}
          onSelectStar={handleSelectStar}
          phase={state.phase}
          lastResult={state.lastResult}
          currentRound={state.currentRound}
          completedRoundChars={completedRoundChars}
          sharedChars={isSharedChar ? (currentQ as SharedCharQuestion).sharedChars : undefined}
          isSharedCharMode={isSharedChar}
          starGlowMode={state.starGlowMode}
        />
      )}

      {!(state.phase === 'MEANING_SELECT' && isReverse) && (
        <SelectionDisplay
          selectedChars={state.selectedStars}
          totalSlots={4}
        />
      )}

      {/* Hint button */}
      <div style={{
        position: 'absolute', right: 40, bottom: 48, zIndex: 20,
        padding: '10px 24px',
        border: '1px solid rgba(212,160,76,0.3)',
        borderRadius: 2,
        fontSize: 14, color: '#8A8070', letterSpacing: 3,
        cursor: 'pointer',
        fontFamily: "'LXGW WenKai','KaiTi',serif",
        background: 'rgba(10,22,40,0.5)',
        backdropFilter: 'blur(4px)',
      }}>
        提 示
      </div>

      {/* Idiom Card overlay */}
      {showIdiomCard && isSuccess && !isEndless && (
        <IdiomCard question={currentQ} onContinue={handleContinue} />
      )}

      {/* Penalty flash */}
      {penaltyFlash && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', zIndex: 50,
          transform: 'translate(-50%,-50%)',
          padding: '16px 32px',
          background: 'rgba(200,66,58,0.9)',
          borderRadius: 2,
          fontSize: 20, color: '#fff', letterSpacing: 4,
          fontFamily: "'Noto Serif SC',serif",
          animation: 'fadeIn 0.3s ease',
          pointerEvents: 'none',
        }}>
          时间惩罚 -5s
        </div>
      )}

      {/* Timeout overlay */}
      {showTimeout && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{
            padding: 32, textAlign: 'center',
            background: 'rgba(10,22,40,0.85)',
            border: '1px solid rgba(200,66,58,0.3)',
            borderRadius: 2,
            backdropFilter: 'blur(8px)',
          }}>
            <p style={{ fontSize: 14, color: '#C8423A', marginBottom: 12, letterSpacing: 2, fontFamily: "'Noto Serif SC',serif" }}>
              时间到！
            </p>
            <p style={{
              fontSize: 32, fontFamily: "'LXGW WenKai','KaiTi',serif",
              color: '#E8E4D9', letterSpacing: 8,
            }}>
              {'rounds' in currentQ
                ? currentQ.rounds[0].idiom
                : isSharedChar
                  ? (currentQ as SharedCharQuestion).idioms[state.currentRound] ?? (currentQ as SharedCharQuestion).idioms[0]
                  : (currentQ as IdiomQuestion).idiom}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
