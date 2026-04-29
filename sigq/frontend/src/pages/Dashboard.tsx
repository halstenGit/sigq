import { HalstenCard } from '../components/HalstenCard'
import { KPICard } from '../components/KPICard'
import { EMPREENDIMENTOS, RNC_LIST } from '../data/mockData'

export function Dashboard() {
  const kpis = [
    { label: 'FVS este mês', value: 38, delta: '+12%', deltaTone: 'up' as const, meta: 'vs. mar/26' },
    { label: 'Conformidade', value: '86', unit: '%', delta: '+2pp', deltaTone: 'up' as const, bar: 86 },
    { label: 'RNCs abertas', value: 4, delta: '-3', deltaTone: 'dn' as const, meta: 'desde início abr.' },
    { label: 'RNCs críticas', value: 2, delta: '=', deltaTone: 'flat' as const, meta: 'sem variação' },
  ]

  const chartData = [
    { mes: 'Jan', fvs: 22, nc: 4 },
    { mes: 'Fev', fvs: 28, nc: 6 },
    { mes: 'Mar', fvs: 31, nc: 3 },
    { mes: 'Abr', fvs: 38, nc: 5 },
  ]
  const maxFvs = Math.max(...chartData.map(d => d.fvs))
  const maxNc = Math.max(...chartData.map(d => d.nc))

  return (
    <section className="sec">
      <div className="sec-head">
        <div>
          <div className="no">SEC · 00 · DASHBOARD</div>
          <h1>Visão geral</h1>
          <p className="lede">Indicadores consolidados · Abril 2026</p>
        </div>
      </div>

      <div className="dash-grid" style={{ marginBottom: 32 }}>
        {kpis.map(k => (
          <KPICard
            key={k.label}
            label={k.label}
            value={k.value}
            unit={k.unit}
            delta={k.delta}
            deltaTone={k.deltaTone}
            meta={k.meta}
            bar={k.bar}
          />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, marginBottom: 32 }}>
        <HalstenCard>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 11, fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--ink)', marginBottom: 18,
          }}>
            FVS realizadas por mês
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 130 }}>
            {chartData.map(d => (
              <div key={d.mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div className="mono" style={{ fontSize: 10.5, fontWeight: 600 }}>{d.fvs}</div>
                <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', height: 90 }}>
                  <div style={{ flex: 1, background: 'var(--ink)', height: `${(d.fvs / maxFvs) * 90}px` }} />
                  <div style={{ flex: 1, background: 'var(--bad)', opacity: 0.85, height: `${(d.nc / maxNc) * 90}px` }} />
                </div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--muted-1)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{d.mes}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--rule)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--muted-1)' }}>
              <span style={{ width: 10, height: 10, background: 'var(--ink)' }} /> FVS realizadas
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--muted-1)' }}>
              <span style={{ width: 10, height: 10, background: 'var(--bad)', opacity: 0.85 }} /> Com NCs
            </span>
          </div>
        </HalstenCard>

        <HalstenCard title="Empreendimentos ativos">
          {EMPREENDIMENTOS.map((e, idx) => (
            <div
              key={e.id}
              style={{
                marginBottom: idx === EMPREENDIMENTOS.length - 1 ? 0 : 14,
                paddingBottom: idx === EMPREENDIMENTOS.length - 1 ? 0 : 14,
                borderBottom: idx === EMPREENDIMENTOS.length - 1 ? 'none' : '1px solid var(--rule)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>{e.nome}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--muted-1)' }}>{e.progresso}%</div>
              </div>
              <div className="score-bar">
                <i style={{ width: `${e.progresso}%` }} />
              </div>
            </div>
          ))}
        </HalstenCard>
      </div>

      <div className="card">
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 11, fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'var(--ink)', marginBottom: 14,
        }}>
          RNCs recentes
        </div>
        <div className="tbl">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Empreendimento</th>
                <th>Serviço</th>
                <th>Gravidade</th>
                <th>Status</th>
                <th>Prazo</th>
              </tr>
            </thead>
            <tbody>
              {RNC_LIST.slice(0, 5).map(rnc => (
                <tr key={rnc.id}>
                  <td className="ref">{rnc.id}</td>
                  <td>{rnc.empreendimento}</td>
                  <td>{rnc.servico}</td>
                  <td>{rnc.gravidade}</td>
                  <td>{rnc.status}</td>
                  <td className="mono" style={{ color: 'var(--muted-1)' }}>{rnc.prazo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
