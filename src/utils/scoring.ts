export function calculateScore(
  correctCount: number,
  remainingSeconds: number,
  totalQuestions: number,
  scoreMultiplier: number = 1,
): number {
  const base = correctCount * 100
  const timeBonus = remainingSeconds * 20
  const perfectMultiplier = totalQuestions > 0 && correctCount === totalQuestions ? 1.2 : 1
  return Math.round((base + timeBonus) * perfectMultiplier * scoreMultiplier)
}
