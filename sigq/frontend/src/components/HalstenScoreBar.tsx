interface HalstenScoreBarProps {
  score: number
  max?: number
  label?: string
  color?: 'ok' | 'warn' | 'bad'
}

export function HalstenScoreBar({ score, max = 100, label, color }: HalstenScoreBarProps) {
  const percentage = (score / max) * 100

  const getColor = () => {
    if (color) {
      if (color === 'ok') return 'var(--ok)'
      if (color === 'warn') return 'var(--warn)'
      if (color === 'bad') return 'var(--bad)'
    }
    if (percentage >= 70) return 'var(--ok)'
    if (percentage >= 40) return 'var(--warn)'
    return 'var(--bad)'
  }

  return (
    <div>
      {label && (
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted-1)', marginBottom: 'var(--sp-2)' }}>
          {label}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
        <div style={{ flex: 1, height: 6, background: 'var(--bg-2)', borderRadius: 3, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${percentage}%`,
              background: getColor(),
              borderRadius: 3,
              transition: 'width 600ms ease',
            }}
          />
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', minWidth: 40, textAlign: 'right' }}>
          {Math.round(percentage)}%
        </div>
      </div>
    </div>
  )
}
