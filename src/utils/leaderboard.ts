import type { LeaderboardEntry } from '../types'

const STORAGE_KEY = 'idiom-constellation-leaderboard'

function getToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const all: LeaderboardEntry[] = JSON.parse(raw)
    const today = getToday()
    return all
      .filter((e) => e.date === today)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
  } catch {
    return []
  }
}

export function saveScore(entry: Omit<LeaderboardEntry, 'date' | 'timestamp'>): void {
  const newEntry: LeaderboardEntry = {
    ...entry,
    date: getToday(),
    timestamp: Date.now(),
  }
  try {
    const all: LeaderboardEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    all.push(newEntry)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {
    // localStorage unavailable
  }
}
