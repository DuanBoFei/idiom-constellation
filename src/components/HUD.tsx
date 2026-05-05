interface HUDProps {
  levelName: string
  levelIndex: number
  timeRemaining: number
  totalTime: number
  score: number
  streak: number
  starGlowMode: boolean
}

export default function HUD({ levelName, levelIndex, timeRemaining, totalTime, score, streak, starGlowMode }: HUDProps) {
  const progress = totalTime > 0 ? timeRemaining / totalTime : 0
  const levelOrdinals = ['一', '二', '三', '四', '五']

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
      padding: '0 40px',
      height: 80,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'linear-gradient(180deg, rgba(6,14,28,0.95) 0%, rgba(6,14,28,0.6) 80%, transparent 100%)',
      fontFamily: "'LXGW WenKai','KaiTi',serif",
    }}>
      {/* Level name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 3, height: 28,
          background: 'linear-gradient(180deg, #D4A04C, transparent)',
        }} />
        <div>
          <div style={{ fontSize: 11, color: '#8A8070', letterSpacing: 4, fontFamily: "'Noto Serif SC',serif" }}>
            第{levelOrdinals[levelIndex]}关
          </div>
          <div style={{ fontSize: 20, color: '#D4A04C', letterSpacing: 4 }}>
            {levelName}
          </div>
        </div>
      </div>

      {/* Timer bar */}
      <div style={{ flex: 1, maxWidth: 600, margin: '0 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: '#8A8070', letterSpacing: 2, fontFamily: "'Noto Serif SC',serif" }}>
            剩余时间
          </span>
          <span style={{ fontSize: 13, color: '#D4A04C', fontVariantNumeric: 'tabular-nums' }}>
            {timeRemaining}s
          </span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            width: `${Math.max(0, progress * 100)}%`, height: '100%', borderRadius: 2,
            background: 'linear-gradient(90deg, #D4A04C, #E8C97A)',
            boxShadow: '0 0 8px rgba(212,160,76,0.6)',
            transition: 'width 1s linear',
          }} />
        </div>
      </div>

      {/* Score */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 11, color: '#8A8070', letterSpacing: 3, fontFamily: "'Noto Serif SC',serif" }}>
          得 分
        </div>
        <div style={{
          fontSize: 28, color: '#D4A04C',
          fontVariantNumeric: 'tabular-nums', lineHeight: 1.1,
        }}>
          {score}
        </div>
      </div>

      {/* Combo badge */}
      {streak >= 2 && (
        <div style={{
          padding: '4px 12px',
          border: `1px solid ${starGlowMode ? '#E8C97A' : 'rgba(212,160,76,0.3)'}`,
          borderRadius: 2,
          background: starGlowMode ? 'rgba(232,201,122,0.1)' : 'transparent',
          fontSize: 12, color: starGlowMode ? '#E8C97A' : '#8A8070',
          letterSpacing: 2,
          fontFamily: "'Noto Serif SC',serif",
          marginLeft: 16,
          whiteSpace: 'nowrap' as const,
        }}>
          {starGlowMode ? '星辉' : `连击 ×${streak}`}
        </div>
      )}
    </div>
  )
}
