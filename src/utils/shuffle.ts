import type { RandFn } from './seededRandom'

export function shuffle<T>(array: T[], rand: RandFn = Math.random): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function pickRandom<T>(array: T[], count: number, rand: RandFn = Math.random): T[] {
  return shuffle(array, rand).slice(0, count)
}
