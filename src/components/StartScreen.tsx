interface StartScreenProps {
  onStart: () => void
  onLeaderboard: () => void
}

export default function StartScreen({ onStart, onLeaderboard }: StartScreenProps) {
  return (
    <div style={{
      position: 'relative', zIndex: 10,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '100%', gap: 24, padding: 24,
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'var(--font-title)', fontSize: 42,
          color: 'var(--color-gold)', letterSpacing: 6, marginBottom: 8,
          textShadow: '0 0 20px rgba(245, 215, 66, 0.3)',
        }}>
          成语星图
        </h1>
        <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', letterSpacing: 2 }}>
          连星成诗 · 观星解谜
        </p>
      </div>

      <p style={{
        fontSize: 14, color: 'var(--color-text-secondary)',
        maxWidth: 280, textAlign: 'center', lineHeight: 1.6,
      }}>
        在夜空中按顺序连接汉字星，组成成语
      </p>

      <button
        onClick={onStart}
        style={{
          padding: '14px 48px', fontSize: 20, fontFamily: 'var(--font-title)',
          background: 'linear-gradient(135deg, var(--color-gold), #d4a017)',
          border: 'none', borderRadius: 12, color: '#0a0e2a',
          cursor: 'pointer', letterSpacing: 4,
        }}
      >
        开始
      </button>

      <button
        onClick={onLeaderboard}
        style={{
          padding: '10px 24px', fontSize: 14,
          background: 'transparent', border: '1px solid rgba(240, 230, 160, 0.3)',
          borderRadius: 8, color: 'var(--color-text-secondary)',
          cursor: 'pointer', fontFamily: 'var(--font-body)',
        }}
      >
        排行榜
      </button>
    </div>
  )
}
