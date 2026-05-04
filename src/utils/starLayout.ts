import { shuffle } from './shuffle'
import type { StarPosition } from '../types'

interface LayoutConfig {
  starCount: number
  fieldWidth: number
  fieldHeight: number
  minSpacing: number
  paddingX: number
  paddingY: number
}

function generatePosition(
  existing: StarPosition[],
  config: LayoutConfig,
): { x: number; y: number } {
  const marginX = config.fieldWidth * (config.paddingX / 100)
  const marginY = config.fieldHeight * (config.paddingY / 100)
  const maxAttempts = 100

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const x = marginX + Math.random() * (config.fieldWidth - 2 * marginX)
    const y = marginY + Math.random() * (config.fieldHeight - 2 * marginY)

    const overlaps = existing.some(
      (s) => Math.hypot(s.x * config.fieldWidth / 100 - x, s.y * config.fieldHeight / 100 - y) < config.minSpacing,
    )

    if (!overlaps) {
      return { x: (x / config.fieldWidth) * 100, y: (y / config.fieldHeight) * 100 }
    }
  }

  // Fallback grid placement
  const idx = existing.length
  const cols = Math.ceil(Math.sqrt(config.starCount))
  return {
    x: config.paddingX + (idx % cols) * ((100 - 2 * config.paddingX) / cols),
    y: config.paddingY + Math.floor(idx / cols) * ((100 - 2 * config.paddingY) / cols),
  }
}

export function generateStarLayout(
  answerChars: string[],
  distractors: string[],
  fieldWidth: number,
  fieldHeight: number,
  roundIndex?: number,
): StarPosition[] {
  const allChars = [...answerChars, ...distractors]
  const config: LayoutConfig = {
    starCount: allChars.length,
    fieldWidth,
    fieldHeight,
    minSpacing: 80,
    paddingX: 8,
    paddingY: 15,
  }

  const positions: StarPosition[] = []

  for (const char of answerChars) {
    positions.push({
      id: `answer-${char}-${roundIndex ?? 0}`,
      x: 0,
      y: 0,
      character: char,
      belongsTo: 'answer',
      roundIndex,
    })
  }

  for (const char of distractors) {
    positions.push({
      id: `distractor-${char}-${roundIndex ?? 0}-${Math.random().toString(36).slice(2, 6)}`,
      x: 0,
      y: 0,
      character: char,
      belongsTo: 'distractor',
      roundIndex,
    })
  }

  for (const pos of positions) {
    const { x, y } = generatePosition(positions.filter((p) => p !== pos), config)
    pos.x = x
    pos.y = y
  }

  return shuffle(positions)
}
