import { HalstenCard } from '../components/HalstenCard'
import { HalstenButton } from '../components/HalstenButton'
import { HalstenBadge } from '../components/HalstenBadge'
import { RNC_LIST } from '../data/mockData'

export function Rncs() {
  const getGravidadeBadge = (gravidade: string) => {
    if (gravidade === 'Crítica') return 'error'
    if (gravidade === 'Alta') return 'warning'
    return 'default'
  }

  const getStatusBadge = (status: string) => {
    if (status === 'Resolvida') return 'success'
    if (status === 'Em progresso') return 'warning'
    return 'error'
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'var(--sp-8)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-8)' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
            Registros de Não Conformidade (RNC)
          </h1>
          <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 'var(--sp-1) 0 0 0' }}>
            {RNC_LIST.length} RNCs registradas
          </p>
        </div>
        <HalstenButton variant="primary">+ Nova RNC</HalstenButton>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--sp-6)' }}>
        {RNC_LIST.map(rnc => (
          <HalstenCard key={rnc.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-4)' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>{rnc.id}</h3>
              <HalstenBadge variant={getGravidadeBadge(rnc.gravidade)}>{rnc.gravidade}</HalstenBadge>
            </div>

            <div style={{ marginBottom: 'var(--sp-4)' }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted-1)', textTransform: 'uppercase', display: 'block', marginBottom: 'var(--sp-1)' }}>Empreendimento</label>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{rnc.empreendimento}</div>
            </div>

            <div style={{ marginBottom: 'var(--sp-4)' }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted-1)', textTransform: 'uppercase', display: 'block', marginBottom: 'var(--sp-1)' }}>Serviço</label>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{rnc.servico}</div>
            </div>

            <div style={{ marginBottom: 'var(--sp-4)' }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted-1)', textTransform: 'uppercase', display: 'block', marginBottom: 'var(--sp-1)' }}>Descrição</label>
              <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.4 }}>{rnc.descricao}</div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--sp-4)', marginBottom: 'var(--sp-4)', paddingBottom: 'var(--sp-4)', borderBottom: '1px solid var(--bg-2)' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted-1)', textTransform: 'uppercase', display: 'block', marginBottom: 'var(--sp-1)' }}>Status</label>
                <HalstenBadge variant={getStatusBadge(rnc.status)}>{rnc.status}</HalstenBadge>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted-1)', textTransform: 'uppercase', display: 'block', marginBottom: 'var(--sp-1)' }}>Responsável</label>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{rnc.responsavel}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--sp-4)' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted-1)', textTransform: 'uppercase', display: 'block', marginBottom: 'var(--sp-1)' }}>Abertura</label>
                <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{rnc.abertura}</div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted-1)', textTransform: 'uppercase', display: 'block', marginBottom: 'var(--sp-1)' }}>Prazo</label>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{rnc.prazo}</div>
              </div>
            </div>
          </HalstenCard>
        ))}
      </div>
    </div>
  )
}
