import { useReducer, useCallback } from 'react'
import { GameContext, gameReducer, createInitialState, pickQuestions } from './useGameReducer'

export default function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState)

  const startNewGame = useCallback(() => {
    const questions = pickQuestions()
    dispatch({ type: 'START_GAME', questions })
  }, [dispatch])

  return (
    <GameContext.Provider value={{ state, dispatch, startNewGame }}>
      {children}
    </GameContext.Provider>
  )
}
