import { useState } from 'react'
import { HalstenButton } from '../components/HalstenButton'
import { HalstenCard } from '../components/HalstenCard'
import { HalstenBadge } from '../components/HalstenBadge'
import { HalstenTable, HalstenTableRow, HalstenTableCell } from '../components/HalstenTable'
import { HalstenModal } from '../components/HalstenModal'
import { FVS_LIST } from '../data/mockData'
import { useFvs } from '../contexts/FvsContext'

interface FvsProps {
  onNavigate?: (page: string, data?: any) => void
}

export function Fvs({ onNavigate }: FvsProps) {
  const [filter, setFilter] = useState('todos')
  const [selectedFvs, setSelectedFvs] = useState<any>(null)
  const { fvsList } = useFvs()

  const allFvs = [...fvsList, ...FVS_LIST]
  const filtered = filter === 'todos' ? allFvs : allFvs.filter(f => f.status === filter)

  const getStatusBadgeVariant = (status: string) => {
    if (status === 'finalizada') return 'success'
    if (status === 'rascunho') return 'default'
    return 'warning'
  }

  const getNotaBg = (nota: number) => {
    if (nota >= 7) return '#4CAF50'
    if (nota >= 4) return '#FFC107'
    return '#F44336'
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'var(--sp-8)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-8)' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
            Fichas de Verificação (FVS)
          </h1>
          <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 'var(--sp-1) 0 0 0' }}>
            {filtered.length} fichas encontradas
          </p>
        </div>
        <HalstenButton variant="primary" onClick={() => onNavigate?.('nova-fvs')}>
          + Nova FVS
        </HalstenButton>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-6)' }}>
        {[
          ['todos', 'Todas'],
          ['rascunho', 'Rascunho'],
          ['finalizada', 'Finalizadas'],
          ['com_nc', 'Com NC'],
        ].map(([v, l]) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            style={{
              padding: 'var(--sp-2) var(--sp-3)',
              borderRadius: 4,
              border: `1.5px solid ${filter === v ? 'var(--ink)' : 'var(--bg-2)'}`,
              background: filter === v ? 'var(--ink)' : 'var(--bg)',
              color: filter === v ? '#fff' : 'var(--ink)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all .15s',
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Table */}
      <HalstenCard>
        <HalstenTable headers={['Nº FVS', 'Empreendimento', 'Serviço', 'Local', 'Inspetor', 'Data', 'Nota', 'Status']}>
          {filtered.map(f => (
            <HalstenTableRow key={f.id} onClick={() => setSelectedFvs(f)}>
              <HalstenTableCell variant="header">{f.id}</HalstenTableCell>
              <HalstenTableCell>{f.empreendimento}</HalstenTableCell>
              <HalstenTableCell>{f.servico}</HalstenTableCell>
              <HalstenTableCell>{f.local || f.pavimento}</HalstenTableCell>
              <HalstenTableCell>{f.inspetor}</HalstenTableCell>
              <HalstenTableCell>{f.dataRealizacao || '-'}</HalstenTableCell>
              <HalstenTableCell variant="numeric">
                <span style={{ display: 'inline-block', padding: '4px 8px', background: getNotaBg(f.nota || 0), color: '#fff', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                  {f.nota || 0}
                </span>
              </HalstenTableCell>
              <HalstenTableCell>
                <HalstenBadge variant={getStatusBadgeVariant(f.status)}>
                  {f.status}
                </HalstenBadge>
              </HalstenTableCell>
            </HalstenTableRow>
          ))}
        </HalstenTable>
      </HalstenCard>

      {/* Modal */}
      <HalstenModal isOpen={!!selectedFvs} onClose={() => setSelectedFvs(null)} title={`${selectedFvs?.id} - ${selectedFvs?.empreendimento}`} maxWidth="700px">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-6)', marginBottom: 'var(--sp-6)' }}>
          <div>
            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted-1)', textTransform: 'uppercase', display: 'block', marginBottom: 'var(--sp-2)' }}>Local</label>
            <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{selectedFvs?.local || selectedFvs?.pavimento}</div>
          </div>
          <div>
            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted-1)', textTransform: 'uppercase', display: 'block', marginBottom: 'var(--sp-2)' }}>Nota</label>
            <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{selectedFvs?.nota || 0} / 10</div>
          </div>
          <div>
            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted-1)', textTransform: 'uppercase', display: 'block', marginBottom: 'var(--sp-2)' }}>Inspetor</label>
            <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{selectedFvs?.inspetor}</div>
          </div>
          <div>
            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted-1)', textTransform: 'uppercase', display: 'block', marginBottom: 'var(--sp-2)' }}>Empreiteira</label>
            <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{selectedFvs?.empreiteira || '—'}</div>
          </div>
        </div>

        {selectedFvs?.observacoes && (
          <div style={{ marginBottom: 'var(--sp-6)', paddingBottom: 'var(--sp-6)', borderBottom: '1px solid var(--bg-2)' }}>
            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted-1)', textTransform: 'uppercase', display: 'block', marginBottom: 'var(--sp-2)' }}>Observações</label>
            <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>{selectedFvs.observacoes}</div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--sp-3)', marginTop: 'var(--sp-6)', paddingTop: 'var(--sp-6)', borderTop: '1px solid var(--bg-2)' }}>
          <HalstenButton variant="primary" onClick={() => setSelectedFvs(null)}>
            Fechar
          </HalstenButton>
        </div>
      </HalstenModal>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 'var(--sp-12)', color: 'var(--ink-2)' }}>
          Nenhuma FVS encontrada com esse filtro.
        </div>
      )}
    </div>
  )
}
