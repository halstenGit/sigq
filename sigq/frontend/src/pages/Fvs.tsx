import { useState } from 'react'
import { HalstenCard } from '../components/HalstenCard'
import { FVS_LIST } from '../data/mockData'
import { useFvs } from '../contexts/FvsContext'

interface FvsProps {
  onNavigate?: (page: string, data?: any) => void
}

export function Fvs({ onNavigate }: FvsProps) {
  const [filter, setFilter] = useState('todos')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { fvsList } = useFvs()

  const allFvs = [...fvsList, ...FVS_LIST]
  const filtered = filter === 'todos' ? allFvs : allFvs.filter(f => f.status === filter)

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: 'var(--sp-8)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-8)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
            Fichas de Verificação
          </h1>
          <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 'var(--sp-1) 0 0 0' }}>
            {filtered.length} fichas encontradas
          </p>
        </div>
        <button
          onClick={() => onNavigate?.('nova-fvs')}
          style={{
            padding: 'var(--sp-3) var(--sp-4)',
            background: 'var(--ink)',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'opacity 0.15s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => {
            (e.target as HTMLElement).style.opacity = '0.9'
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.opacity = '1'
          }}
        >
          + Nova FVS
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-6)' }}>
        {['todos', 'finalizada', 'em_progresso', 'rascunho'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: 'var(--sp-2) var(--sp-4)',
              background: filter === status ? 'var(--ink)' : 'var(--bg-1)',
              color: filter === status ? '#fff' : 'var(--ink)',
              border: '1px solid var(--bg-2)',
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.15s',
            }}
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
                <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
                  <button
                    onClick={() => onNavigate?.('editar-fvs', { fvsId: fvs.id })}
                    style={{
                      padding: 'var(--sp-2) var(--sp-4)',
                      background: 'var(--ink)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => {
                      (e.target as HTMLElement).style.opacity = '0.9'
                    }}
                    onMouseLeave={e => {
                      (e.target as HTMLElement).style.opacity = '1'
                    }}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => onNavigate?.('nova-rnc', { fvsId: fvs.id, empreendimento: fvs.empreendimento, servico: fvs.servico })}
                    style={{
                      padding: 'var(--sp-2) var(--sp-4)',
                      background: 'var(--bg-2)',
                      color: 'var(--ink)',
                      border: `1px solid var(--bg-2)`,
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => {
                      (e.target as HTMLElement).style.background = 'var(--bg-1)'
                    }}
                    onMouseLeave={e => {
                      (e.target as HTMLElement).style.background = 'var(--bg-2)'
                    }}
                  >
                    ⚠️ Nova RNC
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
                    style={{
                      padding: 'var(--sp-2) var(--sp-4)',
                      background: 'var(--bg-2)',
                      color: 'var(--ink)',
                      border: `1px solid var(--bg-2)`,
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => {
                      (e.target as HTMLElement).style.background = 'var(--bg-1)'
                    }}
                    onMouseLeave={e => {
                      (e.target as HTMLElement).style.background = 'var(--bg-2)'
                    }}
                  >
                    📋 Copiar Dados
                  </button>
                </div>
              </div>
            )}
          </HalstenCard>
        ))}
      </div>
    </div>
  )
}
