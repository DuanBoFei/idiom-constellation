import { useState, useEffect } from 'react'
import { getLeaderboard } from '../utils/leaderboard'
import type { LeaderboardEntry } from '../types'

interface LeaderboardScreenProps {
  onBack: () => void
}

export default function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    setEntries(getLeaderboard())
  }, [])

  return (
    <div style={{
      position: 'relative', zIndex: 10,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      height: '100%', padding: '60px 24px 24px', gap: 16,
    }}>
      <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 28, color: 'var(--color-gold)', letterSpacing: 4 }}>
        排行榜
      </h2>
      <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>今日 Top 10</p>

      {entries.length === 0 ? (
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--color-text-secondary)', fontSize: 16,
        }}>
          还没有记录
        </div>
      ) : (
        <div style={{
          width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column',
          gap: 8, flex: 1, overflow: 'auto',
        }}>
          {entries.map((entry, i) => (
            <div key={entry.timestamp} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 16px',
              background: i < 3 ? 'rgba(245, 215, 66, 0.1)' : 'rgba(255,255,255,0.03)',
              borderRadius: 10,
              border: i === 0 ? '1px solid rgba(245, 215, 66, 0.3)' : '1px solid transparent',
            }}>
              <span style={{
                width: 28, height: 28, display: 'flex', alignItems: 'center',
                justifyContent: 'center', borderRadius: '50%',
                background: i === 0 ? 'var(--color-gold)' : i === 1 ? 'rgba(200,200,200,0.3)' : i === 2 ? 'rgba(180,120,60,0.3)' : 'transparent',
                color: i === 0 ? '#0a0e2a' : 'var(--color-text-secondary)',
                fontSize: 14, fontWeight: 700,
              }}>
                {i + 1}
              </span>
              <span style={{ flex: 1, fontSize: 15, color: 'var(--color-text-primary)' }}>
                {entry.name}
              </span>
              <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                {entry.correctCount}/6
              </span>
              <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-gold)', fontVariantNumeric: 'tabular-nums' }}>
                {entry.score}
              </span>
            </div>
          ))}
        </div>
      )}

      <button onClick={onBack} style={{
        padding: '10px 32px', fontSize: 14,
        background: 'transparent', border: '1px solid rgba(240, 230, 160, 0.3)',
        borderRadius: 8, color: 'var(--color-text-secondary)',
        cursor: 'pointer', fontFamily: 'var(--font-body)',
      }}>
        返回
      </button>
    </div>
  )
}
