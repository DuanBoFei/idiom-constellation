import type { LevelConfig } from '../types'

export const LEVELS: LevelConfig[] = [
  { id: 1, name: '启明', mode: 'normal', questionsPerRound: 5, totalStarCount: 12, distractorCount: 0, timePerQuestion: 18, scoreMultiplier: 1.0 },
  { id: 2, name: '流光', mode: 'normal', questionsPerRound: 5, totalStarCount: 14, distractorCount: 2, timePerQuestion: 16, scoreMultiplier: 1.5 },
  { id: 3, name: '逆位', mode: 'reverse', questionsPerRound: 5, totalStarCount: 14, distractorCount: 2, timePerQuestion: 22, scoreMultiplier: 2.0 },
  { id: 4, name: '星陨', mode: 'shared-char', questionsPerRound: 4, totalStarCount: 10, distractorCount: 3, timePerQuestion: 18, scoreMultiplier: 3.0 },
  { id: 5, name: '万象', mode: 'multi', questionsPerRound: 3, totalStarCount: 16, distractorCount: 5, timePerQuestion: 60, scoreMultiplier: 5.0 },
]

export const ENDLESS_SCORE_DECAY_INTERVAL = 20
export const ENDLESS_SCORE_DECAY_RATE = 0.05
export const ENDLESS_FLAT_SCORE = 100
export const STAR_GLOW_THRESHOLD = 3
export const ERROR_PENALTY_THRESHOLD = 2
export const ERROR_PENALTY_SECONDS = 5
export const PROGRESS_STORAGE_KEY = 'idiom-constellation-progress'
export const PROGRESS_VERSION = 2
