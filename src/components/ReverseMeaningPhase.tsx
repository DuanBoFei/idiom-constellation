interface ReverseMeaningPhaseProps {
  fragments: string[]
  correctMeaning: string
  onCorrect: () => void
  onWrong: (wrongFragment: string) => void
}

export default function ReverseMeaningPhase({
  fragments, correctMeaning, onCorrect, onWrong,
}: ReverseMeaningPhaseProps) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 15,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 16, padding: 40,
    }}>
      <div style={{
        fontSize: 14, color: '#8A8070', letterSpacing: 4, marginBottom: 8,
        fontFamily: "'Noto Serif SC',serif",
      }}>
        选中与成语含义匹配的释义
      </div>
      {fragments.map((frag, i) => (
        <div
          key={i}
          data-fragment={frag}
          onClick={() => {
            if (frag === correctMeaning) onCorrect()
            else onWrong(frag)
          }}
          style={{
            width: '100%', maxWidth: 500,
            padding: '16px 24px',
            background: 'rgba(10,22,40,0.75)',
            border: '1px solid rgba(212,160,76,0.2)',
            borderRadius: 2,
            cursor: 'pointer',
            fontSize: 16, color: '#E8E4D9', lineHeight: 1.6,
            letterSpacing: 1,
            fontFamily: "'LXGW WenKai','KaiTi',serif",
            transition: 'all 0.3s',
            textAlign: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(212,160,76,0.5)'
            e.currentTarget.style.background = 'rgba(212,160,76,0.12)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(212,160,76,0.2)'
            e.currentTarget.style.background = 'rgba(10,22,40,0.75)'
          }}
        >
          {frag}
        </div>
      ))}
    </div>
  )
}
