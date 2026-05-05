import { useReducer, useCallback, useRef, useState, useEffect } from 'react'
import { GameContext, gameReducer, createInitialState } from './hooks/useGameReducer'
import { LEVELS } from './constants/levels'
import { questions } from './data/questions'
import { shuffle } from './utils/shuffle'
import { loadProgress, saveProgress, calculateStarRating, unlockNextLevel } from './utils/progress'
import StarField from './components/StarField'
import StartScreen from './components/StartScreen'
import GameScreen from './components/GameScreen'
import GameEndScreen from './components/GameEndScreen'

type Screen = 'menu' | 'game' | 'result'

function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState)
  const [screen, setScreen] = useState<Screen>('menu')
  const [currentLevelId, setCurrentLevelId] = useState(0)
  const [isEndless, setIsEndless] = useState(false)

  const handleSelectLevel = useCallback((levelId: number) => {
    const config = LEVELS.find(l => l.id === levelId)
    if (!config) return

    const pool = questions.filter(q => {
      if (levelId === 1) return q.difficulty === 1 && !('type' in q)
      if (levelId === 2) return (q.difficulty === 1 || q.difficulty === 2) && !('type' in q)
      if (levelId === 3) return 'type' in q && q.type === 'reverse'
      if (levelId === 4) return 'type' in q && q.type === 'shared-char'
      if (levelId === 5) return 'type' in q && q.type === 'multi'
      return false
    })
    const selected = shuffle(pool).slice(0, config.questionsPerRound)

    dispatch({ type: 'SELECT_LEVEL', levelId, questions: selected, isEndless: false })
    setCurrentLevelId(levelId)
    setIsEndless(false)
    setScreen('game')
  }, [dispatch])

  const handleEndless = useCallback(() => {
    const selected = shuffle(questions).slice(0, 10)
    dispatch({ type: 'SELECT_LEVEL', levelId: 6, questions: selected, isEndless: true })
    setCurrentLevelId(6)
    setIsEndless(true)
    setScreen('game')
  }, [dispatch])

  const saveAndReset = useCallback(() => {
    if (currentLevelId > 0 && currentLevelId <= 5 && !isEndless) {
      const progress = loadProgress()
      const stars = calculateStarRating(state.correctCount, state.questions.length)
      const newLevelScores = { ...progress.levelScores, [currentLevelId]: state.score }
      const updatedProgress = {
        ...progress,
        levelStars: { ...progress.levelStars, [currentLevelId]: Math.max(progress.levelStars[currentLevelId] || 0, stars) },
        levelScores: newLevelScores,
        totalScore: Object.values(newLevelScores).reduce((a, b) => a + b, 0),
      }
      const unlocked = unlockNextLevel(updatedProgress, currentLevelId)
      saveProgress(unlocked)
    } else if (isEndless) {
      const progress = loadProgress()
      if (state.score > progress.endlessHighScore) {
        saveProgress({ ...progress, endlessHighScore: state.score })
      }
    }
    dispatch({ type: 'RESET' })
  }, [dispatch, currentLevelId, isEndless, state.score, state.correctCount, state.questions.length])

  const handleBackToMenu = useCallback(() => {
    saveAndReset()
    setScreen('menu')
  }, [saveAndReset])

  const handlePlayAgain = useCallback(() => {
    saveAndReset()
    if (isEndless) {
      handleEndless()
    } else if (currentLevelId > 0) {
      handleSelectLevel(currentLevelId)
    } else {
      setScreen('menu')
    }
  }, [saveAndReset, isEndless, currentLevelId, handleSelectLevel, handleEndless])

  // Detect GAMEOVER phase and transition to result screen
  const prevPhaseRef = useRef(state.phase)

  useEffect(() => {
    if (prevPhaseRef.current !== 'GAMEOVER' && state.phase === 'GAMEOVER') {
      setScreen('result')
    }
    prevPhaseRef.current = state.phase
  }, [state.phase])

  const startNewGame = useCallback(() => {
    dispatch({ type: 'RESET' })
    setScreen('menu')
  }, [dispatch])

  return (
    <GameContext.Provider value={{ state, dispatch, startNewGame }}>
      <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
        {screen === 'menu' && <StarField />}

        {screen === 'menu' && (
          <StartScreen onSelectLevel={handleSelectLevel} />
        )}

        {screen === 'game' && (
          <GameScreen levelId={currentLevelId} isEndless={isEndless} />
        )}

        {screen === 'result' && (
          <>
            <StarField paused />
            <GameEndScreen
              onPlayAgain={handlePlayAgain}
              onBackToLevels={handleBackToMenu}
              isEndless={isEndless}
            />
          </>
        )}
      </div>
    </GameContext.Provider>
  )
}

export default App
