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

  return (
    <div style={{ background: 'var(--bg-1)', border: '1px solid var(--bg-2)', borderRadius: 6, padding: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 20 }}>
        {title}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 120 }}>
        {data.map(d => (
          <div key={d.mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ fontSize: 11, color: 'var(--ink)', fontWeight: 600 }}>{d.fvs || ''}</div>
            <div style={{ width: '100%', display: 'flex', gap: 3, alignItems: 'flex-end', height: 90 }}>
              <div
                style={{
                  flex: 1,
                  background: d.fvs ? 'var(--ok)' : 'var(--bg-2)',
                  height: `${(d.fvs / maxFvs) * 90}px`,
                  borderRadius: '3px 3px 0 0',
                  transition: 'height .3s',
                }}
              />
              <div
                style={{
                  flex: 1,
                  background: d.nc ? 'var(--bad)' : 'var(--bg-2)',
                  height: `${(d.nc / maxFvs) * 90}px`,
                  borderRadius: '3px 3px 0 0',
                  opacity: 0.7,
                }}
              />
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-2)' }}>{d.mes}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ink-2)' }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--ok)' }} />
          FVS realizadas
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ink-2)' }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--bad)', opacity: 0.7 }} />
          Com NCs
        </div>
      </div>
    </div>
  )
}
