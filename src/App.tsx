import { useReducer, useCallback, useState } from 'react'
import { GameContext, gameReducer, createInitialState, pickQuestions } from './hooks/useGameReducer'
import StarField from './components/StarField'
import StartScreen from './components/StartScreen'
import GameScreen from './components/GameScreen'
import GameOverScreen from './components/GameOverScreen'
import LeaderboardScreen from './components/LeaderboardScreen'

type Screen = 'start' | 'game' | 'leaderboard'

function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState)
  const [screen, setScreen] = useState<Screen>('start')

  const startNewGame = useCallback(() => {
    const questions = pickQuestions()
    dispatch({ type: 'START_GAME', questions })
    setScreen('game')
  }, [dispatch])

  const handlePlayAgain = useCallback(() => {
    dispatch({ type: 'RESET' })
    setScreen('start')
  }, [dispatch])

  const handleLeaderboard = useCallback(() => {
    setScreen('leaderboard')
  }, [])

  const handleBackToStart = useCallback(() => {
    setScreen('start')
  }, [])

  return (
    <GameContext.Provider value={{ state, dispatch, startNewGame }}>
      <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
        <StarField paused={screen === 'start' || screen === 'leaderboard'} />

        {screen === 'start' && (
          <StartScreen onStart={startNewGame} onLeaderboard={handleLeaderboard} />
        )}

        {screen === 'game' && state.phase !== 'GAMEOVER' && <GameScreen />}

        {screen === 'game' && state.phase === 'GAMEOVER' && (
          <GameOverScreen onPlayAgain={handlePlayAgain} onLeaderboard={handleLeaderboard} />
        )}

        {screen === 'leaderboard' && (
          <LeaderboardScreen onBack={handleBackToStart} />
        )}
      </div>
    </GameContext.Provider>
  )
}

export default App
