import { useEffect } from 'react'
import type { Question, IdiomQuestion, SharedCharQuestion } from '../types'

interface IdiomCardProps {
  question: Question
  onContinue: () => void
}

export default function IdiomCard({ question, onContinue }: IdiomCardProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') onContinue()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onContinue])

  // For double-idiom questions — simplified card
  if ('rounds' in question) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(6,14,28,0.55)',
        backdropFilter: 'blur(6px)',
      }}>
        <div style={{
          padding: '40px 48px',
          background: 'linear-gradient(158deg, #F5F0E8 0%, #EDE6D8 40%, #E0D8C8 100%)',
          borderRadius: 4,
          boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,160,76,0.3)',
          textAlign: 'center',
          maxWidth: 400,
        }}>
          <h2 style={{
            fontFamily: "'LXGW WenKai','KaiTi',serif",
            fontSize: 32, color: '#C8423A', letterSpacing: 6, marginBottom: 16,
          }}>
            闯关完成！
          </h2>
          <div
            onClick={onContinue}
            style={{
              display: 'inline-block', padding: '13px 40px',
              background: 'linear-gradient(135deg, #D4A04C, #B8842A)',
              borderRadius: 2,
              fontSize: 16, letterSpacing: 5, color: '#1A0E04',
              cursor: 'pointer',
              fontFamily: "'LXGW WenKai','KaiTi',serif",
              boxShadow: '0 4px 16px rgba(212,160,76,0.35)',
            }}
          >
            继续 →
          </div>
        </div>
      </div>
    )
  }

  // Handle shared-char question: show both idioms side by side
  if ('type' in question && question.type === 'shared-char') {
    const sq = question as SharedCharQuestion
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'LXGW WenKai','KaiTi',serif",
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,14,28,0.55)', backdropFilter: 'blur(6px)' }} />
        <div style={{
          position: 'relative', width: 640,
          background: 'linear-gradient(158deg, #F5F0E8, #EDE6D8, #E0D8C8)',
          borderRadius: 4, padding: '48px 52px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,160,76,0.3)',
        }}>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 24 }}>
            {sq.idioms.map((idiom, idx) => (
              <div key={idx}>
                <div style={{ fontSize: 12, color: '#9A8870', letterSpacing: 3, marginBottom: 8, textAlign: 'center' }}>
                  成语 {idx + 1}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {idiom.split('').map((ch, i) => (
                    <div key={i} style={{
                      width: 72, height: 72, border: '2px solid #C8423A', borderRadius: 2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 38, color: '#C8423A', background: 'rgba(200,66,58,0.05)',
                      fontFamily: "'LXGW WenKai','KaiTi',serif",
                      boxShadow: 'inset 0 0 8px rgba(200,66,58,0.08), 0 2px 6px rgba(0,0,0,0.1)',
                    }}>
                      {ch}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {sq.hints && (
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              {sq.hints.map((h, i) => (
                <div key={i} style={{ fontSize: 13, color: '#8A7860', letterSpacing: 1, marginBottom: 4, fontFamily: "'Noto Serif SC',serif" }}>
                  {h}
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div onClick={onContinue} style={{
              padding: '13px 40px',
              background: 'linear-gradient(135deg, #D4A04C, #B8842A)',
              borderRadius: 2, fontSize: 16, letterSpacing: 5, color: '#1A0E04',
              cursor: 'pointer', fontFamily: "'LXGW WenKai','KaiTi',serif",
              boxShadow: '0 4px 16px rgba(212,160,76,0.35)',
            }}>
              继续 →
            </div>
          </div>
        </div>
      </div>
    )
  }

  const q = question as IdiomQuestion

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'LXGW WenKai','KaiTi',serif",
    }}>
      {/* Blur overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(6,14,28,0.55)',
        backdropFilter: 'blur(6px)',
      }} />

      {/* Gold particles */}
      {Array.from({ length: 28 }).map((_, i) => {
        const px = 180 + ((i * 137 + 80) % 1560)
        const py = 80 + ((i * 97 + 60) % 920)
        const sz = 2 + ((i * 3) % 4)
        return (
          <div key={i} style={{
            position: 'absolute', left: px, top: py,
            width: sz, height: sz, borderRadius: '50%',
            background: i % 3 === 0 ? '#D4A04C' : i % 3 === 1 ? '#E8C97A' : 'rgba(212,160,76,0.4)',
            opacity: 0.3 + ((i * 7) % 5) * 0.1,
            boxShadow: `0 0 ${sz * 3}px #D4A04C`,
            pointerEvents: 'none',
          }} />
        )
      })}

      {/* Card */}
      <div style={{
        position: 'relative',
        width: 640, minHeight: 560,
        background: 'linear-gradient(158deg, #F5F0E8 0%, #EDE6D8 40%, #E0D8C8 100%)',
        borderRadius: 4,
        boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,160,76,0.3)',
        padding: '48px 52px',
      }}>
        {/* Paper texture lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute', left: 0, right: 0,
            top: 60 + i * 44, height: 1,
            background: 'rgba(180,160,120,0.12)',
            pointerEvents: 'none',
          }} />
        ))}

        {/* Red seal top-right */}
        <div style={{
          position: 'absolute', top: 28, right: 36,
          width: 56, height: 56, borderRadius: 2,
          border: '2px solid #C8423A',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column',
          background: 'rgba(200,66,58,0.06)',
        }}>
          <div style={{ fontSize: 10, color: '#C8423A', letterSpacing: 1, lineHeight: 1.4, textAlign: 'center' }}>
            星图<br />文库
          </div>
        </div>

        {/* Idiom stamp boxes */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          {q.idiom.split('').map((ch, i) => (
            <div key={i} style={{
              width: 88, height: 88,
              border: '2px solid #C8423A',
              borderRadius: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 46,
              color: '#C8423A',
              background: 'rgba(200,66,58,0.05)',
              fontFamily: "'LXGW WenKai','KaiTi',serif",
              boxShadow: 'inset 0 0 8px rgba(200,66,58,0.08), 0 2px 6px rgba(0,0,0,0.1)',
              position: 'relative',
            }}>
              {ch}
              <div style={{ position: 'absolute', inset: 3, border: '0.5px solid rgba(200,66,58,0.15)', borderRadius: 1 }} />
            </div>
          ))}
        </div>

        {/* Pinyin */}
        <div style={{
          fontSize: 15, letterSpacing: 8, color: '#8A7860',
          marginBottom: 22, fontFamily: "'Noto Serif SC','SimSun',serif",
        }}>
          {q.pinyin}
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #C4B898)' }} />
          <div style={{ width: 5, height: 5, background: '#C4B898', transform: 'rotate(45deg)' }} />
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #C4B898, transparent)' }} />
        </div>

        {/* Source */}
        {q.story && (
          <div style={{
            fontSize: 13, color: '#8A7860', letterSpacing: 2, marginBottom: 14,
            fontFamily: "'Noto Serif SC','SimSun',serif",
          }}>
            {q.story}
          </div>
        )}

        {/* Meaning */}
        <div style={{
          fontSize: 18, color: '#2A2010', lineHeight: 1.9, marginBottom: 20,
          letterSpacing: 1,
        }}>
          {q.meaning}
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
          {[
            ['近义词', '多此一举'],
            ['反义词', '画龙点睛'],
            ['难度', '★'.repeat(q.difficulty) + '☆'.repeat(3 - q.difficulty)],
          ].map(([label, val], i) => (
            <div key={i} style={{
              padding: '4px 14px',
              border: '1px solid #C4B898',
              borderRadius: 2,
              fontSize: 13, color: '#6A5840',
              fontFamily: "'Noto Serif SC',serif",
            }}>
              <span style={{ color: '#9A8870' }}>{label}：</span>
              {val}
            </div>
          ))}
        </div>

        {/* Continue button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div
            onClick={onContinue}
            style={{
              padding: '13px 40px',
              background: 'linear-gradient(135deg, #D4A04C, #B8842A)',
              borderRadius: 2,
              fontSize: 16, letterSpacing: 5, color: '#1A0E04',
              cursor: 'pointer',
              fontFamily: "'LXGW WenKai','KaiTi',serif",
              boxShadow: '0 4px 16px rgba(212,160,76,0.35)',
            }}
          >
            继续 →
          </div>
        </div>
      </div>
    </div>
  )
}
