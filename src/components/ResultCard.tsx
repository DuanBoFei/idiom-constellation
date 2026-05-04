import { useEffect } from 'react'
import type { IdiomQuestion, Question } from '../types'

interface ResultCardProps {
  question: Question
  onContinue: () => void
}

export default function ResultCard({ question, onContinue }: ResultCardProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onContinue()
      }
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
        background: 'rgba(0,0,0,0.6)',
      }}>
        <div style={{
          maxWidth: 320, width: '90%', padding: 24,
          background: 'linear-gradient(135deg, #1a1e3e, #0a0e2a)',
          borderRadius: 16, border: '1px solid rgba(240, 230, 160, 0.2)',
          textAlign: 'center',
        }}>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 28, color: 'var(--color-gold)', marginBottom: 8 }}>
            闯关完成！
          </h2>
          <button
            onClick={onContinue}
            style={{
              display: 'block', width: '100%', padding: '10px 0',
              background: 'linear-gradient(135deg, var(--color-gold), #d4a017)',
              border: 'none', borderRadius: 8, color: '#0a0e2a',
              fontSize: 16, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'var(--font-title)',
            }}
          >
            继续
          </button>
        </div>
      </div>
    )
  }

  const q = question as IdiomQuestion

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)',
    }} onClick={onContinue}>
      <div style={{
        maxWidth: 320, width: '90%', padding: 24,
        background: 'linear-gradient(135deg, #1a1e3e, #0a0e2a)',
        borderRadius: 16, border: '1px solid rgba(240, 230, 160, 0.2)',
      }} onClick={(e) => e.stopPropagation()}>

        <div style={{
          fontSize: 40, fontFamily: 'var(--font-title)', color: 'var(--color-gold)',
          letterSpacing: 8, textAlign: 'center', marginBottom: 8,
        }}>
          {q.idiom.split('').join(' ')}
        </div>

        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: 12 }}>
          {q.pinyin}
        </p>

        <p style={{ fontSize: 15, color: 'var(--color-text-primary)', lineHeight: 1.6, marginBottom: 8 }}>
          {q.meaning}
        </p>

        {q.story && (
          <p style={{
            fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5,
            fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: 8, marginBottom: 12,
          }}>
            {q.story}
          </p>
        )}

        <button
          onClick={onContinue}
          style={{
            display: 'block', width: '100%', padding: '10px 0',
            background: 'linear-gradient(135deg, var(--color-gold), #d4a017)',
            border: 'none', borderRadius: 8, color: '#0a0e2a',
            fontSize: 16, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'var(--font-title)',
          }}
        >
          继续 →
        </button>
      </div>
    </div>
  )
}
