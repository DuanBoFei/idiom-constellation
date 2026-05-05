import { useEffect, useCallback, useRef, useState, useMemo } from 'react'
import { useGame } from '../hooks/useGameReducer'
import { LEVELS, ERROR_PENALTY_THRESHOLD } from '../constants/levels'
import type { IdiomQuestion, ReverseQuestion, SharedCharQuestion, MultiIdiomQuestion } from '../types'
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
  const [showWrongMeaning, setShowWrongMeaning] = useState(false)
  const advanceFromWrongRef = useRef(false)
  const [showMultiFound, setShowMultiFound] = useState('')
  const [showMultiError, setShowMultiError] = useState(false)

  const isSuccess = state.lastResult === 'correct'
  const timeout = state.lastResult === 'timeout'
  const levelConfig = LEVELS.find(l => l.id === levelId)
  const totalTime = levelConfig?.timePerQuestion ?? 20
  const levelName = levelConfig?.name ?? ''
  const isReverse = currentQ && 'type' in currentQ && currentQ.type === 'reverse'
  const isSharedChar = currentQ && 'type' in currentQ && currentQ.type === 'shared-char'
  const isMulti = currentQ && 'type' in currentQ && currentQ.type === 'multi'

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

    console.log(`[CHECKING] selected=[${selected.join(',')}] joined="${selected.join('')}" isMulti=${isMulti} isSharedChar=${isSharedChar} currentRound=${state.currentRound}`)

    let isCorrect = false
    if (isSharedChar && state.currentRound === 0) {
      isCorrect = selected.join('') === (currentQ as SharedCharQuestion).idioms[0]
    } else if (isSharedChar && state.currentRound === 1) {
      isCorrect = selected.join('') === (currentQ as SharedCharQuestion).idioms[1]
    } else if (isMulti) {
      // Multi-idiom mode: order-dependent match against each unfound idiom
      const multiQ = currentQ as MultiIdiomQuestion
      const selectedStr = selected.join('')
      const alreadyFoundStrs = new Set(
        state.foundIdioms.map(f => [...f].sort().join(''))
      )
      const matchedIdiom = multiQ.idioms.find(i => {
        return !alreadyFoundStrs.has([...i].sort().join('')) && i === selectedStr
      })

      if (matchedIdiom) {
        console.log(`[CHECKING] MULTI MATCH! found="${matchedIdiom}" stillToFind=${multiQ.idioms.length - state.foundIdioms.length - 1}`)
        setShowMultiFound(matchedIdiom)
        setTimeout(() => setShowMultiFound(''), 1200)
        dispatch({ type: 'RECORD_CORRECT' })
        const stillToFind = multiQ.idioms.length - state.foundIdioms.length - 1
        dispatch({ type: 'FOUND_IDIOM', chars: selected })
        if (stillToFind === 0) {
          audioEngine.playMelody([262, 330, 392, 524])
          if (!isEndless) setShowIdiomCard(true)
        } else {
          audioEngine.playMelody([330, 440, 524])
        }
      } else {
        console.log(`[CHECKING] MULTI NO MATCH selected="${selectedStr}" foundCount=${state.foundIdioms.length}`)
        setShowMultiError(true)
        setTimeout(() => setShowMultiError(false), 800)
        dispatch({ type: 'RECORD_WRONG' })
        if (state.consecutiveErrors >= ERROR_PENALTY_THRESHOLD - 1) {
          setPenaltyFlash(true)
          setTimeout(() => setPenaltyFlash(false), 1500)
        }
        audioEngine.playError()
        setTimeout(() => { dispatch({ type: 'CLEAR_SELECTION' }) }, 800)
      }
      return
    } else if ('rounds' in currentQ) {
      isCorrect = selected.join('') === currentQ.rounds[0].idiom
    } else if ('idiom' in currentQ) {
      isCorrect = selected.join('') === (currentQ as import('../types').IdiomQuestion).idiom
    }

    if (isCorrect) {
      console.log(`[CHECKING] CORRECT! idiom=${('idiom' in currentQ ? (currentQ as IdiomQuestion).idiom : 'rounds' in currentQ ? currentQ.rounds[0].idiom : '?')} isEndless=${isEndless}`)
      dispatch({ type: 'RECORD_CORRECT' })
      const melody = 'rounds' in currentQ ? [262, 330, 392, 524]
        : 'melody' in currentQ ? (currentQ as IdiomQuestion).melody
        : [262, 330, 392, 524]
      audioEngine.playMelody(melody)
      setTimeout(() => {
        if (isReverse) {
          dispatch({ type: 'SHOW_MEANING_SELECT' })
        } else if (isSharedChar && state.currentRound === 0) {
          dispatch({ type: 'COMPLETE_SHARED_ROUND' })
        } else {
          dispatch({ type: 'VALIDATE_SUCCESS' })
          if (!isEndless) {
            setShowIdiomCard(true)
          }
        }
      }, 500)
    } else {
      console.log(`[CHECKING] WRONG! expected="${('idiom' in currentQ ? (currentQ as IdiomQuestion).idiom : 'rounds' in currentQ ? currentQ.rounds[0].idiom : '?')}" got="${selected.join('')}"`)
      dispatch({ type: 'RECORD_WRONG' })
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
  }, [state.phase, state.selectedStars, currentQ, dispatch, isEndless, state.consecutiveErrors, isSharedChar, state.currentRound, isMulti, state.foundIdioms])

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

  // Handle reverse meaning wrong — show correct answer then advance
  useEffect(() => {
    if (state.phase === 'RESULT' && state.lastResult === 'wrong' && isReverse && advanceFromWrongRef.current) {
      advanceFromWrongRef.current = false
      setShowWrongMeaning(true)
      const t = setTimeout(() => {
        setShowWrongMeaning(false)
        dispatch({ type: 'NEXT_QUESTION' })
      }, 2000)
      return () => clearTimeout(t)
    }
  }, [state.phase, state.lastResult, isReverse, dispatch])

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
      console.log(`[CLICK] char=${char} starId=${starId} currentSelected=[${state.selectedStars.join(',')}] phase=${state.phase}`)
      dispatch({ type: 'SELECT_STAR', character: char, starId })
    },
    [state.phase, state.selectedStars, dispatch],
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
    : isMulti
      ? ''
      : isSharedChar
        ? (currentQ as SharedCharQuestion).hints[state.currentRound]
        : (currentQ as IdiomQuestion).hint

  const foundCount = state.foundIdioms.length
  const multiQ = isMulti ? (currentQ as MultiIdiomQuestion) : null

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
          onWrong={() => {
            advanceFromWrongRef.current = true
            dispatch({ type: 'VALIDATE_MEANING', correct: false })
          }}
        />
      )}

      {/* Multi-idiom progress indicator */}
      {isMulti && multiQ && (
        <div style={{
          position: 'absolute', top: 96, left: '50%', transform: 'translateX(-50%)', zIndex: 20,
          display: 'flex', gap: 12, alignItems: 'center',
          padding: '8px 24px',
          background: 'rgba(10,22,40,0.75)',
          border: '1px solid rgba(212,160,76,0.2)',
          borderRadius: 2,
          backdropFilter: 'blur(8px)',
          fontFamily: "'LXGW WenKai','KaiTi',serif",
        }}>
          <div style={{ fontSize: 11, color: '#8A8070', letterSpacing: 3, marginRight: 8, fontFamily: "'Noto Serif SC',serif" }}>
            寻词进度
          </div>
          {multiQ.idioms.map((_idiom, idx) => {
            const found = idx < foundCount
            return (
              <div key={idx} style={{
                padding: '4px 12px',
                borderRadius: 2,
                border: found ? '1px solid rgba(212,160,76,0.5)' : '1px solid rgba(100,90,80,0.3)',
                fontSize: 14, letterSpacing: 2,
                color: found ? '#D4A04C' : '#4A4840',
                transition: 'all 0.3s',
              }}>
                {found ? '✦' : '☆'}
              </div>
            )
          })}
        </div>
      )}

      {!isReverse && !isMulti && <ClueCard clue={clue} />}

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
          foundIdioms={state.foundIdioms}
        />
      )}

      {!(state.phase === 'MEANING_SELECT' && isReverse) && (
        <SelectionDisplay
          selectedChars={state.selectedStars}
          totalSlots={4}
        />
      )}


      {/* Idiom Card overlay */}
      {showIdiomCard && isSuccess && !isEndless && (
        <IdiomCard question={currentQ} onContinue={handleContinue} />
      )}

      {/* Penalty flash */}
      {penaltyFlash && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', zIndex: 50,
          transform: 'translate(-50%,-50%)',
          padding: '16px 36px',
          background: 'rgba(10,22,40,0.9)',
          border: '1px solid rgba(200,66,58,0.25)',
          borderRadius: 2,
          fontSize: 18, color: '#C8423A', letterSpacing: 4,
          fontFamily: "'Noto Serif SC',serif",
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease',
          pointerEvents: 'none',
        }}>
          时间惩罚 -5s
        </div>
      )}

      {/* Multi mode: found notification */}
      {showMultiFound && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', zIndex: 50,
          transform: 'translate(-50%,-50%)',
          padding: '16px 36px',
          background: 'rgba(10,22,40,0.9)',
          border: '1px solid rgba(212,160,76,0.3)',
          borderRadius: 2,
          fontSize: 18, color: '#D4A04C', letterSpacing: 4,
          fontFamily: "'LXGW WenKai','KaiTi',serif",
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease',
          pointerEvents: 'none',
        }}>
          已找到：{showMultiFound}
        </div>
      )}

      {/* Multi mode: no match flash */}
      {showMultiError && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', zIndex: 50,
          transform: 'translate(-50%,-50%)',
          padding: '16px 36px',
          background: 'rgba(10,22,40,0.9)',
          border: '1px solid rgba(200,66,58,0.25)',
          borderRadius: 2,
          fontSize: 18, color: '#C8423A', letterSpacing: 4,
          fontFamily: "'Noto Serif SC',serif",
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease',
          pointerEvents: 'none',
        }}>
          未匹配，再试试
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
            {isMulti && multiQ ? (
              <div>
                {multiQ.idioms.map((idiom, idx) => (
                  <p key={idx} style={{
                    fontSize: 24, fontFamily: "'LXGW WenKai','KaiTi',serif",
                    color: '#E8E4D9', letterSpacing: 6, marginBottom: 4,
                  }}>
                    {idiom}
                  </p>
                ))}
                <p style={{ fontSize: 12, color: '#8A8070', marginTop: 8, letterSpacing: 2, fontFamily: "'Noto Serif SC',serif" }}>
                  已找到 {foundCount}/{multiQ.idioms.length} 个
                </p>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      )}

      {/* Wrong meaning overlay (reverse mode) */}
      {showWrongMeaning && (
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
              释义错误
            </p>
            <p style={{
              fontSize: 16, color: '#E8E4D9', letterSpacing: 1, lineHeight: 1.6,
              fontFamily: "'Noto Serif SC',serif",
            }}>
              正确答案：{(currentQ as import('../types').ReverseQuestion).meaning}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
