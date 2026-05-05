import { questions } from '../data/questions'
import { ENDLESS_SCORE_DECAY_INTERVAL, ENDLESS_SCORE_DECAY_RATE, ENDLESS_FLAT_SCORE } from '../constants/levels'
import { shuffle } from './shuffle'

export function getEndlessQuestions(count: number): typeof questions {
  return shuffle([...questions]).slice(0, count)
}

export function calculateEndlessScore(questionIndex: number): number {
  const decayMultiplier = questionIndex >= ENDLESS_SCORE_DECAY_INTERVAL
    ? Math.max(0.1, 1 - Math.floor(questionIndex / ENDLESS_SCORE_DECAY_INTERVAL) * ENDLESS_SCORE_DECAY_RATE)
    : 1
  return Math.round(ENDLESS_FLAT_SCORE * decayMultiplier)
}
