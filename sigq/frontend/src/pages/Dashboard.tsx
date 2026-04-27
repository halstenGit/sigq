import { HalstenCard } from '../components/HalstenCard'
import { HalstenTable, HalstenTableRow, HalstenTableCell } from '../components/HalstenTable'
import { EMPREENDIMENTOS, RNC_LIST } from '../data/mockData'

export function Dashboard() {
  const kpis = [
    { label: 'FVS este mês', value: 38, delta: '+12%' },
    { label: 'Conformidades', value: '86%', delta: '+2pp' },
    { label: 'RNCs abertas', value: 4, delta: '-3' },
    { label: 'RNCs críticas', value: 2, delta: '=' },
  ]

  const chartData = [
    { mes: 'Jan', fvs: 22, nc: 4 },
    { mes: 'Fev', fvs: 28, nc: 6 },
    { mes: 'Mar', fvs: 31, nc: 3 },
    { mes: 'Abr', fvs: 38, nc: 5 },
  ]

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: 'var(--sp-8)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-8)' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 'var(--sp-1) 0 0 0' }}>Visão geral · Abril 2026</p>
      </div>

      {/* KPIs - Simple Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--sp-4)', marginBottom: 'var(--sp-8)' }}>
        {kpis.map(k => (
          <div key={k.label} style={{ padding: 'var(--sp-6)', background: 'var(--bg-1)', border: '1px solid var(--bg-2)' }}>
            <div style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 'var(--sp-2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {k.label}
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--ink)', marginBottom: 'var(--sp-2)' }}>
              {k.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Chart + Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--sp-6)', marginBottom: 'var(--sp-8)' }}>
        {/* Simple Chart */}
        <HalstenCard>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-6)' }}>
            FVS realizadas por mês
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--sp-3)', height: 120 }}>
            {chartData.map(d => (
              <div key={d.mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-2)' }}>
                <div style={{ fontSize: 11, color: 'var(--ink)', fontWeight: 600 }}>{d.fvs || ''}</div>
                <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', height: 90 }}>
                  <div style={{ flex: 1, background: d.fvs ? 'var(--ink)' : 'var(--bg-2)', height: `${(d.fvs / 38) * 90}px` }} />
                  <div style={{ flex: 1, background: d.nc ? 'var(--ink-2)' : 'var(--bg-2)', height: `${(d.nc / 6) * 90}px`, opacity: 0.6 }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-2)' }}>{d.mes}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-4)', marginTop: 'var(--sp-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', fontSize: 11, color: 'var(--ink-2)' }}>
              <div style={{ width: 8, height: 8, background: 'var(--ink)' }} />
              FVS realizadas
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', fontSize: 11, color: 'var(--ink-2)' }}>
              <div style={{ width: 8, height: 8, background: 'var(--ink-2)', opacity: 0.6 }} />
              Com NCs
            </div>
          </div>
        </HalstenCard>

        {/* Empreendimentos */}
        <HalstenCard>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-4)' }}>
            Empreendimentos ativos
          </div>
          {EMPREENDIMENTOS.map(e => (
            <div key={e.id} style={{ marginBottom: 'var(--sp-4)', paddingBottom: 'var(--sp-4)', borderBottom: '1px solid var(--bg-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-1)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{e.nome}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{e.progresso}%</div>
              </div>
              <div style={{ height: 6, background: 'var(--bg-2)' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${e.progresso}%`,
                    background: 'var(--ink)',
                    borderRadius: 99,
                    transition: 'width 0.3s',
                  }}
                />
              </div>
            </div>
          ))}
        </HalstenCard>
      </div>

      {/* RNCs Table */}
      <HalstenCard>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-4)' }}>
          RNCs recentes
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid var(--bg-2)` }}>
              <th style={{ textAlign: 'left', padding: 'var(--sp-3)', fontSize: 11, fontWeight: 600, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ID</th>
              <th style={{ textAlign: 'left', padding: 'var(--sp-3)', fontSize: 11, fontWeight: 600, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Empreendimento</th>
              <th style={{ textAlign: 'left', padding: 'var(--sp-3)', fontSize: 11, fontWeight: 600, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Serviço</th>
              <th style={{ textAlign: 'left', padding: 'var(--sp-3)', fontSize: 11, fontWeight: 600, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Gravidade</th>
              <th style={{ textAlign: 'left', padding: 'var(--sp-3)', fontSize: 11, fontWeight: 600, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
              <th style={{ textAlign: 'left', padding: 'var(--sp-3)', fontSize: 11, fontWeight: 600, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Prazo</th>
            </tr>
          </thead>
          <tbody>
            {RNC_LIST.slice(0, 5).map(rnc => (
              <tr key={rnc.id} style={{ borderBottom: `1px solid var(--bg-2)`, hover: { background: 'var(--bg-1)' } }}>
                <td style={{ padding: 'var(--sp-3)', fontSize: 12, color: 'var(--ink)', fontWeight: 600 }}>{rnc.id}</td>
                <td style={{ padding: 'var(--sp-3)', fontSize: 12, color: 'var(--ink)' }}>{rnc.empreendimento}</td>
                <td style={{ padding: 'var(--sp-3)', fontSize: 12, color: 'var(--ink)' }}>{rnc.servico}</td>
                <td style={{ padding: 'var(--sp-3)', fontSize: 12, color: 'var(--ink)' }}>{rnc.gravidade}</td>
                <td style={{ padding: 'var(--sp-3)', fontSize: 12, color: 'var(--ink)' }}>{rnc.status}</td>
                <td style={{ padding: 'var(--sp-3)', fontSize: 12, color: 'var(--ink-2)' }}>{rnc.prazo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </HalstenCard>
    </div>
  )
}
