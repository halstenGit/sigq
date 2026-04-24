import { HalstenCard } from '../components/HalstenCard'
import { HalstenButton } from '../components/HalstenButton'
import { Badge } from '../components/Badge'
import { RNC_LIST } from '../data/mockData'

export function Rncs() {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'var(--hs-space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--hs-space-6)' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hs-text-primary)', margin: 0 }}>
            Registros de Não Conformidade (RNC)
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--hs-text-tertiary)', margin: 'var(--hs-space-1) 0 0 0' }}>
            {RNC_LIST.length} RNCs registradas
          </p>
        </div>
        <HalstenButton variant="danger">+ Nova RNC</HalstenButton>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 'var(--hs-space-4)' }}>
        {RNC_LIST.map(rnc => (
          <HalstenCard key={rnc.id}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--hs-space-3)' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--hs-text-primary)' }}>{rnc.id}</div>
              <Badge type="gravidade" value={rnc.gravidade} />
            </div>

            {/* Empreendimento */}
            <div style={{ marginBottom: 'var(--hs-space-3)' }}>
              <div style={{ fontSize: '11px', color: 'var(--hs-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Empreendimento
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--hs-text-primary)' }}>{rnc.empreendimento}</div>
            </div>

            {/* Serviço */}
            <div style={{ marginBottom: 'var(--hs-space-3)' }}>
              <div style={{ fontSize: '11px', color: 'var(--hs-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Serviço
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--hs-text-primary)' }}>{rnc.servico}</div>
            </div>

            {/* Descrição */}
            <div style={{ marginBottom: 'var(--hs-space-3)' }}>
              <div style={{ fontSize: '11px', color: 'var(--hs-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Descrição
              </div>
              <div style={{ fontSize: '12px', color: 'var(--hs-text-primary)', lineHeight: '1.4' }}>{rnc.descricao}</div>
            </div>

            {/* Status e Responsável */}
            <div style={{ display: 'flex', gap: 'var(--hs-space-3)', marginBottom: 'var(--hs-space-3)', paddingBottom: 'var(--hs-space-3)', borderBottom: '1px solid var(--hs-border)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: 'var(--hs-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Status
                </div>
                <div style={{ marginTop: 'var(--hs-space-1)' }}>
                  <Badge type="rnc" value={rnc.status} />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: 'var(--hs-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Responsável
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--hs-text-primary)', marginTop: 'var(--hs-space-1)' }}>
                  {rnc.responsavel}
                </div>
              </div>
            </div>

            {/* Datas */}
            <div style={{ display: 'flex', gap: 'var(--hs-space-3)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: 'var(--hs-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Abertura
                </div>
                <div style={{ fontSize: '12px', color: 'var(--hs-text-primary)', marginTop: 'var(--hs-space-1)' }}>{rnc.abertura}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: 'var(--hs-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Prazo
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--hs-text-primary)', marginTop: 'var(--hs-space-1)' }}>{rnc.prazo}</div>
              </div>
            </div>
          </HalstenCard>
        ))}
      </div>
    </div>
  )
}
