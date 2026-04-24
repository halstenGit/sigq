import { HalstenCard } from './HalstenCard'

interface KPICardProps {
  label: string
  value: string | number
  delta?: string
  icon: string
  color?: string
}

export function KPICard({ label, value, delta, icon, color }: KPICardProps) {
  return (
    <HalstenCard>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div style={{ fontSize: 11, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </div>
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>{value}</div>
      {delta && <div style={{ fontSize: 12, color: color || 'var(--ink-2)', fontWeight: 600 }}>{delta} vs mês anterior</div>}
    </HalstenCard>
  )
}
