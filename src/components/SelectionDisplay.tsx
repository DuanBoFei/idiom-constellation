interface SelectionDisplayProps {
  selectedChars: string[]
  totalSlots: number
}

export default function SelectionDisplay({ selectedChars, totalSlots }: SelectionDisplayProps) {
  const slots = Array.from({ length: totalSlots }, (_, i) => selectedChars[i] || '＿')

  return (
    <div style={{
      position: 'absolute', bottom: 48, left: '50%', transform: 'translateX(-50%)', zIndex: 20,
      display: 'flex', gap: 8, alignItems: 'center',
    }}>
      {slots.map((ch, i) => {
        const filled = i < selectedChars.length
        return (
          <div key={i} style={{
            width: 52, height: 52, borderRadius: 2,
            border: filled ? '1.5px solid #D4A04C' : '1px solid rgba(212,160,76,0.25)',
            background: filled ? 'rgba(212,160,76,0.1)' : 'rgba(255,255,255,0.02)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
            color: filled ? '#D4A04C' : '#4A4840',
            fontFamily: "'LXGW WenKai','KaiTi',serif",
            boxShadow: filled ? '0 0 12px rgba(212,160,76,0.25)' : 'none',
            transition: 'all 0.3s',
          }}>
            {ch}
          </div>
        )
      })}
    </div>
  )
}
