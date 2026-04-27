import { useState, useEffect } from 'react'
import { HalstenCard } from '../components/HalstenCard'
import { HalstenInput } from '../components/HalstenInput'
import { HalstenSelect } from '../components/HalstenSelect'
import { useRnc } from '../contexts/RncContext'
import { RNC_LIST } from '../data/mockData'
import { EMPREENDIMENTOS } from '../data/mockData'

interface EditarRncProps {
  rncId: string
  onSuccess?: () => void
  onCancel?: () => void
}

interface FormData {
  empreendimento: string
  servico: string
  descricao: string
  gravidade: string
  responsavel: string
  status: string
  abertura: string
  prazo: string
}

export function EditarRnc({ rncId, onSuccess, onCancel }: EditarRncProps) {
  const { updateRnc, getRncById } = useRnc()

  const [formData, setFormData] = useState<FormData>({
    empreendimento: '',
    servico: '',
    descricao: '',
    gravidade: 'menor',
    responsavel: '',
    status: 'aberta',
    abertura: '',
    prazo: '',
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!rncId) {
      setError('ID da RNC não fornecido')
      return
    }

    let rncData = getRncById(rncId)

    if (!rncData) {
      rncData = RNC_LIST.find(r => r.id === rncId)
    }

    if (rncData) {
      setFormData({
        empreendimento: rncData.empreendimento || '',
        servico: rncData.servico || '',
        descricao: rncData.descricao || '',
        gravidade: rncData.gravidade || 'menor',
        responsavel: rncData.responsavel || '',
        status: rncData.status || 'aberta',
        abertura: rncData.abertura || '',
        prazo: rncData.prazo || '',
      })
      setError('')
    } else {
      setError('RNC não encontrada')
    }
  }, [rncId, getRncById])

  const gravidades = [
    { value: 'observacao', label: 'Observação' },
    { value: 'menor', label: 'Menor' },
    { value: 'maior', label: 'Maior' },
    { value: 'critica', label: 'Crítica' },
  ]

  const statuses = [
    { value: 'aberta', label: 'Aberta' },
    { value: 'em_analise', label: 'Em Análise' },
    { value: 'em_correcao', label: 'Em Correção' },
    { value: 'em_verificacao', label: 'Em Verificação' },
    { value: 'fechada', label: 'Fechada' },
  ]

  const responsaveis = [
    { value: 'amanda', label: 'Amanda Costa' },
    { value: 'francisco', label: 'Francisco Neto' },
    { value: 'marcelo', label: 'Marcelo Sena' },
    { value: 'joao', label: 'João Silva' },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      updateRnc(rncId, {
        empreendimento: formData.empreendimento,
        servico: formData.servico,
        descricao: formData.descricao,
        gravidade: formData.gravidade as 'observacao' | 'menor' | 'maior' | 'critica',
        responsavel: formData.responsavel,
        status: formData.status as 'aberta' | 'em_analise' | 'em_correcao' | 'em_verificacao' | 'fechada',
        abertura: formData.abertura,
        prazo: formData.prazo,
      })

      setSuccess(true)
      setLoading(false)

      setTimeout(() => {
        setSuccess(false)
        onSuccess?.()
      }, 2000)
    }, 1000)
  }

  if (error) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'var(--sp-6)' }}>
        <div
          style={{
            padding: 'var(--sp-4)',
            background: '#ffebee',
            border: '1px solid #f44336',
            borderRadius: 4,
            color: '#c62828',
          }}
        >
          Erro: {error}
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'var(--sp-6)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-8)' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
          Editar Não-Conformidade (RNC)
        </h1>
        <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 'var(--sp-1) 0 0 0' }}>
          Atualize os dados da RNC #{rncId}
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div
          style={{
            marginBottom: 'var(--sp-6)',
            padding: 'var(--sp-4)',
            background: '#e8f5e9',
            border: '1px solid var(--ok)',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--sp-3)',
          }}
        >
          <span style={{ fontSize: 20 }}>✓</span>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--ink)' }}>RNC atualizada com sucesso!</div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>As alterações foram salvas</div>
          </div>
        </div>
      )}

      {/* Form Card */}
      <HalstenCard>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
          {/* Identificação */}
          <div style={{ paddingBottom: 'var(--sp-6)', borderBottom: '1px solid var(--bg-2)' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', margin: 0, marginBottom: 'var(--sp-6)' }}>
              Identificação
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
              <HalstenSelect
                label="Empreendimento"
                name="empreendimento"
                value={formData.empreendimento}
                onChange={handleChange}
                options={EMPREENDIMENTOS.map(e => ({ value: e.nome, label: e.nome }))}
                required
              />
              <HalstenInput
                label="Serviço"
                name="servico"
                value={formData.servico}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Descrição */}
          <div style={{ paddingBottom: 'var(--sp-6)', borderBottom: '1px solid var(--bg-2)' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', margin: 0, marginBottom: 'var(--sp-6)' }}>
              Descrição
            </h2>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva a não-conformidade..."
              required
              style={{
                width: '100%',
                padding: 'var(--sp-3)',
                border: '1px solid var(--bg-2)',
                borderRadius: 4,
                fontSize: 14,
                color: 'var(--ink)',
                background: 'var(--bg)',
                fontFamily: 'var(--font-body)',
                resize: 'vertical',
                minHeight: 100,
              }}
            />
          </div>

          {/* Classificação */}
          <div style={{ paddingBottom: 'var(--sp-6)', borderBottom: '1px solid var(--bg-2)' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', margin: 0, marginBottom: 'var(--sp-6)' }}>
              Classificação
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
              <HalstenSelect
                label="Gravidade"
                name="gravidade"
                value={formData.gravidade}
                onChange={handleChange}
                options={gravidades}
                required
              />
              <HalstenSelect
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={statuses}
                required
              />
            </div>
          </div>

          {/* Responsabilidade */}
          <div style={{ paddingBottom: 'var(--sp-6)', borderBottom: '1px solid var(--bg-2)' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', margin: 0, marginBottom: 'var(--sp-6)' }}>
              Responsabilidade
            </h2>
            <HalstenSelect
              label="Responsável"
              name="responsavel"
              value={formData.responsavel}
              onChange={handleChange}
              options={responsaveis}
              required
            />
          </div>

          {/* Prazos */}
          <div style={{ paddingBottom: 'var(--sp-6)', borderBottom: '1px solid var(--bg-2)' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', margin: 0, marginBottom: 'var(--sp-6)' }}>
              Prazos
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
              <HalstenInput
                label="Data de Abertura"
                type="date"
                name="abertura"
                value={formData.abertura}
                onChange={handleChange}
                required
              />
              <HalstenInput
                label="Prazo para Correção"
                type="date"
                name="prazo"
                value={formData.prazo}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: 'var(--sp-3)',
                background: 'var(--ink)',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.15s',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: 'var(--sp-3)',
                background: 'var(--bg-2)',
                color: 'var(--ink)',
                border: '1px solid var(--bg-2)',
                borderRadius: 4,
                fontSize: 14,
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
              Cancelar
            </button>
          </div>
        </form>
      </HalstenCard>
    </div>
  )
}
