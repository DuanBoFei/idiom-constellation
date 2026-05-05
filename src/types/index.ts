export type GameplayMode = 'normal' | 'reverse' | 'shared-char' | 'multi'

export interface LevelConfig {
  id: number
  name: string
  mode: GameplayMode
  questionsPerRound: number
  totalStarCount: number
  distractorCount: number
  timePerQuestion: number
  scoreMultiplier: number
}

export type GamePhase = 'INIT' | 'LEVEL_SELECT' | 'PLAYING' | 'MEANING_SELECT' | 'MEANING_CHECK' | 'CHECKING' | 'ROUND2_PLAYING' | 'ROUND2_CHECKING' | 'RESULT' | 'GAMEOVER'

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

export interface ReverseQuestion {
  id: string
  type: 'reverse'
  idiom: string
  pinyin: string
  meaning: string
  meaningFragments: string[]     // 3-4 full-sentence options including correct
  hint: string
  story?: string
  difficulty: 1 | 2 | 3
  chars: string[]                // 4 idiom characters (revealed after meaning selection)
  distractors: string[]          // distractor characters
}

export interface SharedCharQuestion {
  id: string
  type: 'shared-char'
  idioms: [string, string]
  allChars: string[]             // deduplicated union of both idioms' chars
  sharedChars: string[]          // characters shared between both idioms
  distractors: string[]
  hints: [string, string]
  stories?: [string, string]
  difficulty: 1 | 2 | 3
}

export interface MultiIdiomQuestion {
  id: string
  type: 'multi'
  idioms: [string, string, string]     // 3 idioms to find
  allChars: string[]                   // all unique chars from all idioms
  distractors: string[]
  hints: [string, string, string]      // one hint per idiom
  stories?: [string, string, string]
  difficulty: 3
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

export type Question = IdiomQuestion | DoubleIdiomQuestion | ReverseQuestion | SharedCharQuestion | MultiIdiomQuestion

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
  selectedStarIds: string[]
  score: number
  timeRemaining: number
  correctCount: number
  totalTimeUsed: number
  timesPerQuestion: number[]
  lastResult: 'correct' | 'wrong' | 'timeout' | null
  currentLevelId: number
  streak: number
  starGlowMode: boolean
  consecutiveErrors: number
  currentRound: number
  completedRounds: string[][]
  foundIdioms: string[][]             // idioms found so far (for multi mode)
  isEndlessMode: boolean
}

export type GameAction =
  | { type: 'START_GAME'; questions: Question[] }
  | { type: 'SELECT_STAR'; character: string; starId: string }
  | { type: 'VALIDATE_SUCCESS' }
  | { type: 'VALIDATE_FAIL' }
  | { type: 'TIMEOUT' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'TICK' }
  | { type: 'END_GAME' }
  | { type: 'RESET' }
  | { type: 'SELECT_LEVEL'; levelId: number; questions: Question[]; isEndless?: boolean }
  | { type: 'RECORD_CORRECT' }
  | { type: 'RECORD_WRONG' }
  | { type: 'LEVEL_COMPLETE' }
  | { type: 'VALIDATE_MEANING'; correct: boolean }
  | { type: 'COMPLETE_SHARED_ROUND' }
  | { type: 'SHOW_MEANING_SELECT' }
  | { type: 'FOUND_IDIOM'; chars: string[] }
  | { type: 'CLEAR_SELECTION' }

export interface LeaderboardEntry {
  name: string
  score: number
  correctCount: number
  date: string
  timestamp: number
}

export interface PlayerProgress {
  unlockedLevels: number[]
  levelStars: Record<number, number>
  levelScores: Record<number, number>
  endlessHighScore: number
  totalScore: number
}
