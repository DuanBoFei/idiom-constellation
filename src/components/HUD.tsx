interface HUDProps {
  clue: string
  timeRemaining: number
  totalTime: number
  questionNumber: number
  totalQuestions: number
}

export default function HUD({ clue, timeRemaining, totalTime, questionNumber, totalQuestions }: HUDProps) {
  const progress = totalTime > 0 ? timeRemaining / totalTime : 0
  const isLow = progress < 0.25

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      background: 'linear-gradient(180deg, rgba(10,14,42,0.9) 0%, transparent 100%)',
      pointerEvents: 'none',
    }}>
      {/* Timer bar */}
      <div style={{
        width: '100%',
        height: 4,
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${Math.max(0, progress * 100)}%`,
          height: '100%',
          background: isLow
            ? 'linear-gradient(90deg, #e74c3c, #c0392b)'
            : 'linear-gradient(90deg, var(--color-gold), #f0e6a0)',
          borderRadius: 2,
          transition: 'width 1s linear, background 0.3s',
        }} />
      </div>

      {/* Info row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{
          fontSize: 14,
          color: isLow ? '#e74c3c' : 'var(--color-text-secondary)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          第 {questionNumber}/{totalQuestions} 题
        </span>
        <span style={{
          fontSize: 20,
          fontWeight: 700,
          color: isLow ? '#e74c3c' : 'var(--color-gold)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {timeRemaining}s
        </span>
      </div>

      {/* Clue */}
      <div style={{
        textAlign: 'center',
        padding: '8px 16px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        border: '1px solid rgba(240,230,160,0.15)',
      }}>
        <p style={{
          fontSize: 16,
          color: 'var(--color-star-bright)',
          lineHeight: 1.5,
        }}>
          {clue}
        </p>
      </div>
    </div>
  )
}
