import { useState } from 'react'
import { HalstenCard } from '../components/HalstenCard'
import { RNC_LIST } from '../data/mockData'

export function Rncs() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'var(--sp-8)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-8)' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
          Registros de Não Conformidade
        </h1>
        <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 'var(--sp-1) 0 0 0' }}>
          {RNC_LIST.length} RNCs registradas
        </p>
      </div>

      {/* RNCs List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
        {RNC_LIST.map(rnc => (
          <HalstenCard key={rnc.id}>
            <div
              onClick={() => setExpandedId(expandedId === rnc.id ? null : rnc.id)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 'var(--sp-1)' }}>
                    {rnc.id}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>
                    {rnc.empreendimento} · {rnc.servico}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-1)' }}>
                    {rnc.gravidade}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{rnc.status}</div>
                </div>
              </div>
            </div>

            {expandedId === rnc.id && (
              <div style={{ marginTop: 'var(--sp-4)', paddingTop: 'var(--sp-4)', borderTop: '1px solid var(--bg-2)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)', fontSize: 12 }}>
                  <div>
                    <div style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-1)' }}>Empreendimento</div>
                    <div style={{ color: 'var(--ink)', fontWeight: 600 }}>{rnc.empreendimento}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-1)' }}>Serviço</div>
                    <div style={{ color: 'var(--ink)', fontWeight: 600 }}>{rnc.servico}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-1)' }}>Gravidade</div>
                    <div style={{ color: 'var(--ink)', fontWeight: 600 }}>{rnc.gravidade}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-1)' }}>Status</div>
                    <div style={{ color: 'var(--ink)', fontWeight: 600 }}>{rnc.status}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-1)' }}>Prazo</div>
                    <div style={{ color: 'var(--ink)', fontWeight: 600 }}>{rnc.prazo}</div>
                  </div>
                </div>
              </div>
            )}
          </HalstenCard>
        ))}
      </div>
    </div>
  )
}
