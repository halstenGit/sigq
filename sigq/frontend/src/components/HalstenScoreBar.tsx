interface HalstenScoreBarProps {
  score: number
  max?: number
  label?: string
  color?: 'ok' | 'warn' | 'bad'
  showValue?: boolean
}

export function HalstenScoreBar({ score, max = 100, label, color, showValue = true }: HalstenScoreBarProps) {
  const pct = Math.max(0, Math.min(100, (score / max) * 100))
  const tone = color
    ? color
    : pct >= 70 ? 'ok' : pct >= 40 ? 'warn' : 'bad'

  return (
    <div>
      {label && (
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--muted-1)',
          marginBottom: 6,
        }}>
          {label}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className={`score-bar ${tone}`} style={{ flex: 1 }}>
          <i style={{ width: `${pct}%` }} />
        </div>
        {showValue && (
          <div className="mono" style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink)', minWidth: 40, textAlign: 'right' }}>
            {Math.round(pct)}%
          </div>
        )}
      </div>
    </div>
  )
}
