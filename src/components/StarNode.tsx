import { useCallback } from 'react'

interface StarNodeProps {
  character: string
  state: 'idle' | 'active' | 'completed' | 'used'
  order?: number
  x: number
  y: number
  disabled: boolean
  onSelect: (char: string) => void
  glowMode?: boolean
}

const C = {
  gold: '#D4A04C', goldLight: '#E8C97A',
}

export default function StarNode({ character, state, order, x, y, disabled, onSelect, glowMode = false }: StarNodeProps) {
  const handleClick = useCallback(() => {
    if (!disabled) onSelect(character)
  }, [disabled, onSelect, character])

  const isActive = state === 'active'
  const isCompleted = state === 'completed'
  const isUsed = state === 'used'
  const sz = isActive ? 72 : isCompleted ? 66 : isUsed ? 50 : 58
  const col = isCompleted ? C.gold : isActive ? C.goldLight : isUsed ? 'rgba(80,70,50,0.35)' : 'rgba(210,200,170,0.5)'

  return (
    <div style={{
      position: 'absolute',
      left: x - sz / 2, top: y - sz / 2,
      width: sz, height: sz,
    }}>
      <div
        onClick={handleClick}
        style={{
          width: sz, height: sz,
          borderRadius: '50%',
          border: `${isActive || isCompleted ? 2 : isUsed ? 1 : 1.5}px solid ${col}`,
          background: isCompleted
            ? 'radial-gradient(circle, rgba(212,160,76,0.35) 0%, rgba(212,160,76,0.08) 60%, transparent 100%)'
            : isActive
              ? 'radial-gradient(circle, rgba(232,201,122,0.28) 0%, rgba(232,201,122,0.06) 60%, transparent 100%)'
              : isUsed
                ? 'radial-gradient(circle, rgba(60,50,30,0.1) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(210,200,160,0.12) 0%, transparent 70%)',
          boxShadow: isUsed
            ? 'none'
            : isCompleted
              ? glowMode
                ? '0 0 35px rgba(212,160,76,0.8), 0 0 70px rgba(232,201,122,0.3)'
                : '0 0 20px rgba(212,160,76,0.55), 0 0 50px rgba(212,160,76,0.18)'
              : isActive
                ? glowMode
                  ? '0 0 40px rgba(232,201,122,0.9), 0 0 80px rgba(232,201,122,0.4)'
                  : '0 0 28px rgba(232,201,122,0.65), 0 0 60px rgba(232,201,122,0.22)'
                : '0 0 8px rgba(210,200,160,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: isActive ? 26 : isCompleted ? 24 : isUsed ? 16 : 20,
          color: col,
          fontFamily: "'LXGW WenKai','KaiTi',serif",
          cursor: disabled || isUsed ? 'default' : 'pointer',
          transition: 'all 0.3s',
          position: 'relative',
          animation: isActive
            ? glowMode ? 'floatUp 0.8s ease-in-out infinite' : 'floatUp 2s ease-in-out infinite'
            : 'none',
        }}
      >
        {character}

        {/* Ripple effects for active star */}
        {isActive && (
          <>
            <div style={{
              position: 'absolute', width: sz + 24, height: sz + 24, borderRadius: '50%',
              border: '1px solid rgba(232,201,122,0.3)',
              transform: 'translate(-50%,-50%)', top: '50%', left: '50%',
              pointerEvents: 'none',
              animation: 'ripple 2s ease-out infinite',
            }} />
            <div style={{
              position: 'absolute', width: sz + 48, height: sz + 48, borderRadius: '50%',
              border: '1px solid rgba(232,201,122,0.15)',
              transform: 'translate(-50%,-50%)', top: '50%', left: '50%',
              pointerEvents: 'none',
              animation: 'ripple 2s ease-out 0.6s infinite',
            }} />
          </>
        )}
      </div>

      {/* Order badge for completed */}
      {isCompleted && order != null && (
        <div style={{
          position: 'absolute', top: -8, right: -8,
          width: 18, height: 18, borderRadius: '50%',
          background: '#C8423A',
          fontSize: 10, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Noto Serif SC',serif",
        }}>
          {order}
        </div>
      )}
    </div>
  )
}
