import { createContext, useContext } from 'react'
import { shuffle } from '../utils/shuffle'
import { questions as questionBank } from '../data/questions'
import { LEVELS, STAR_GLOW_THRESHOLD, ERROR_PENALTY_THRESHOLD, ERROR_PENALTY_SECONDS } from '../constants/levels'
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
    selectedStarIds: [],
    score: 0,
    timeRemaining: 0,
    correctCount: 0,
    totalTimeUsed: 0,
    timesPerQuestion: [],
    lastResult: null,
    currentLevelId: 0,
    streak: 0,
    starGlowMode: false,
    consecutiveErrors: 0,
    isEndlessMode: false,
    currentRound: 0,
    completedRounds: [],
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
      if (state.phase !== 'PLAYING' && state.phase !== 'ROUND2_PLAYING') return state
      if (state.selectedStarIds.includes(action.starId)) return state
      if (state.selectedStars.length >= 4) return state
      const newSelected = [...state.selectedStars, action.character]
      const newSelectedIds = [...state.selectedStarIds, action.starId]
      if (newSelected.length === 4) {
        return {
          ...state,
          phase: state.phase === 'ROUND2_PLAYING' ? 'ROUND2_CHECKING' : 'CHECKING',
          selectedStars: newSelected,
          selectedStarIds: newSelectedIds,
        }
      }
      return { ...state, selectedStars: newSelected, selectedStarIds: newSelectedIds }
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
        selectedStarIds: [],
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
        selectedStarIds: [],
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
        selectedStarIds: [],
        timeRemaining: getQuestionTime(nextQ),
        lastResult: null,
        currentRound: 0,
        completedRounds: [],
      }
    }
    case 'TICK': {
      if (state.phase !== 'PLAYING' && state.phase !== 'ROUND2_PLAYING') return state
      const newTime = state.timeRemaining - 1
      if (newTime <= 0) {
        return {
          ...state,
          timeRemaining: 0,
          phase: state.phase === 'ROUND2_PLAYING' ? 'ROUND2_CHECKING' : 'CHECKING',
        }
      }
      return { ...state, timeRemaining: newTime }
    }
    case 'END_GAME':
      return { ...state, phase: 'GAMEOVER' }
    case 'RESET':
      return createInitialState()
    case 'SELECT_LEVEL': {
      const levelConfig = LEVELS.find(l => l.id === action.levelId)
      return {
        ...createInitialState(),
        phase: 'PLAYING',
        questions: action.questions,
        currentQuestionIndex: 0,
        timeRemaining: levelConfig ? levelConfig.timePerQuestion : 20,
        currentLevelId: action.levelId,
        isEndlessMode: action.isEndless ?? false,
      }
    }
    case 'RECORD_CORRECT': {
      const newStreak = state.streak >= 0 ? state.streak + 1 : 1
      return {
        ...state,
        streak: newStreak,
        starGlowMode: newStreak >= STAR_GLOW_THRESHOLD,
        consecutiveErrors: 0,
      }
    }
    case 'RECORD_WRONG': {
      const newConsecutive = state.consecutiveErrors + 1
      const penalty = newConsecutive >= ERROR_PENALTY_THRESHOLD
        ? Math.min(state.timeRemaining, ERROR_PENALTY_SECONDS)
        : 0
      return {
        ...state,
        streak: state.streak > 0 ? 0 : state.streak - 1,
        starGlowMode: false,
        consecutiveErrors: newConsecutive >= ERROR_PENALTY_THRESHOLD ? 0 : newConsecutive,
        timeRemaining: Math.max(0, state.timeRemaining - penalty),
      }
    }
    case 'LEVEL_COMPLETE':
      return { ...state, phase: 'GAMEOVER' }
    case 'SHOW_MEANING_SELECT':
      return { ...state, phase: 'MEANING_SELECT', selectedStars: [], selectedStarIds: [] }
    case 'VALIDATE_MEANING':
      if (action.correct) {
        return {
          ...state,
          phase: 'RESULT',
          lastResult: 'correct',
          correctCount: state.correctCount + 1,
          timeRemaining: state.timeRemaining,
        }
      }
      return {
        ...state,
        phase: 'RESULT',
        lastResult: 'wrong',
        timeRemaining: state.timeRemaining,
      }
    case 'COMPLETE_SHARED_ROUND': {
      return {
        ...state,
        currentRound: 1,
        completedRounds: [...state.completedRounds, [...state.selectedStars]],
        selectedStars: [],
        selectedStarIds: [],
        phase: 'ROUND2_PLAYING',
      }
    }
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
