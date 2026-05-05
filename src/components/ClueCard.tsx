interface ClueCardProps {
  clue: string
}

export default function ClueCard({ clue }: ClueCardProps) {
  return (
    <div style={{
      position: 'absolute', top: 96, left: '50%', transform: 'translateX(-50%)', zIndex: 20,
      padding: '12px 36px',
      background: 'rgba(10,22,40,0.75)',
      border: '1px solid rgba(212,160,76,0.2)',
      borderRadius: 2,
      backdropFilter: 'blur(8px)',
      fontFamily: "'LXGW WenKai','KaiTi',serif",
    }}>
      <div style={{
        fontSize: 11, color: '#8A8070', letterSpacing: 4,
        textAlign: 'center', marginBottom: 4,
        fontFamily: "'Noto Serif SC',serif",
      }}>
        谜 面
      </div>
      <div style={{
        fontSize: 17, color: '#E8E4D9', letterSpacing: 3,
        textAlign: 'center',
      }}>
        {clue}
      </div>
    </div>
  )
}
