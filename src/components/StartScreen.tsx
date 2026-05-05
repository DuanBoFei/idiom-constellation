import { useState, useEffect, useCallback } from 'react'
import { LEVELS } from '../constants/levels'
import { loadProgress } from '../utils/progress'
import type { PlayerProgress } from '../types'

interface StartScreenProps {
  onSelectLevel: (levelId: number) => void
  onEndless: () => void
}

const C = {
  gold: '#D4A04C', goldLight: '#E8C97A', goldDim: '#8A6428',
  vermilion: '#C8423A', textSec: '#8A8070', moonWhite: '#E8E4D9',
}

export default function StartScreen({ onSelectLevel, onEndless }: StartScreenProps) {
  const [progress, setProgress] = useState<PlayerProgress>({ unlockedLevels: [1], levelStars: {}, levelScores: {}, endlessHighScore: 0, totalScore: 0 })

  useEffect(() => {
    setProgress(loadProgress())
  }, [])

  const handleLevelClick = useCallback((levelId: number) => {
    if (progress.unlockedLevels.includes(levelId)) {
      onSelectLevel(levelId)
    }
  }, [progress.unlockedLevels, onSelectLevel])

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 10,
      overflow: 'hidden', fontFamily: "'LXGW WenKai','KaiTi',serif",
    }}>
      {/* Corner ornaments — same as before */}
      <svg style={{position:'absolute',top:20,left:20}} width={60} height={60}>
        <path d="M0,40 L0,0 L40,0" fill="none" stroke={C.goldDim} strokeWidth={1.2} strokeOpacity={0.5}/>
        <circle cx={0} cy={0} r={3} fill={C.gold} fillOpacity={0.6}/>
      </svg>
      <svg style={{position:'absolute',top:20,right:20}} width={60} height={60}>
        <path d="M60,40 L60,0 L20,0" fill="none" stroke={C.goldDim} strokeWidth={1.2} strokeOpacity={0.5}/>
        <circle cx={60} cy={0} r={3} fill={C.gold} fillOpacity={0.6}/>
      </svg>
      <svg style={{position:'absolute',bottom:20,left:20}} width={60} height={60}>
        <path d="M0,20 L0,60 L40,60" fill="none" stroke={C.goldDim} strokeWidth={1.2} strokeOpacity={0.5}/>
        <circle cx={0} cy={60} r={3} fill={C.gold} fillOpacity={0.6}/>
      </svg>
      <svg style={{position:'absolute',bottom:20,right:20}} width={60} height={60}>
        <path d="M60,20 L60,60 L20,60" fill="none" stroke={C.goldDim} strokeWidth={1.2} strokeOpacity={0.5}/>
        <circle cx={60} cy={60} r={3} fill={C.gold} fillOpacity={0.6}/>
      </svg>

      {/* Title block */}
      <div style={{position:'absolute',left:'50%',top:'22%',transform:'translate(-50%,-50%)',textAlign:'center'}}>
        <div style={{
          fontSize: 80, letterSpacing: 24, lineHeight: 1,
          background: 'linear-gradient(180deg, #E8C97A 0%, #D4A04C 40%, #B8842A 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 32px rgba(212,160,76,0.45))',
        }}>
          成语星图
        </div>
      </div>

      {/* Level buttons grid */}
      <div style={{
        position: 'absolute', left: '50%', top: '55%',
        transform: 'translate(-50%,-50%)',
        display: 'flex', gap: 36, alignItems: 'center',
      }}>
        {LEVELS.map((level, idx) => {
          const unlocked = progress.unlockedLevels.includes(level.id)
          const stars = progress.levelStars[level.id] || 0
          const levelColors = ['#D4A04C', '#A0C8E8', '#E8C97A', '#C8423A', '#7A60C0']
          const color = levelColors[idx]

          return (
            <div
              key={level.id}
              onClick={() => handleLevelClick(level.id)}
              style={{
                width: 140, height: 140, borderRadius: '50%', position: 'relative',
                border: unlocked ? `1.5px solid rgba(212,160,76,0.3)` : '1.5px solid rgba(100,90,80,0.2)',
                background: unlocked
                  ? 'radial-gradient(circle at 40% 40%, rgba(212,160,76,0.06) 0%, rgba(10,22,40,0.8) 100%)'
                  : 'radial-gradient(circle at 40% 40%, rgba(50,40,30,0.06) 0%, rgba(10,14,20,0.8) 100%)',
                cursor: unlocked ? 'pointer' : 'default',
                opacity: unlocked ? 1 : 0.4,
                transition: 'all 0.3s',
              }}
            >
              {/* Center number */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                fontSize: 32, fontWeight: 700, color: unlocked ? color : C.textSec,
                opacity: unlocked ? 0.15 : 0.1,
                fontFamily: "'Noto Serif SC',serif",
              }}>
                {String(level.id).padStart(2, '0')}
              </div>

              {/* Level name */}
              <div style={{
                position: 'absolute', top: 32, left: 0, right: 0, textAlign: 'center',
                fontSize: 18, letterSpacing: 3,
                color: unlocked ? color : C.textSec,
              }}>
                {level.name}
              </div>

              {/* Stars */}
              {unlocked && stars > 0 && (
                <div style={{
                  position: 'absolute', bottom: 32, left: 0, right: 0, textAlign: 'center',
                  fontSize: 12, letterSpacing: 2,
                }}>
                  {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
                </div>
              )}

              {/* Lock icon */}
              {!unlocked && (
                <div style={{
                  position: 'absolute', bottom: 32, left: 0, right: 0, textAlign: 'center',
                  fontSize: 16, color: C.textSec,
                }}>
                  🔒
                </div>
              )}

              {/* Level progress ring */}
              <svg width={140} height={140} style={{position:'absolute',top:0,left:0,transform:'rotate(-90deg)'}}>
                <circle cx={70} cy={70} r={64} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={2}/>
                {unlocked && stars > 0 && (
                  <circle cx={70} cy={70} r={64} fill="none" stroke={color} strokeWidth={2}
                    strokeDasharray={`${stars/3 * 402} 402`} strokeLinecap="round" opacity={0.5}/>
                )}
              </svg>
            </div>
          )
        })}
      </div>

      {/* Endless Mode button */}
      {progress.unlockedLevels.includes(6) && (
        <div
          onClick={onEndless}
          style={{
            position: 'absolute', right: 80, bottom: 56,
            padding: '14px 40px',
            border: '1.5px solid rgba(212,160,76,0.4)',
            borderRadius: 4,
            fontSize: 16, letterSpacing: 5, color: C.gold,
            cursor: 'pointer',
            fontFamily: "'LXGW WenKai','KaiTi',serif",
          }}
        >
          无尽模式
          {progress.endlessHighScore > 0 && (
            <span style={{marginLeft:12,fontSize:12,color:C.textSec}}>
              最高 {progress.endlessHighScore}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
