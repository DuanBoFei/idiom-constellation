import { useCallback } from 'react'
import type { StarPosition } from '../types'

interface StarButtonProps {
  star: StarPosition
  isSelected: boolean
  isWrong: boolean
  isCompleted: boolean
  selectionOrder: number
  disabled: boolean
  onSelect: (character: string) => void
  containerWidth: number
  containerHeight: number
}

export default function StarButton({
  star,
  isSelected,
  isWrong,
  isCompleted,
  selectionOrder,
  disabled,
  onSelect,
  containerWidth,
  containerHeight,
}: StarButtonProps) {
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      if (!disabled && !isCompleted) {
        onSelect(star.character)
      }
    },
    [disabled, isCompleted, onSelect, star.character],
  )

  const left = (star.x / 100) * containerWidth
  const top = (star.y / 100) * containerHeight

  return (
    <button
      onPointerDown={handlePointerDown}
      style={{
        position: 'absolute',
        left: left - 32,
        top: top - 32,
        width: 64,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        border: isCompleted
          ? '2px solid var(--color-gold)'
          : isSelected
            ? '2px solid var(--color-gold)'
            : isWrong
              ? '2px solid var(--color-error)'
              : '2px solid rgba(240, 230, 160, 0.4)',
        background: isSelected
          ? 'radial-gradient(circle, rgba(245, 215, 66, 0.4), rgba(245, 215, 66, 0.1))'
          : isCompleted
            ? 'radial-gradient(circle, rgba(245, 215, 66, 0.3), rgba(245, 215, 66, 0.1))'
            : 'radial-gradient(circle, rgba(240, 230, 160, 0.2), transparent)',
        color: isSelected || isCompleted
          ? 'var(--color-gold)'
          : isWrong
            ? 'var(--color-error)'
            : 'var(--color-star-dim)',
        fontSize: 24,
        fontFamily: 'var(--font-title)',
        cursor: disabled || isCompleted ? 'default' : 'pointer',
        transition: 'transform 0.2s, border-color 0.2s, background 0.2s, color 0.2s',
        transform: isSelected ? 'scale(1.3)' : isWrong ? 'scale(1.1)' : 'scale(1)',
        outline: 'none',
        touchAction: 'none',
        zIndex: isSelected ? 5 : 1,
        boxShadow: isSelected
          ? '0 0 12px rgba(245, 215, 66, 0.4)'
          : isCompleted
            ? '0 0 12px rgba(245, 215, 66, 0.5)'
            : 'none',
      }}
      aria-label={`星 ${star.character}`}
    >
      <span style={{ position: 'relative' }}>
        {star.character}
        {isSelected && (
          <span style={{
            position: 'absolute',
            top: -18,
            right: -18,
            fontSize: 10,
            color: 'var(--color-gold)',
            fontWeight: 700,
          }}>
            {selectionOrder}
          </span>
        )}
      </span>
    </button>
  )
}
