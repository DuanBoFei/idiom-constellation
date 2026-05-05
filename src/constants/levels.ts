import type { LevelConfig } from '../types'

export const LEVELS: LevelConfig[] = [
  { id: 1, name: '启明', mode: 'normal', questionsPerRound: 5, totalStarCount: 12, distractorCount: 0, timePerQuestion: 18 },
  { id: 2, name: '流光', mode: 'normal', questionsPerRound: 5, totalStarCount: 14, distractorCount: 2, timePerQuestion: 16 },
  { id: 3, name: '银河', mode: 'normal', questionsPerRound: 5, totalStarCount: 16, distractorCount: 4, timePerQuestion: 14 },
  { id: 4, name: '逆位', mode: 'reverse', questionsPerRound: 5, totalStarCount: 14, distractorCount: 2, timePerQuestion: 22 },
  { id: 5, name: '星陨', mode: 'shared-char', questionsPerRound: 4, totalStarCount: 10, distractorCount: 3, timePerQuestion: 18 },
]

export const ENDLESS_SCORE_DECAY_INTERVAL = 20
export const ENDLESS_SCORE_DECAY_RATE = 0.05
export const ENDLESS_FLAT_SCORE = 100
export const STAR_GLOW_THRESHOLD = 3
export const ERROR_PENALTY_THRESHOLD = 2
export const ERROR_PENALTY_SECONDS = 5
export const PROGRESS_STORAGE_KEY = 'idiom-constellation-progress'
export const PROGRESS_VERSION = 2
