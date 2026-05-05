import type { PlayerProgress } from '../types'
import { PROGRESS_STORAGE_KEY, PROGRESS_VERSION } from '../constants/levels'

function getDefaultProgress(): PlayerProgress {
  return {
    unlockedLevels: [1],
    levelStars: {},
    levelScores: {},
    endlessHighScore: 0,
    totalScore: 0,
  }
}

export function loadProgress(): PlayerProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY)
    if (!raw) return getDefaultProgress()
    const data = JSON.parse(raw)
    if (data.version !== PROGRESS_VERSION) {
      localStorage.removeItem(PROGRESS_STORAGE_KEY)
      return getDefaultProgress()
    }
    return data.progress as PlayerProgress
  } catch {
    return getDefaultProgress()
  }
}

export function saveProgress(progress: PlayerProgress): void {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
      version: PROGRESS_VERSION,
      progress,
    }))
  } catch { /* localStorage unavailable */ }
}

export function calculateStarRating(correctCount: number, totalQuestions: number): number {
  const rate = correctCount / totalQuestions
  if (rate > 0.8) return 3
  if (rate >= 0.5) return 2
  return 1
}

export function unlockNextLevel(progress: PlayerProgress, completedLevelId: number): PlayerProgress {
  const nextId = completedLevelId + 1
  if (nextId > 5) return progress
  if (progress.unlockedLevels.includes(nextId)) return progress
  return {
    ...progress,
    unlockedLevels: [...progress.unlockedLevels, nextId],
  }
}
