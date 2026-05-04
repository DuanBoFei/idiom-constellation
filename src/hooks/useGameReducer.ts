import { createContext, useContext } from 'react'
import { shuffle } from '../utils/shuffle'
import { questions as questionBank } from '../data/questions'
import type { GameState, GameAction, Question } from '../types'

const TIME_PER_SINGLE = 20
const TIME_PER_DOUBLE = 25
const BONUS_TIME = 5

export function pickQuestions(): Question[] {
  const shuffled = shuffle(questionBank)
  const easy = shuffled.filter((q) => q.difficulty === 1).slice(0, 2)
  const medium = shuffled.filter((q) => q.difficulty === 2).slice(0, 2)
  const hard = shuffled.filter((q) => q.difficulty === 3).slice(0, 2)
  return shuffle([...easy, ...medium, ...hard])
}

export function createInitialState(): GameState {
  return {
    phase: 'INIT',
    questions: [],
    currentQuestionIndex: 0,
    selectedStars: [],
    score: 0,
    timeRemaining: 0,
    correctCount: 0,
    totalTimeUsed: 0,
    timesPerQuestion: [],
    lastResult: null,
  }
}

function getQuestionTime(question: Question): number {
  return question.difficulty === 3 ? TIME_PER_DOUBLE : TIME_PER_SINGLE
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const selected = action.questions
      return {
        ...createInitialState(),
        phase: 'PLAYING',
        questions: selected,
        currentQuestionIndex: 0,
        timeRemaining: getQuestionTime(selected[0]),
      }
    }
    case 'SELECT_STAR': {
      if (state.phase !== 'PLAYING') return state
      if (state.selectedStars.includes(action.character)) return state
      if (state.selectedStars.length >= 4) return state
      const newSelected = [...state.selectedStars, action.character]
      if (newSelected.length === 4) {
        return { ...state, phase: 'CHECKING', selectedStars: newSelected }
      }
      return { ...state, selectedStars: newSelected }
    }
    case 'VALIDATE_SUCCESS': {
      const question = state.questions[state.currentQuestionIndex]
      const timeSpent = getQuestionTime(question) - state.timeRemaining
      return {
        ...state,
        phase: 'RESULT',
        lastResult: 'correct',
        correctCount: state.correctCount + 1,
        timeRemaining: state.timeRemaining + BONUS_TIME,
        totalTimeUsed: state.totalTimeUsed + timeSpent,
        timesPerQuestion: [...state.timesPerQuestion, timeSpent],
      }
    }
    case 'VALIDATE_FAIL': {
      const question = state.questions[state.currentQuestionIndex]
      const timeSpent = getQuestionTime(question) - state.timeRemaining
      return {
        ...state,
        phase: 'RESULT',
        lastResult: 'wrong',
        selectedStars: [],
        totalTimeUsed: state.totalTimeUsed + timeSpent,
        timesPerQuestion: [...state.timesPerQuestion, timeSpent],
      }
    }
    case 'TIMEOUT': {
      const question = state.questions[state.currentQuestionIndex]
      return {
        ...state,
        phase: 'RESULT',
        lastResult: 'timeout',
        selectedStars: [],
        timeRemaining: 0,
        totalTimeUsed: state.totalTimeUsed + getQuestionTime(question),
        timesPerQuestion: [...state.timesPerQuestion, getQuestionTime(question)],
      }
    }
    case 'NEXT_QUESTION': {
      const nextIdx = state.currentQuestionIndex + 1
      if (nextIdx >= state.questions.length) {
        return { ...state, phase: 'GAMEOVER' }
      }
      const nextQ = state.questions[nextIdx]
      return {
        ...state,
        phase: 'PLAYING',
        currentQuestionIndex: nextIdx,
        selectedStars: [],
        timeRemaining: state.timeRemaining + getQuestionTime(nextQ),
        lastResult: null,
      }
    }
    case 'TICK': {
      if (state.phase !== 'PLAYING') return state
      const newTime = state.timeRemaining - 1
      if (newTime <= 0) {
        return { ...state, timeRemaining: 0, phase: 'CHECKING' }
      }
      return { ...state, timeRemaining: newTime }
    }
    case 'END_GAME':
      return { ...state, phase: 'GAMEOVER' }
    case 'RESET':
      return createInitialState()
    default:
      return state
  }
}

interface GameContextValue {
  state: GameState
  dispatch: React.Dispatch<GameAction>
  startNewGame: () => void
}

export const GameContext = createContext<GameContextValue | null>(null)

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
