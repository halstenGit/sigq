interface ChartData {
  mes: string
  fvs: number
  nc: number
}

interface BarChartProps {
  data: ChartData[]
  title: string
}

export function BarChart({ data, title }: BarChartProps) {
  const maxFvs = Math.max(...data.map(d => d.fvs || 0), 1)
  const maxNc = Math.max(...data.map(d => d.nc || 0), 1)

  return (
    <div className="card">
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--ink)',
        marginBottom: 18,
      }}>
        {title}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 130 }}>
        {data.map(d => (
          <div key={d.mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink)', fontWeight: 600 }}>{d.fvs || ''}</div>
            <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', height: 90 }}>
              <div
                style={{
                  flex: 1,
                  background: d.fvs ? 'var(--ink)' : 'var(--bg-sunken)',
                  height: `${(d.fvs / maxFvs) * 90}px`,
                }}
              />
              <div
                style={{
                  flex: 1,
                  background: d.nc ? 'var(--bad)' : 'var(--bg-sunken)',
                  height: `${(d.nc / maxNc) * 90}px`,
                  opacity: 0.85,
                }}
              />
            </div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--muted-1)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{d.mes}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--rule)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--muted-1)' }}>
          <span style={{ width: 10, height: 10, background: 'var(--ink)' }} />
          FVS realizadas
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--muted-1)' }}>
          <span style={{ width: 10, height: 10, background: 'var(--bad)', opacity: 0.85 }} />
          Com NCs
        </div>
      </div>
    </div>
  )
}
