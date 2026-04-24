import { Card } from './Card'
import { colors } from '../styles/theme'

interface KPICardProps {
  label: string
  value: string | number
  delta?: string
  icon: string
  color?: string
}

export function KPICard({ label, value, delta, icon, color = colors.primary }: KPICardProps) {
  return (
    <Card borderColor={color} padding="20px 20px 16px">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div style={{ fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </div>
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, color: colors.primaryDark }}>{value}</div>
      {delta && <div style={{ fontSize: 12, color, fontWeight: 600, marginTop: 4 }}>{delta} vs mês anterior</div>}
    </Card>
  )
}
