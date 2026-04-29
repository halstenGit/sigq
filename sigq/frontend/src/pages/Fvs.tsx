import { useState } from 'react'
import { HalstenCard } from '../components/HalstenCard'
import { FVS_LIST, RNC_LIST } from '../data/mockData'
import { useFvs } from '../contexts/FvsContext'
import { useRnc } from '../contexts/RncContext'

interface FvsProps {
  onNavigate?: (page: string, data?: any) => void
}

export function Fvs({ onNavigate }: FvsProps) {
  const [filter, setFilter] = useState('todos')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { fvsList } = useFvs()
  const { rncList, getRncsByFvs } = useRnc()

  const allFvs = [...fvsList, ...FVS_LIST]
  const filtered = filter === 'todos' ? allFvs : allFvs.filter(f => f.status === filter)

  return (
    <section className="sec">
      <div className="sec-head">
        <div>
          <div className="no">SEC · 02 · FVS</div>
          <h1>Fichas de Verificação</h1>
          <p className="lede">{filtered.length} fichas encontradas.</p>
        </div>
        <button onClick={() => onNavigate?.('nova-fvs')} className="btn primary">
          + Nova FVS
        </button>
      </div>

      <div className="pill-seg" style={{ marginBottom: 24 }}>
        {['todos', 'finalizada', 'em_progresso', 'rascunho'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={filter === status ? 'on' : ''}
            style={{ textTransform: 'capitalize' }}
          >
            {status === 'todos' ? 'Todos' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* FVS List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
        {filtered.map(fvs => (
          <HalstenCard key={fvs.id}>
            <div
              onClick={() => setExpandedId(expandedId === fvs.id ? null : fvs.id)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 'var(--sp-1)' }}>
                    {fvs.empreendimento} · {fvs.servico}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>
                    {fvs.local} · Nota: {fvs.nota}/10
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-1)' }}>
                    {fvs.status}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{fvs.dataRealizacao}</div>
                </div>
              </div>
            </div>

            {expandedId === fvs.id && (
              <div style={{ marginTop: 'var(--sp-4)', paddingTop: 'var(--sp-4)', borderTop: '1px solid var(--bg-2)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)', fontSize: 12, marginBottom: 'var(--sp-6)' }}>
                  <div>
                    <div style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-1)' }}>Empreendimento</div>
                    <div style={{ color: 'var(--ink)', fontWeight: 600 }}>{fvs.empreendimento}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-1)' }}>Serviço</div>
                    <div style={{ color: 'var(--ink)', fontWeight: 600 }}>{fvs.servico}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-1)' }}>Local</div>
                    <div style={{ color: 'var(--ink)', fontWeight: 600 }}>{fvs.local}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-1)' }}>Nota</div>
                    <div style={{ color: 'var(--ink)', fontWeight: 600 }}>{fvs.nota}/10</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-1)' }}>Status</div>
                    <div style={{ color: 'var(--ink)', fontWeight: 600 }}>{fvs.status}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--ink-2)', marginBottom: 'var(--sp-1)' }}>Data</div>
                    <div style={{ color: 'var(--ink)', fontWeight: 600 }}>{fvs.dataRealizacao}</div>
                  </div>
                </div>

                {(() => {
                  const fvsRncs = [...RNC_LIST, ...rncList].filter(r => r.fvsId === fvs.id)
                  return fvsRncs.length > 0 ? (
                    <div style={{ marginTop: 'var(--sp-4)', paddingTop: 'var(--sp-4)', borderTop: '1px solid var(--bg-2)' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 'var(--sp-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Não-Conformidades Vinculadas ({fvsRncs.length})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                        {fvsRncs.map(rnc => (
                          <div key={rnc.id} style={{ padding: 'var(--sp-3)', background: 'var(--bg-2)', borderRadius: 4 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--sp-2)' }}>
                              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--ink)' }}>{rnc.id}</div>
                              <div style={{
                                display: 'inline-block',
                                padding: '2px var(--sp-2)',
                                background: rnc.gravidade === 'critica' ? '#d32f2f' : rnc.gravidade === 'maior' ? '#f57c00' : rnc.gravidade === 'menor' ? '#fbc02d' : '#7b8fa3',
                                color: '#fff',
                                fontSize: 9,
                                fontWeight: 700,
                                borderRadius: 0,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                              }}>
                                {rnc.gravidade}
                              </div>
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--ink)', marginBottom: 'var(--sp-1)', lineHeight: 1.4 }}>
                              {rnc.descricao}
                            </div>
                            <div style={{ fontSize: 10, color: 'var(--ink-2)', display: 'flex', gap: 'var(--sp-3)' }}>
                              <span>Status: <strong>{rnc.status.replace('_', ' ')}</strong></span>
                              <span>Prazo: <strong>{rnc.prazo}</strong></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null
                })()}

                <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => onNavigate?.('editar-fvs', { fvsId: fvs.id })}
                    className="btn primary sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onNavigate?.('nova-rnc', { fvsId: fvs.id, empreendimento: fvs.empreendimento, servico: fvs.servico })}
                    className="btn sm"
                  >
                    Nova RNC
                  </button>
                  <button
                    onClick={() => {
                      const text = `
FVS #${fvs.id}
Empreendimento: ${fvs.empreendimento}
Serviço: ${fvs.servico}
Local: ${fvs.local}
Pavimento: ${fvs.pavimento}
Unidade: ${fvs.unidade}
Inspetor: ${fvs.inspetor}
Empreiteira: ${fvs.empreiteira}
Nota: ${fvs.nota}/10
Status: ${fvs.status}
Data: ${fvs.dataRealizacao}
Observações: ${fvs.observacoes || '-'}
                      `.trim()
                      navigator.clipboard.writeText(text)
                      alert('Dados copiados para a área de transferência!')
                    }}
                    className="btn ghost sm"
                  >
                    Copiar dados
                  </button>
                </div>
              </div>
            )}
          </HalstenCard>
        ))}
      </div>
    </section>
  )
}
