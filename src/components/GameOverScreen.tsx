import { useState, useEffect } from 'react'
import { useGame } from '../hooks/useGameReducer'
import { calculateScore } from '../utils/scoring'
import { saveScore } from '../utils/leaderboard'
import { audioEngine } from '../audio/AudioEngine'

interface GameOverScreenProps {
  onPlayAgain: () => void
  onLeaderboard: () => void
}

export default function GameOverScreen({ onPlayAgain, onLeaderboard }: GameOverScreenProps) {
  const { state } = useGame()
  const [name, setName] = useState('')

  useEffect(() => {
    audioEngine.playFanfare()
  }, [])

  const score = calculateScore(state.correctCount, state.timeRemaining, state.questions.length)
  const avgTime =
    state.timesPerQuestion.length > 0
      ? Math.round(state.timesPerQuestion.reduce((a, b) => a + b, 0) / state.timesPerQuestion.length)
      : 0

  const handleSave = () => {
    saveScore({ name: name.trim() || '匿名玩家', score, correctCount: state.correctCount })
    onLeaderboard()
  }

  return (
    <div style={{
      position: 'relative', zIndex: 10,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '100%', padding: 24, gap: 20,
    }}>
      <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 32, color: 'var(--color-gold)', letterSpacing: 4 }}>
        结算
      </h2>

      <div style={{
        display: 'flex', flexDirection: 'column', gap: 12,
        alignItems: 'center', width: '100%', maxWidth: 280,
        padding: 24, background: 'rgba(255,255,255,0.05)',
        borderRadius: 16, border: '1px solid rgba(240,230,160,0.15)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>最终得分</p>
          <p style={{ fontSize: 48, fontWeight: 700, color: 'var(--color-gold)', fontVariantNumeric: 'tabular-nums' }}>
            {score}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>答对</p>
            <p style={{ fontSize: 24, color: 'var(--color-star-bright)' }}>{state.correctCount}/{state.questions.length}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>平均用时</p>
            <p style={{ fontSize: 24, color: 'var(--color-star-bright)' }}>{avgTime}s</p>
          </div>
        </div>
      </div>

      <input
        placeholder="输入昵称（可选）"
        value={name}
        onChange={(e) => setName(e.target.value.slice(0, 8))}
        style={{
          padding: '8px 12px', borderRadius: 8,
          border: '1px solid rgba(240,230,160,0.3)',
          background: 'rgba(255,255,255,0.05)',
          color: 'var(--color-text-primary)', fontSize: 14,
          fontFamily: 'var(--font-body)', outline: 'none', width: 180,
        }}
      />

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={onPlayAgain} style={{
          padding: '12px 32px', fontSize: 16, fontFamily: 'var(--font-title)',
          background: 'linear-gradient(135deg, var(--color-gold), #d4a017)',
          border: 'none', borderRadius: 10, color: '#0a0e2a', cursor: 'pointer', letterSpacing: 2,
        }}>
          再来一局
        </button>
        <button onClick={handleSave} style={{
          padding: '12px 24px', fontSize: 14,
          background: 'transparent', border: '1px solid rgba(240, 230, 160, 0.3)',
          borderRadius: 10, color: 'var(--color-gold)', cursor: 'pointer', fontFamily: 'var(--font-body)',
        }}>
          保存并查看排行
        </button>
      </div>
    </div>
  )
}
