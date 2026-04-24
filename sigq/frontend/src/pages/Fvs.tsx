import { useState } from 'react'
import { Card } from '../components/Card'
import { Badge } from '../components/Badge'
import { colors } from '../styles/theme'
import { FVS_LIST } from '../data/mockData'
import { useFvs } from '../contexts/FvsContext'

interface FvsProps {
  onNavigate?: (page: string, data?: any) => void
}

export function Fvs({ onNavigate }: FvsProps) {
  const [filter, setFilter] = useState('todos')
  const [selectedFvs, setSelectedFvs] = useState<any>(null)
  const { fvsList } = useFvs()

  // Combinar mock data com FVS criadas (FVS criadas primeiro)
  const allFvs = [...fvsList, ...FVS_LIST]

  const filtered = filter === 'todos' ? allFvs : allFvs.filter(f => f.status === filter)

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: colors.primaryDark }}>
            Fichas de Verificação (FVS)
          </div>
          <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>
            {FVS_LIST.length} fichas registradas
          </div>
        </div>
        <button
          onClick={() => onNavigate?.('nova-fvs')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '9px 16px',
            background: colors.primary,
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background .15s',
          }}
          onMouseEnter={e => {
            (e.target as HTMLElement).style.background = colors.primaryDark
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.background = colors.primary
          }}
        >
          <span style={{ fontSize: 16 }}>+</span> Nova FVS
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
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
              padding: '6px 14px',
              borderRadius: 6,
              border: `1.5px solid ${filter === v ? colors.primary : colors.border}`,
              background: filter === v ? colors.primary : colors.bgWhite,
              color: filter === v ? '#fff' : colors.text,
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
      <Card padding="0" borderColor={colors.border}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: colors.bgLight, borderBottom: `1px solid ${colors.border}` }}>
              {['Nº FVS', 'Empreendimento', 'Serviço', 'Local', 'Inspetor', 'Data', 'Nota', 'Status'].map(h => (
                <th
                  key={h}
                  style={{
                    padding: '10px 14px',
                    textAlign: 'left',
                    color: colors.text,
                    fontWeight: 600,
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((f, i) => {
              const nota = f.nota || 0
              const notaBg = nota >= 7 ? '#4caf50' : nota >= 4 ? '#ff9800' : '#f44336'
              return (
                <tr
                  key={f.id}
                  onClick={() => setSelectedFvs(f)}
                  style={{
                    borderBottom: `1px solid ${colors.border}`,
                    background: i % 2 === 0 ? colors.bgWhite : colors.bgLight,
                    cursor: 'pointer',
                    transition: 'background .1s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = '#f0f7f2'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? colors.bgWhite : colors.bgLight
                  }}
                >
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: colors.primaryDark }}>{f.id}</td>
                  <td style={{ padding: '10px 14px', color: colors.text }}>{f.empreendimento}</td>
                  <td style={{ padding: '10px 14px', color: colors.text }}>{f.servico}</td>
                  <td style={{ padding: '10px 14px', color: colors.textMuted, fontSize: 11 }}>{f.local || f.pavimento}</td>
                  <td style={{ padding: '10px 14px', color: colors.text }}>{f.inspetor}</td>
                  <td style={{ padding: '10px 14px', color: colors.textMuted }}>{f.dataRealizacao || '-'}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        background: notaBg,
                        color: '#fff',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {nota}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <Badge type="fvs" value={f.status} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>

      {/* Modal de Detalhes */}
      {selectedFvs && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setSelectedFvs(null)}
        >
          <Card
            borderColor={colors.primary}
            padding="32px"
            style={{
              maxWidth: '700px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              background: colors.bgWhite,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: colors.primaryDark }}>
                  {selectedFvs.id} - {selectedFvs.empreendimento}
                </div>
                <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>
                  {selectedFvs.servico} • {selectedFvs.dataRealizacao || 'Data não informada'}
                </div>
              </div>
              <button
                onClick={() => setSelectedFvs(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  cursor: 'pointer',
                  color: colors.textMuted,
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 6 }}>
                  Local
                </div>
                <div style={{ fontSize: 14, color: colors.text, fontWeight: 500 }}>
                  {selectedFvs.local || selectedFvs.pavimento}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 6 }}>
                  Nota
                </div>
                <div style={{ fontSize: 14, color: colors.text, fontWeight: 500 }}>
                  {selectedFvs.nota || 0} / 10
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 6 }}>
                  Inspetor
                </div>
                <div style={{ fontSize: 14, color: colors.text, fontWeight: 500 }}>
                  {selectedFvs.inspetor}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 6 }}>
                  Empreiteira
                </div>
                <div style={{ fontSize: 14, color: colors.text, fontWeight: 500 }}>
                  {selectedFvs.empreiteira || '—'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 6 }}>
                  Pavimento
                </div>
                <div style={{ fontSize: 14, color: colors.text, fontWeight: 500 }}>
                  {selectedFvs.pavimento}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 6 }}>
                  Status
                </div>
                <Badge type="fvs" value={selectedFvs.status} />
              </div>
            </div>

            {selectedFvs.observacoes && (
              <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${colors.border}` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 8 }}>
                  Observações
                </div>
                <div style={{ fontSize: 13, color: colors.text, lineHeight: '1.5' }}>
                  {selectedFvs.observacoes}
                </div>
              </div>
            )}

            {selectedFvs.localAvaliado && (
              <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${colors.border}` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 8 }}>
                  Local Avaliado
                </div>
                <div style={{ fontSize: 13, color: colors.text }}>
                  {selectedFvs.localAvaliado}
                </div>
              </div>
            )}

            {selectedFvs.colaboradorAvaliado && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 8 }}>
                  Colaborador Avaliado
                </div>
                <div style={{ fontSize: 13, color: colors.text }}>
                  {selectedFvs.colaboradorAvaliado}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 24, paddingTop: 24, borderTop: `1px solid ${colors.border}` }}>
              <button
                onClick={() => setSelectedFvs(null)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: colors.primary,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background .15s',
                }}
                onMouseEnter={e => {
                  (e.target as HTMLElement).style.background = colors.primaryDark
                }}
                onMouseLeave={e => {
                  (e.target as HTMLElement).style.background = colors.primary
                }}
              >
                Fechar
              </button>
            </div>
          </Card>
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: colors.textMuted }}>
          Nenhuma FVS encontrada com esse filtro.
        </div>
      )}
    </div>
  )
}
