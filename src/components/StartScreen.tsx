import { useState, useEffect, useCallback } from 'react'
import { LEVELS } from '../constants/levels'
import { loadProgress } from '../utils/progress'
import type { PlayerProgress } from '../types'

interface StartScreenProps {
  onSelectLevel: (levelId: number) => void
}

const C = {
  gold: '#D4A04C', goldLight: '#E8C97A', goldDim: '#8A6428',
  vermilion: '#C8423A', textSec: '#8A8070', moonWhite: '#E8E4D9',
  nightDeep: '#060E1C',
}

const levelColors = ['#D4A04C', '#A0C8E8', '#E8C97A', '#C8423A', '#7A60C0']
const levelOrdinals = ['一', '二', '三', '四', '五']

// Constellation patterns for each level circle (scaled from design mockup)
const constellations = [
  // Level 1 — Orion-like
  { lines: [[15,35,50,20],[50,20,85,30],[50,20,50,60],[50,60,20,75],[50,60,80,72]], dots:[{x:15,y:35},{x:50,y:20},{x:85,y:30},{x:50,y:60},{x:20,y:75},{x:80,y:72}] },
  // Level 2 — Dipper-like
  { lines: [[10,65,30,55],[30,55,55,60],[55,60,75,50],[75,50,90,55],[75,50,72,25],[72,25,65,10]], dots:[{x:10,y:65},{x:30,y:55},{x:55,y:60},{x:75,y:50},{x:90,y:55},{x:72,y:25},{x:65,y:10}] },
  // Level 3 — Crown-like
  { lines: [[50,80,25,50],[25,50,35,20],[35,20,50,10],[50,10,65,20],[65,20,75,50],[75,50,50,80]], dots:[{x:50,y:80},{x:25,y:50},{x:35,y:20},{x:50,y:10},{x:65,y:20},{x:75,y:50}] },
  // Level 4 — Cross-star
  { lines: [[10,30,50,70],[30,10,50,30],[50,30,70,10],[50,30,50,70],[50,70,90,50]], dots:[{x:10,y:30},{x:30,y:10},{x:70,y:10},{x:90,y:50},{x:50,y:70},{x:50,y:30}] },
  // Level 5 — Hexagonal
  { lines: [[50,15,80,30],[80,30,80,65],[80,65,50,80],[50,80,20,65],[20,65,20,30],[20,30,50,15]], dots:[{x:50,y:15},{x:80,y:30},{x:80,y:65},{x:50,y:80},{x:20,y:65},{x:20,y:30}] },
]

export default function StartScreen({ onSelectLevel }: StartScreenProps) {
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
      {/* Corner ornaments */}
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

      {/* Central glow halo */}
      <div style={{
        position:'absolute', left:'50%', top:'36%',
        width:420, height:240,
        transform:'translate(-50%,-50%)',
        background:'radial-gradient(ellipse, rgba(212,160,76,0.08) 0%, transparent 70%)',
        pointerEvents:'none',
      }} />

      {/* Title block */}
      <div style={{position:'absolute',left:'50%',top:'28%',transform:'translate(-50%,-50%)',textAlign:'center'}}>
        <div style={{
          fontSize: 106, letterSpacing: 28, lineHeight: 1,
          background: 'linear-gradient(180deg, #E8C97A 0%, #D4A04C 40%, #B8842A 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 32px rgba(212,160,76,0.45))',
        }}>
          成语星图
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: 16, letterSpacing: 6, color: C.textSec,
          marginTop: 14, fontFamily: "'Noto Serif SC','SimSun',serif",
        }}>
          连星成语 · 观天识字
        </div>

        {/* Decorative line */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, marginTop:18 }}>
          <div style={{ width:80, height:1, background:`linear-gradient(90deg, transparent, ${C.goldDim})` }} />
          <div style={{ width:6, height:6, background:C.gold, transform:'rotate(45deg)' }} />
          <div style={{ width:80, height:1, background:`linear-gradient(90deg, ${C.goldDim}, transparent)` }} />
        </div>
      </div>

      {/* Level constellation circles */}
      <div style={{
        position: 'absolute', left: '50%', top: '62%',
        transform: 'translate(-50%,-50%)',
        display: 'flex', gap: 48, alignItems: 'center',
      }}>
        {LEVELS.map((level, idx) => {
          const unlocked = progress.unlockedLevels.includes(level.id)
          const stars = progress.levelStars[level.id] || 0
          const color = levelColors[idx]
          const con = constellations[idx]

          return (
            <div
              key={level.id}
              onClick={() => handleLevelClick(level.id)}
              style={{
                width: 160, height: 160, borderRadius: '50%', position: 'relative',
                border: unlocked
                  ? `1.5px solid rgba(212,160,76,0.3)`
                  : '1.5px solid rgba(100,90,80,0.2)',
                background: unlocked
                  ? 'radial-gradient(circle at 40% 40%, rgba(212,160,76,0.06) 0%, rgba(10,22,40,0.8) 100%)'
                  : 'radial-gradient(circle at 40% 40%, rgba(50,40,30,0.06) 0%, rgba(10,14,20,0.8) 100%)',
                boxShadow: unlocked
                  ? '0 0 28px rgba(212,160,76,0.1), inset 0 0 20px rgba(212,160,76,0.04)'
                  : 'none',
                cursor: unlocked ? 'pointer' : 'default',
                opacity: unlocked ? 1 : 0.4,
                transition: 'all 0.3s',
                overflow: 'hidden',
              }}
            >
              {/* Constellation SVG pattern */}
              <svg width={160} height={160} style={{ position:'absolute', top:0, left:0 }}>
                {con.lines.map((l, li) => (
                  <line key={li}
                    x1={l[0]*1.6} y1={l[1]*1.6} x2={l[2]*1.6} y2={l[3]*1.6}
                    stroke={unlocked ? color : C.textSec}
                    strokeWidth={0.8} strokeOpacity={0.5}
                  />
                ))}
                {con.dots.map((d, di) => (
                  <g key={di}>
                    <circle cx={d.x*1.6} cy={d.y*1.6} r={3.5} fill={unlocked ? color : C.textSec} fillOpacity={0.9} />
                    <circle cx={d.x*1.6} cy={d.y*1.6} r={6} fill={unlocked ? color : C.textSec} fillOpacity={0.15} />
                  </g>
                ))}
                {/* Progress ring */}
                <circle cx={80} cy={80} r={72} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1.5}/>
                {unlocked && stars > 0 && (
                  <circle cx={80} cy={80} r={72} fill="none" stroke={color} strokeWidth={1.5}
                    strokeDasharray={`${stars/3 * 452} 452`} strokeLinecap="round" opacity={0.4}
                    transform="rotate(-90 80 80)"/>
                )}
              </svg>

              {/* Level label */}
              <div style={{
                position:'absolute', bottom:18, left:0, right:0, textAlign:'center',
                fontSize:15, letterSpacing:4, color: unlocked ? color : C.textSec,
                textShadow: unlocked ? `0 0 12px ${color}88` : 'none',
              }}>
                第{levelOrdinals[idx]}关·{level.name}
              </div>

              {/* Lock icon */}
              {!unlocked && (
                <div style={{
                  position:'absolute', top:'50%', left:'50%',
                  transform:'translate(-50%,-50%)',
                  fontSize:28, color:C.textSec, opacity:0.6,
                }}>
                  🔒
                </div>
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}
