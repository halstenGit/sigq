import { KPICard } from '../components/KPICard'
import { BarChart } from '../components/BarChart'
import { HalstenCard } from '../components/HalstenCard'
import { HalstenBadge } from '../components/HalstenBadge'
import { HalstenTable, HalstenTableRow, HalstenTableCell } from '../components/HalstenTable'
import { EMPREENDIMENTOS, RNC_LIST } from '../data/mockData'

export function Dashboard() {
  const kpis = [
    { label: 'FVS este mês', value: 38, delta: '+12%', icon: '📋', color: 'var(--ok)' },
    { label: 'Conformidades', value: '86%', delta: '+2pp', icon: '✅', color: 'var(--ok)' },
    { label: 'RNCs abertas', value: 4, delta: '-3', icon: '⚠️', color: 'var(--warn)' },
    { label: 'RNCs críticas', value: 2, delta: '=', icon: '🚨', color: 'var(--bad)' },
  ]

  const chartData = [
    { mes: 'Jan', fvs: 22, nc: 4 },
    { mes: 'Fev', fvs: 28, nc: 6 },
    { mes: 'Mar', fvs: 31, nc: 3 },
    { mes: 'Abr', fvs: 38, nc: 5 },
    { mes: 'Mai', fvs: 0, nc: 0 },
  ]

  const getGravityBadgeVariant = (gravidade: string) => {
    if (gravidade === 'Crítica') return 'error'
    if (gravidade === 'Alta') return 'warning'
    return 'default'
  }

  const getStatusBadgeVariant = (status: string) => {
    if (status === 'Resolvida') return 'success'
    if (status === 'Em progresso') return 'warning'
    return 'error'
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: 'var(--sp-8)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-8)' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 'var(--sp-1) 0 0 0' }}>
          Visão geral · Abril 2026
        </p>
      </div>

      {/* KPIs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--sp-4)', marginBottom: 'var(--sp-8)' }}>
        {kpis.map(k => (
          <KPICard
            key={k.label}
            label={k.label}
            value={k.value}
            delta={k.delta}
            icon={k.icon}
            color={k.color}
          />
        ))}
      </div>

      {/* Chart + Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--sp-6)', marginBottom: 'var(--sp-8)' }}>
        {/* Bar Chart */}
        <BarChart data={chartData} title="FVS realizadas por mês" />

        {/* Empreendimentos */}
        <HalstenCard title="Empreendimentos ativos">
          {EMPREENDIMENTOS.map(e => (
            <div key={e.id} style={{ marginBottom: 'var(--sp-4)', paddingBottom: 'var(--sp-4)', borderBottom: '1px solid var(--bg-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-1)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{e.nome}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{e.progresso}%</div>
              </div>
              <div style={{ height: 6, background: 'var(--bg-2)', borderRadius: 99 }}>
                <div
                  style={{
                    height: '100%',
                    width: `${e.progresso}%`,
                    background: 'var(--ink)',
                    borderRadius: 99,
                    transition: 'width 600ms cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </div>
            </div>
          ))}
        </HalstenCard>
      </div>

      {/* Recent RNCs */}
      <HalstenCard title="RNCs recentes">
        <HalstenTable headers={['ID', 'Empreendimento', 'Serviço', 'Gravidade', 'Status', 'Prazo']}>
          {RNC_LIST.slice(0, 4).map(r => (
            <HalstenTableRow key={r.id}>
              <HalstenTableCell variant="header">{r.id}</HalstenTableCell>
              <HalstenTableCell>{r.empreendimento}</HalstenTableCell>
              <HalstenTableCell>{r.servico}</HalstenTableCell>
              <HalstenTableCell>
                <HalstenBadge variant={getGravityBadgeVariant(r.gravidade)}>{r.gravidade}</HalstenBadge>
              </HalstenTableCell>
              <HalstenTableCell>
                <HalstenBadge variant={getStatusBadgeVariant(r.status)}>{r.status}</HalstenBadge>
              </HalstenTableCell>
              <HalstenTableCell>{r.prazo}</HalstenTableCell>
            </HalstenTableRow>
          ))}
        </HalstenTable>
      </HalstenCard>
    </div>
  )
}
