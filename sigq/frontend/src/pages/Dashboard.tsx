import { KPICard } from '../components/KPICard'
import { BarChart } from '../components/BarChart'
import { HalstenCard } from '../components/HalstenCard'
import { HalstenBadge } from '../components/HalstenBadge'
import { EMPREENDIMENTOS, RNC_LIST } from '../data/mockData'

export function Dashboard() {
  const kpis = [
    { label: 'FVS este mês', value: 38, delta: '+12%', icon: '📋', color: '#0A0A0A' },
    { label: 'Conformidades', value: '86%', delta: '+2pp', icon: '✅', color: '#4CAF50' },
    { label: 'RNCs abertas', value: 4, delta: '-3', icon: '⚠️', color: '#FFC107' },
    { label: 'RNCs críticas', value: 2, delta: '=', icon: '🚨', color: '#F44336' },
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
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'var(--hs-space-6)' }}>
      {/* Header */}
      <div className="hs-mb-6">
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hs-text-primary)', margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--hs-text-tertiary)', margin: 'var(--hs-space-1) 0 0 0' }}>
          Visão geral · Abril 2026
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="hs-grid hs-grid-4 hs-mb-6">
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--hs-space-4)', marginBottom: 'var(--hs-space-6)' }}>
        {/* Bar Chart */}
        <BarChart data={chartData} title="FVS realizadas por mês" />

        {/* Empreendimentos */}
        <HalstenCard title="Empreendimentos ativos">
          {EMPREENDIMENTOS.map(e => (
            <div key={e.id} style={{ marginBottom: 'var(--hs-space-4)', paddingBottom: 'var(--hs-space-4)', borderBottom: '1px solid var(--hs-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--hs-space-1)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--hs-text-primary)' }}>{e.nome}</div>
                <div style={{ fontSize: '12px', color: 'var(--hs-text-tertiary)' }}>{e.progresso}%</div>
              </div>
              <div style={{ height: '6px', background: 'var(--hs-border)', borderRadius: '99px' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${e.progresso}%`,
                    background: 'var(--hs-text-primary)',
                    borderRadius: '99px',
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
        <div style={{ overflowX: 'auto' }}>
          <table className="hs-tbl">
            <thead>
              <tr>
                {['ID', 'Empreendimento', 'Serviço', 'Gravidade', 'Status', 'Prazo'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RNC_LIST.slice(0, 4).map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600, color: 'var(--hs-text-primary)' }}>{r.id}</td>
                  <td>{r.empreendimento}</td>
                  <td>{r.servico}</td>
                  <td>
                    <HalstenBadge variant={getGravityBadgeVariant(r.gravidade)}>{r.gravidade}</HalstenBadge>
                  </td>
                  <td>
                    <HalstenBadge variant={getStatusBadgeVariant(r.status)}>{r.status}</HalstenBadge>
                  </td>
                  <td style={{ color: 'var(--hs-text-tertiary)' }}>{r.prazo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </HalstenCard>
    </div>
  )
}
