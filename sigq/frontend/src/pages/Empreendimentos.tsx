import { HalstenButton } from '../components/HalstenButton'
import { HalstenCard } from '../components/HalstenCard'
import { HalstenBadge } from '../components/HalstenBadge'
import { EMPREENDIMENTOS } from '../data/mockData'

export function Empreendimentos() {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'var(--sp-8)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-8)' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>Empreendimentos</h1>
          <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 'var(--sp-1) 0 0 0' }}>
            {EMPREENDIMENTOS.length} obras ativas
          </p>
        </div>
        <HalstenButton variant="primary">+ Novo empreendimento</HalstenButton>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--sp-6)' }}>
        {EMPREENDIMENTOS.map(e => (
          <HalstenCard key={e.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-4)' }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>{e.nome}</h3>
                <p style={{ fontSize: 12, color: 'var(--ink-2)', margin: 'var(--sp-1) 0 0 0' }}>
                  {e.cidade} · {e.blocos} bloco{e.blocos > 1 ? 's' : ''} · {e.unidades} unidades
                </p>
              </div>
              <HalstenBadge variant="success">Em andamento</HalstenBadge>
            </div>

            {/* Progress */}
            <div style={{ marginBottom: 'var(--sp-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted-1)', marginBottom: 'var(--sp-1)' }}>
                <span>Progresso</span>
                <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{e.progresso}%</span>
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

            {/* Stats */}
            <div style={{ display: 'flex', gap: 'var(--sp-4)', borderTop: '1px solid var(--bg-2)', paddingTop: 'var(--sp-4)' }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)' }}>{e.fvs}</div>
                <div style={{ fontSize: 10, color: 'var(--muted-1)' }}>FVS realizadas</div>
              </div>
              <div style={{ width: 1, background: 'var(--bg-2)' }} />
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: e.rncs > 5 ? 'var(--bad)' : 'var(--ink)' }}>
                  {e.rncs}
                </div>
                <div style={{ fontSize: 10, color: 'var(--muted-1)' }}>RNCs abertas</div>
              </div>
            </div>
          </HalstenCard>
        ))}
      </div>
    </div>
  )
}
