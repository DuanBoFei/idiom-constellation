import { useGame } from '../hooks/useGameReducer'
import { LEVELS } from '../constants/levels'
import { calculateStarRating } from '../utils/progress'
import { calculateScore } from '../utils/scoring'
import { saveScore, getLeaderboard, saveEndlessScore, getEndlessLeaderboard } from '../utils/leaderboard'
import { audioEngine } from '../audio/AudioEngine'
import type { LeaderboardEntry } from '../types'
import { useEffect, useState } from 'react'

interface GameEndScreenProps {
  onPlayAgain: () => void
  onBackToLevels: () => void
  isEndless?: boolean
}

const rankColors = ['#D4A04C', '#C0C0C0', '#CD7F32']
const rankLabels = ['金', '银', '铜']

export default function GameEndScreen({ onPlayAgain, onBackToLevels, isEndless = false }: GameEndScreenProps) {
  const { state } = useGame()
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  const levelConfig = LEVELS.find(l => l.id === state.currentLevelId)
  const stars = calculateStarRating(state.correctCount, state.questions.length)

  useEffect(() => {
    audioEngine.playFanfare()
    if (state.isEndlessMode) {
      setLeaderboard(getEndlessLeaderboard())
    } else {
      setLeaderboard(getLeaderboard())
    }
  }, [state.isEndlessMode])

  const score = calculateScore(state.correctCount, state.timeRemaining, state.questions.length)
  const avgTime =
    state.timesPerQuestion.length > 0
      ? Math.round(state.timesPerQuestion.reduce((a, b) => a + b, 0) / state.timesPerQuestion.length)
      : 0

  const handleSave = () => {
    if (saved) return
    if (state.isEndlessMode) {
      saveEndlessScore({ name: name.trim() || '匿名玩家', score, correctCount: state.correctCount })
    } else {
      saveScore({ name: name.trim() || '匿名玩家', score, correctCount: state.correctCount })
    }
    setSaved(true)
    if (state.isEndlessMode) {
      setLeaderboard(getEndlessLeaderboard())
    } else {
      setLeaderboard(getLeaderboard())
    }
  }

  // Determine current player rank
  const myIdx = leaderboard.findIndex((e) => e.score === score && e.correctCount === state.correctCount)

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 10,
      overflow: 'hidden', fontFamily: "'LXGW WenKai','KaiTi',serif",
    }}>
      {/* Overlay tint */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,14,28,0.45)' }} />

      {/* Layout */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex',
        padding: '52px 72px',
        gap: 64,
        alignItems: 'stretch',
      }}>
        {/* ── Left: Score panel ── */}
        <div style={{
          flex: '0 0 480px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 0,
        }}>
          {/* Title */}
          <div style={{
            fontSize: 13, letterSpacing: 8, color: '#8A8070', marginBottom: 20,
            fontFamily: "'Noto Serif SC',serif",
          }}>
            — 星图捷报 —
          </div>

          {isEndless ? (
            <>
              <div style={{
                fontSize: 52, letterSpacing: 12,
                background: 'linear-gradient(180deg, #E8C97A 0%, #D4A04C 50%, #B8842A 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                marginBottom: 4,
                filter: 'drop-shadow(0 0 16px rgba(212,160,76,0.4))',
              }}>
                无尽挑战
              </div>
              <div style={{
                fontSize: 60, fontWeight: 700, lineHeight: 1,
                color: '#D4A04C', fontVariantNumeric: 'tabular-nums',
                marginBottom: 32,
                fontFamily: "'Noto Serif SC', 'SimSun', serif",
                textShadow: '0 0 40px rgba(212,160,76,0.5)',
              }}>
                {score}
              </div>
            </>
          ) : (
            <>
              <div style={{
                fontSize: 52, letterSpacing: 12,
                background: 'linear-gradient(180deg, #E8C97A 0%, #D4A04C 50%, #B8842A 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                marginBottom: 4,
                filter: 'drop-shadow(0 0 16px rgba(212,160,76,0.4))',
              }}>
                通关成功
              </div>
              <div style={{
                fontSize: 16, color: '#8A8070', letterSpacing: 5,
                fontFamily: "'Noto Serif SC',serif", marginBottom: 4,
              }}>
                {levelConfig?.name ?? `第${state.currentLevelId}关`} · {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
              </div>
              <div style={{
                fontSize: 12, color: '#8A8070', letterSpacing: 3,
                fontFamily: "'Noto Serif SC',serif", marginBottom: 32,
              }}>
                通关
              </div>
            </>
          )}

          {/* Decorative */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0 32px' }}>
            <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, #8A6428)' }} />
            <svg width={20} height={20}>
              <polygon points="10,0 12,7 20,7 14,12 16,20 10,15 4,20 6,12 0,7 8,7" fill="none" stroke="#D4A04C" strokeWidth={1} />
            </svg>
            <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, #8A6428, transparent)' }} />
          </div>

          {/* Score display for non-endless */}
          {!isEndless && (
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <div style={{ fontSize: 12, color: '#8A8070', letterSpacing: 5, fontFamily: "'Noto Serif SC',serif", marginBottom: 8 }}>
                总 得 分
              </div>
              <div style={{
                fontSize: 100, fontWeight: 700, lineHeight: 1,
                color: '#D4A04C', fontVariantNumeric: 'tabular-nums',
                fontFamily: "'Noto Serif SC', 'SimSun', serif",
                textShadow: '0 0 40px rgba(212,160,76,0.5)',
              }}>
                {score}
              </div>
            </div>
          )}

          {/* Stats grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            gap: '0 40px', marginBottom: 32, width: '100%',
          }}>
            {[
              { label: '答对题数', val: `${state.correctCount}/${state.questions.length}` },
              { label: '最高连击', val: `×${Math.max(state.streak, 0)}` },
              { label: '平均反应', val: `${avgTime}s` },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 28,
                  color: '#E8E4D9',
                  fontFamily: "'Noto Serif SC', serif",
                  fontVariantNumeric: 'tabular-nums',
                  marginBottom: 4,
                }}>
                  {s.val}
                </div>
                <div style={{ fontSize: 11, color: '#8A8070', letterSpacing: 3, fontFamily: "'Noto Serif SC',serif" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Name input */}
          <div style={{ marginBottom: 20, width: '100%', maxWidth: 300 }}>
            <input
              placeholder="输入昵称（可选）"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 8))}
              style={{
                width: '100%', padding: '8px 16px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(212,160,76,0.2)',
                borderRadius: 2, fontSize: 14,
                color: '#E8E4D9',
                fontFamily: "'Noto Serif SC',serif",
                outline: 'none',
                textAlign: 'center',
                letterSpacing: 2,
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 300 }}>
            {!saved ? (
              <div
                onClick={handleSave}
                style={{
                  padding: '16px 0', textAlign: 'center',
                  background: 'linear-gradient(135deg, #D4A04C 0%, #B8842A 100%)',
                  borderRadius: 2,
                  fontSize: 18, letterSpacing: 6, color: '#1A0E04',
                  cursor: 'pointer',
                  boxShadow: '0 6px 24px rgba(212,160,76,0.4)',
                }}
              >
                保存成绩
              </div>
            ) : (
              <div style={{
                padding: '16px 0', textAlign: 'center',
                borderRadius: 2,
                fontSize: 18, letterSpacing: 6, color: '#8A8070',
                border: '1px solid rgba(212,160,76,0.2)',
              }}>
                已保存
              </div>
            )}
            <div style={{ display: 'flex', gap: 12 }}>
              <div
                onClick={onPlayAgain}
                style={{
                  flex: 1, padding: '12px 0', textAlign: 'center',
                  border: '1px solid rgba(212,160,76,0.3)',
                  borderRadius: 2, fontSize: 14, color: '#D4A04C', letterSpacing: 3, cursor: 'pointer',
                }}
              >
                再来一局
              </div>
              <div
                onClick={onBackToLevels}
                style={{
                  flex: 1, padding: '12px 0', textAlign: 'center',
                  border: '1px solid rgba(212,160,76,0.3)',
                  borderRadius: 2, fontSize: 14, color: '#D4A04C', letterSpacing: 3, cursor: 'pointer',
                }}
              >
                返回关卡选择
              </div>
              <div style={{
                flex: 1, padding: '12px 0', textAlign: 'center',
                border: '1px solid rgba(212,160,76,0.3)',
                borderRadius: 2, fontSize: 14, color: '#8A8070', letterSpacing: 3, cursor: 'pointer',
              }}>
                分 享
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          width: 1,
          background: 'linear-gradient(180deg, transparent, rgba(212,160,76,0.25) 20%, rgba(212,160,76,0.25) 80%, transparent)',
          alignSelf: 'stretch',
        }} />

        {/* ── Right: Leaderboard ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, letterSpacing: 6, color: '#8A8070', fontFamily: "'Noto Serif SC',serif", marginBottom: 6 }}>
              今日榜单
            </div>
            <div style={{
              fontSize: 28, letterSpacing: 8, color: '#D4A04C',
              background: 'linear-gradient(90deg, #D4A04C, #E8C97A)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Top 10 · 星辰榜
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '12px 0 20px' }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(212,160,76,0.5), transparent)' }} />
          </div>

          {leaderboard.length === 0 ? (
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#8A8070', fontSize: 16,
              fontFamily: "'Noto Serif SC',serif",
            }}>
              还没有记录
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto' }}>
              {leaderboard.slice(0, 10).map((p, i) => {
                const isMe = myIdx === i
                return (
                  <div key={p.timestamp} style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '14px 20px',
                    borderRadius: 2,
                    border: isMe ? '1.5px solid #C8423A' : i < 3 ? '1px solid rgba(212,160,76,0.2)' : '1px solid transparent',
                    background: isMe ? 'rgba(200,66,58,0.06)' : i < 3 ? 'rgba(212,160,76,0.05)' : 'rgba(255,255,255,0.02)',
                    boxShadow: isMe ? 'inset 0 0 20px rgba(200,66,58,0.04)' : 'none',
                  }}>
                    {/* Rank */}
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: i < 3 ? rankColors[i] : 'rgba(255,255,255,0.06)',
                      color: i < 3 ? '#0A0E20' : '#8A8070',
                      fontSize: i < 3 ? 13 : 14,
                      fontWeight: 700,
                      fontFamily: "'Noto Serif SC',serif",
                    }}>
                      {i < 3 ? rankLabels[i] : i + 1}
                    </div>

                    {/* Avatar */}
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      border: isMe ? '1.5px solid #C8423A' : '1px solid rgba(212,160,76,0.3)',
                      background: 'rgba(212,160,76,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, color: isMe ? '#C8423A' : '#D4A04C',
                    }}>
                      {p.name.charAt(0)}
                    </div>

                    {/* Name */}
                    <div style={{
                      flex: 1, fontSize: 16,
                      color: isMe ? '#E8E4D9' : '#E8E4D9',
                      letterSpacing: 2,
                    }}>
                      {p.name}
                      {isMe && (
                        <span style={{
                          marginLeft: 10, fontSize: 11, color: '#C8423A',
                          border: '1px solid #C8423A', padding: '1px 6px', borderRadius: 2,
                          letterSpacing: 2, fontFamily: "'Noto Serif SC',serif",
                        }}>
                          我
                        </span>
                      )}
                    </div>

                    {/* Correct */}
                    <div style={{
                      fontSize: 13, color: '#8A8070',
                      fontVariantNumeric: 'tabular-nums', minWidth: 36, textAlign: 'right',
                    }}>
                      {p.correctCount}/{state.questions.length}
                    </div>

                    {/* Score */}
                    <div style={{
                      fontSize: 22,
                      color: i === 0 ? '#D4A04C' : isMe ? '#E8E4D9' : '#E8E4D9',
                      fontVariantNumeric: 'tabular-nums',
                      fontFamily: "'Noto Serif SC',serif",
                      minWidth: 60, textAlign: 'right',
                      fontWeight: i < 3 || isMe ? 700 : 400,
                    }}>
                      {p.score.toLocaleString()}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
