import { useState } from 'react'
import { HalstenButton } from '../components/HalstenButton'
import { HalstenCard } from '../components/HalstenCard'
import { HalstenInput } from '../components/HalstenInput'
import { HalstenSelect } from '../components/HalstenSelect'
import { useRnc } from '../contexts/RncContext'
import { useFvs } from '../contexts/FvsContext'
import { EMPREENDIMENTOS } from '../data/mockData'

interface NovaRncProps {
  fvsId?: string
  empreendimento?: string
  servico?: string
  onSuccess?: () => void
  onCancel?: () => void
}

interface FormData {
  empreendimento: string
  servico: string
  descricao: string
  gravidade: string
  responsavel: string
  abertura: string
  prazo: string
}

export function NovaRnc({ fvsId, empreendimento, servico, onSuccess, onCancel }: NovaRncProps) {
  const { addRnc } = useRnc()
  const { updateFvs } = useFvs()

  const [formData, setFormData] = useState<FormData>({
    empreendimento: empreendimento || '',
    servico: servico || '',
    descricao: '',
    gravidade: 'menor',
    responsavel: '',
    abertura: new Date().toLocaleDateString('pt-BR'),
    prazo: '',
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const gravidades = [
    { value: 'observacao', label: 'Observação' },
    { value: 'menor', label: 'Menor' },
    { value: 'maior', label: 'Maior' },
    { value: 'critica', label: 'Crítica' },
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
      addRnc({
        empreendimento: formData.empreendimento,
        servico: formData.servico,
        descricao: formData.descricao,
        gravidade: formData.gravidade as 'observacao' | 'menor' | 'maior' | 'critica',
        status: 'aberta',
        responsavel: formData.responsavel,
        abertura: formData.abertura,
        prazo: formData.prazo,
        fvsId: fvsId,
      })

      if (fvsId) {
        updateFvs(fvsId, { status: 'com_nc' })
      }

      setSuccess(true)
      setLoading(false)

      setTimeout(() => {
        setSuccess(false)
        onSuccess?.()
      }, 2000)
    }, 1000)
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'var(--sp-6)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-8)' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
          Registrar Não-Conformidade (RNC)
        </h1>
        <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 'var(--sp-1) 0 0 0' }}>
          Crie um novo registro de não-conformidade
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
            <div style={{ fontWeight: 600, color: 'var(--ink)' }}>RNC criada com sucesso!</div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>A não-conformidade foi registrada</div>
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
              placeholder="Descreva a não-conformidade encontrada..."
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
            <HalstenSelect
              label="Gravidade"
              name="gravidade"
              value={formData.gravidade}
              onChange={handleChange}
              options={gravidades}
              required
            />
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
              {loading ? 'Salvando...' : 'Criar RNC'}
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
