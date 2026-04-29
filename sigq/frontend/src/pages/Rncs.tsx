import { useState } from 'react'
import { HalstenButton } from '../components/HalstenButton'
import { HalstenCard } from '../components/HalstenCard'
import { useRnc } from '../contexts/RncContext'
import { RNC_LIST } from '../data/mockData'

interface RncsProps {
  onNavigate?: (page: string, data?: any) => void
}

export function Rncs({ onNavigate }: RncsProps) {
  const { rncList } = useRnc()
  const [filterStatus, setFilterStatus] = useState<string>('todos')

  const allRncs = [...RNC_LIST, ...rncList]

  const filteredRncs = filterStatus === 'todos'
    ? allRncs
    : allRncs.filter(rnc => rnc.status === filterStatus)

  const getGravidadeColor = (gravidade: string) => {
    switch (gravidade) {
      case 'critica': return '#d32f2f'
      case 'maior': return '#f57c00'
      case 'menor': return '#fbc02d'
      default: return '#7b8fa3'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberta': return '#d32f2f'
      case 'em_analise': return '#f57c00'
      case 'em_correcao': return '#1976d2'
      case 'em_verificacao': return '#7b1fa2'
      case 'fechada': return '#388e3c'
      default: return '#7b8fa3'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'aberta': 'Aberta',
      'em_analise': 'Em Análise',
      'em_correcao': 'Em Correção',
      'em_verificacao': 'Em Verificação',
      'fechada': 'Fechada',
    }
    return labels[status] || status
  }

  const getGravidadeLabel = (gravidade: string) => {
    const labels: Record<string, string> = {
      'observacao': 'Observação',
      'menor': 'Menor',
      'maior': 'Maior',
      'critica': 'Crítica',
    }
    return labels[gravidade] || gravidade
  }

  return (
    <section className="sec">
      <div className="sec-head">
        <div>
          <div className="no">SEC · 03 · RNC</div>
          <h1>Não-Conformidades</h1>
          <p className="lede">Gerencie as não-conformidades identificadas nas inspeções.</p>
        </div>
        <HalstenButton variant="primary" onClick={() => onNavigate?.('nova-rnc')}>+ Nova RNC</HalstenButton>
      </div>

      <div className="pill-seg" style={{ marginBottom: 24, flexWrap: 'wrap' }}>
        {['todos', 'aberta', 'em_analise', 'em_correcao', 'em_verificacao', 'fechada'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={filterStatus === status ? 'on' : ''}
          >
            {status === 'todos' ? 'Todos' : getStatusLabel(status)}
          </button>
        ))}
      </div>

      {/* RNC List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
        {filteredRncs.length === 0 ? (
          <HalstenCard>
            <div style={{ padding: 'var(--sp-8)', textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: 0 }}>
                Nenhuma não-conformidade encontrada
              </p>
            </div>
          </HalstenCard>
        ) : (
          filteredRncs.map(rnc => (
            <HalstenCard key={rnc.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--sp-4)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center', marginBottom: 'var(--sp-3)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>
                      {rnc.id}
                    </div>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '0 var(--sp-2)',
                        background: getGravidadeColor(rnc.gravidade),
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: 700,
                        borderRadius: 0,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {getGravidadeLabel(rnc.gravidade)}
                    </div>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '0 var(--sp-2)',
                        background: getStatusColor(rnc.status),
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: 700,
                        borderRadius: 0,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {getStatusLabel(rnc.status)}
                    </div>
                  </div>

                  <div style={{ marginBottom: 'var(--sp-3)' }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', margin: '0 0 var(--sp-2) 0' }}>
                      {rnc.descricao}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--sp-4)', fontSize: 12 }}>
                    <div>
                      <span style={{ color: 'var(--ink-2)', fontWeight: 600 }}>Empreendimento:</span>
                      <div style={{ color: 'var(--ink)', marginTop: '2px' }}>{rnc.empreendimento}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--ink-2)', fontWeight: 600 }}>Serviço:</span>
                      <div style={{ color: 'var(--ink)', marginTop: '2px' }}>{rnc.servico}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--ink-2)', fontWeight: 600 }}>Responsável:</span>
                      <div style={{ color: 'var(--ink)', marginTop: '2px' }}>{rnc.responsavel}</div>
                    </div>
                  </div>

                  {rnc.fvsId && (
                    <div style={{ marginTop: 'var(--sp-3)', padding: 'var(--sp-3)', background: 'var(--bg-2)', borderRadius: 0, fontSize: 12 }}>
                      <span style={{ color: 'var(--ink-2)', fontWeight: 600 }}>FVS Vinculada:</span>
                      <div style={{ color: 'var(--ink)', marginTop: '2px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{rnc.fvsId}</div>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)', marginTop: 'var(--sp-3)', fontSize: 12 }}>
                    <div>
                      <span style={{ color: 'var(--ink-2)', fontWeight: 600 }}>Abertura:</span>
                      <div style={{ color: 'var(--ink)', marginTop: '2px' }}>{rnc.abertura}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--ink-2)', fontWeight: 600 }}>Prazo:</span>
                      <div style={{ color: 'var(--ink)', marginTop: '2px' }}>{rnc.prazo}</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                  <button
                    onClick={() => onNavigate?.('editar-rnc', { rncId: rnc.id })}
                    style={{
                      padding: 'var(--sp-2) var(--sp-3)',
                      background: 'var(--bg-2)',
                      color: 'var(--ink)',
                      border: 'none',
                      borderRadius: 0,
                      fontSize: 12,
                      cursor: 'pointer',
                      fontWeight: 600,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-1)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-2)')}
                  >
                    ✏️ Editar
                  </button>
                  {rnc.fvsId && (
                    <button
                      onClick={() => onNavigate?.('fvs')}
                      style={{
                        padding: 'var(--sp-2) var(--sp-3)',
                        background: 'var(--bg-2)',
                        color: 'var(--ink)',
                        border: 'none',
                        borderRadius: 0,
                        fontSize: 12,
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-1)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-2)')}
                    >
                      📋 Ver FVS
                    </button>
                  )}
                </div>
              </div>
            </HalstenCard>
          ))
        )}
      </div>
    </section>
  )
}
