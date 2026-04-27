import { HalstenCard } from '../components/HalstenCard'
import { EMPREENDIMENTOS } from '../data/mockData'

export function Empreendimentos() {
  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: 'var(--sp-8)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-8)' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>Empreendimentos</h1>
        <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 'var(--sp-1) 0 0 0' }}>
          {EMPREENDIMENTOS.length} obras ativas
        </p>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--sp-6)' }}>
        {EMPREENDIMENTOS.map(e => (
          <HalstenCard key={e.id}>
            <div style={{ marginBottom: 'var(--sp-4)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', margin: 0, marginBottom: 'var(--sp-1)' }}>
                {e.nome}
              </h3>
              <p style={{ fontSize: 12, color: 'var(--ink-2)', margin: 0 }}>
                {e.cidade} · {e.blocos} bloco{e.blocos > 1 ? 's' : ''} · {e.unidades} unidades
              </p>
            </div>

            {/* Progress */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-2)', marginBottom: 'var(--sp-2)' }}>
                <span>Progresso</span>
                <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{e.progresso}%</span>
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
          </HalstenCard>
        ))}
      </div>
    </div>
  )
}
