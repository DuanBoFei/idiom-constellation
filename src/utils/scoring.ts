export function calculateScore(correctCount: number, remainingSeconds: number): number {
  const base = correctCount * 100
  const timeBonus = remainingSeconds * 20
  const perfectMultiplier = correctCount === 6 ? 1.2 : 1
  return Math.round((base + timeBonus) * perfectMultiplier)
}
