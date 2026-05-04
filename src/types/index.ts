export type GamePhase = 'INIT' | 'PLAYING' | 'CHECKING' | 'RESULT' | 'GAMEOVER'

export interface IdiomQuestion {
  id: string
  idiom: string     // 4 chars
  pinyin: string
  meaning: string
  hint: string
  story?: string
  difficulty: 1 | 2 | 3
  distractors: string[]     // single-char distractors
  melody: number[]          // 4 frequencies in Hz
}

export interface DoubleIdiomRound {
  idiom: string
  hint: string
  distractors: string[]
}

export interface DoubleIdiomQuestion {
  id: string
  type: 'double'
  difficulty: 3
  rounds: [DoubleIdiomRound, DoubleIdiomRound]
}

export type Question = IdiomQuestion | DoubleIdiomQuestion

export interface StarPosition {
  id: string        // the character
  x: number         // percentage 0-100
  y: number         // percentage 0-100
  character: string
  belongsTo: 'answer' | 'distractor'
  roundIndex?: number  // for double-idiom, which round this belongs to
}

export interface GameState {
  phase: GamePhase
  questions: Question[]
  currentQuestionIndex: number
  selectedStars: string[]
  score: number
  timeRemaining: number
  correctCount: number
  totalTimeUsed: number
  timesPerQuestion: number[]
  lastResult: 'correct' | 'wrong' | 'timeout' | null
}

export type GameAction =
  | { type: 'START_GAME'; questions: Question[] }
  | { type: 'SELECT_STAR'; character: string }
  | { type: 'VALIDATE_SUCCESS' }
  | { type: 'VALIDATE_FAIL' }
  | { type: 'TIMEOUT' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'TICK' }
  | { type: 'END_GAME' }
  | { type: 'RESET' }

export interface LeaderboardEntry {
  name: string
  score: number
  correctCount: number
  date: string
  timestamp: number
}
