import { HalstenButton } from '../components/HalstenButton'
import { HalstenCard } from '../components/HalstenCard'
import { HalstenBadge } from '../components/HalstenBadge'
import { EMPREENDIMENTOS } from '../data/mockData'

export function Empreendimentos() {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'var(--hs-space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--hs-space-6)' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hs-text-primary)', margin: 0 }}>Empreendimentos</h1>
          <p style={{ fontSize: '14px', color: 'var(--hs-text-tertiary)', margin: 'var(--hs-space-1) 0 0 0' }}>
            {EMPREENDIMENTOS.length} obras ativas
          </p>
        </div>
        <HalstenButton variant="primary">+ Novo empreendimento</HalstenButton>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 'var(--hs-space-4)' }}>
        {EMPREENDIMENTOS.map(e => (
          <HalstenCard key={e.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--hs-space-4)' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--hs-text-primary)', margin: 0 }}>{e.nome}</h3>
                <p style={{ fontSize: '12px', color: 'var(--hs-text-tertiary)', margin: 'var(--hs-space-1) 0 0 0' }}>
                  {e.cidade} · {e.blocos} bloco{e.blocos > 1 ? 's' : ''} · {e.unidades} unidades
                </p>
              </div>
              <HalstenBadge variant="success">Em andamento</HalstenBadge>
            </div>

            {/* Progress */}
            <div style={{ marginBottom: 'var(--hs-space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--hs-text-tertiary)', marginBottom: 'var(--hs-space-1)' }}>
                <span>Progresso geral</span>
                <span style={{ fontWeight: 600, color: 'var(--hs-text-primary)' }}>{e.progresso}%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--hs-border)', borderRadius: '99px' }}>
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

            {/* Stats */}
            <div style={{ display: 'flex', gap: 'var(--hs-space-4)', borderTop: '1px solid var(--hs-border)', paddingTop: 'var(--hs-space-3)' }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--hs-text-primary)' }}>{e.fvs}</div>
                <div style={{ fontSize: '11px', color: 'var(--hs-text-tertiary)' }}>FVS realizadas</div>
              </div>
              <div style={{ width: '1px', background: 'var(--hs-border)' }} />
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 700, color: e.rncs > 5 ? 'var(--hs-error)' : 'var(--hs-text-primary)' }}>
                  {e.rncs}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--hs-text-tertiary)' }}>RNCs abertas</div>
              </div>
            </div>
          </HalstenCard>
        ))}
      </div>
    </div>
  )
}
