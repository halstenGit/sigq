interface KPICardProps {
  label: string
  value: string | number
  unit?: string
  delta?: string
  deltaTone?: 'up' | 'dn' | 'flat'
  meta?: string
  bar?: number
  icon?: string
}

export function KPICard({ label, value, unit, delta, deltaTone = 'flat', meta, bar, icon }: KPICardProps) {
  return (
    <div className="kpi">
      <div className="k-name">
        {icon && <span style={{ marginRight: 6 }}>{icon}</span>}
        {label}
      </div>
      <div className="k-val">
        {value}
        {unit && <span className="k-unit">{unit}</span>}
      </div>
      {(delta || meta) && (
        <div className="k-meta">
          {delta && <span className={`delta ${deltaTone}`}>{delta}</span>}
          {meta && <span>{meta}</span>}
        </div>
      )}
      {typeof bar === 'number' && (
        <div className="bar"><i style={{ width: `${Math.max(0, Math.min(100, bar))}%` }} /></div>
      )}
    </div>
  )
}
