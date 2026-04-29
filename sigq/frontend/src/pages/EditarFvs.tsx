import { useState, useEffect } from 'react'
import { HalstenButton } from '../components/HalstenButton'
import { HalstenCard } from '../components/HalstenCard'
import { HalstenInput } from '../components/HalstenInput'
import { HalstenSelect } from '../components/HalstenSelect'
import { EMPREENDIMENTOS, FVS_LIST } from '../data/mockData'
import { useFvs } from '../contexts/FvsContext'

interface EditarFvsProps {
  fvsId: string
  onSuccess?: () => void
  onCancel?: () => void
}

interface FormData {
  nome: string
  tipoChecklist: string
  empreendimento: string
  local: string
  pavimento: string
  unidade: string
  servico: string
  nota: number
  dataRealizacao: string
  inspetor: string
  empreiteira: string
  observacoes: string
  fotos: File[]
}

export function EditarFvs({ fvsId, onSuccess, onCancel }: EditarFvsProps) {
  const { updateFvs, getFvsById } = useFvs()

  const [formData, setFormData] = useState<FormData>({
    nome: '',
    tipoChecklist: '',
    empreendimento: '',
    local: '',
    pavimento: '',
    unidade: '',
    servico: '',
    nota: 5,
    dataRealizacao: '',
    inspetor: '',
    empreiteira: '',
    observacoes: '',
    fotos: [],
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!fvsId) {
      setError('ID da FVS não fornecido')
      return
    }

    // Busca primeiro no contexto (FVS criadas)
    let fvsData = getFvsById(fvsId)

    // Se não encontrar, busca no mockData (FVS de exemplo)
    if (!fvsData) {
      fvsData = FVS_LIST.find(f => f.id === fvsId)
    }

    if (fvsData) {
      setFormData({
        nome: fvsData.nome || '',
        tipoChecklist: fvsData.tipoChecklist || '',
        empreendimento: fvsData.empreendimento || '',
        local: fvsData.local || '',
        pavimento: fvsData.pavimento || '',
        unidade: fvsData.unidade || '',
        servico: fvsData.servico || '',
        nota: fvsData.nota || 5,
        dataRealizacao: fvsData.dataRealizacao || '',
        inspetor: fvsData.inspetor || '',
        empreiteira: fvsData.empreiteira || '',
        observacoes: fvsData.observacoes || '',
        fotos: [],
      })
      setError('')
    } else {
      setError('FVS não encontrada')
    }
  }, [fvsId, getFvsById])

  const tiposChecklist = [
    { value: 'servico', label: 'Serviço' },
    { value: 'material', label: 'Material' },
    { value: 'equipamento', label: 'Equipamento' },
    { value: 'colaborador', label: 'Colaborador' },
  ]
  const servicos = [
    { value: 'estrutura', label: 'Estrutura' },
    { value: 'alvenaria', label: 'Alvenaria' },
    { value: 'revestimento', label: 'Revestimento Cerâmico' },
    { value: 'pintura', label: 'Pintura' },
    { value: 'impermeabilizacao', label: 'Impermeabilização' },
  ]
  const pavimentos = [
    { value: 'fundacao', label: 'Fundação' },
    { value: 'subsolo', label: 'Subsolo' },
    { value: '1o', label: '1º Pavimento' },
    { value: '2o', label: '2º Pavimento' },
    { value: '3o', label: '3º Pavimento' },
    { value: 'cobertura', label: 'Cobertura' },
  ]
  const inspetores = [
    { value: 'amanda', label: 'Amanda Costa' },
    { value: 'francisco', label: 'Francisco Neto' },
    { value: 'marcelo', label: 'Marcelo Sena' },
    { value: 'joao', label: 'João Silva' },
  ]
  const empreiteiras = [
    { value: 'alfa', label: 'Construtora Alfa' },
    { value: 'soar', label: 'SOAR OBRAS LTDA' },
    { value: 'beta', label: 'Empreiteira Beta' },
    { value: 'gama', label: 'Obras Gama' },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'nota') {
      setFormData(prev => ({ ...prev, [name]: Math.min(10, Math.max(0, Number(value))) }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        fotos: [...prev.fotos, ...Array.from(e.target.files || [])],
      }))
    }
  }

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      updateFvs(fvsId, {
        empreendimento: formData.empreendimento,
        local: formData.local,
        dataRealizacao: formData.dataRealizacao,
        servico: formData.servico,
        pavimento: formData.pavimento,
        unidade: formData.unidade,
        inspetor: formData.inspetor,
        empreiteira: formData.empreiteira,
        nota: formData.nota,
        observacoes: formData.observacoes,
        nome: formData.nome || undefined,
        tipoChecklist: formData.tipoChecklist || undefined,
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
      <section className="sec" style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="state err">
          <div className="gl">!</div>
          <div className="hd">{error}</div>
        </div>
      </section>
    )
  }

  return (
    <section className="sec" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="sec-head">
        <div>
          <div className="no">SEC · 02 · EDITAR FVS</div>
          <h1>Editar Ficha de Verificação</h1>
          <p className="lede">Atualize os dados da FVS #{fvsId}.</p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div
          style={{
            marginBottom: 'var(--sp-6)',
            padding: 'var(--sp-4)',
            background: '#e8f5e9',
            border: `1px solid var(--ok)`,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--sp-3)',
          }}
        >
          <span style={{ fontSize: 20 }}>✅</span>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--ink)' }}>FVS atualizada com sucesso!</div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>As alterações foram salvas</div>
          </div>
        </div>
      )}

      {/* Form Card */}
      <HalstenCard>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
          {/* Identificação */}
          <div style={{ paddingBottom: 'var(--sp-6)', borderBottom: `1px solid var(--bg-2)` }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', margin: 0, marginBottom: 'var(--sp-6)' }}>
              📋 Identificação
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
              <HalstenInput
                label="Nome da FVS"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
              />
              <HalstenSelect
                label="Tipo de Checklist"
                name="tipoChecklist"
                value={formData.tipoChecklist}
                onChange={handleChange}
                options={tiposChecklist}
              />
            </div>
          </div>

          {/* Localização */}
          <div style={{ paddingBottom: 'var(--sp-6)', borderBottom: `1px solid var(--bg-2)` }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', margin: 0, marginBottom: 'var(--sp-6)' }}>
              📍 Localização
            </h2>
            <HalstenSelect
              label="Empreendimento"
              name="empreendimento"
              value={formData.empreendimento}
              onChange={handleChange}
              options={EMPREENDIMENTOS.map(e => ({ value: e.nome, label: e.nome }))}
              required
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)', marginTop: 'var(--sp-4)' }}>
              <HalstenInput
                label="Local Específico"
                name="local"
                value={formData.local}
                onChange={handleChange}
                required
              />
              <HalstenSelect
                label="Pavimento"
                name="pavimento"
                value={formData.pavimento}
                onChange={handleChange}
                options={pavimentos}
                required
              />
            </div>
            <HalstenInput
              label="Unidade"
              name="unidade"
              value={formData.unidade}
              onChange={handleChange}
              style={{ marginTop: 'var(--sp-4)' }}
            />
          </div>

          {/* Serviço */}
          <div style={{ paddingBottom: 'var(--sp-6)', borderBottom: `1px solid var(--bg-2)` }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', margin: 0, marginBottom: 'var(--sp-6)' }}>
              🔨 Serviço
            </h2>
            <HalstenSelect
              label="Serviço"
              name="servico"
              value={formData.servico}
              onChange={handleChange}
              options={servicos}
              required
            />
          </div>

          {/* Avaliação */}
          <div style={{ paddingBottom: 'var(--sp-6)', borderBottom: `1px solid var(--bg-2)` }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', margin: 0, marginBottom: 'var(--sp-6)' }}>
              ⭐ Avaliação
            </h2>
            <div style={{ marginBottom: 'var(--sp-4)' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--ink)',
                  marginBottom: 'var(--sp-2)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Nota (0-10) *
              </label>
              <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}>
                <input
                  type="range"
                  name="nota"
                  min="0"
                  max="10"
                  value={formData.nota}
                  onChange={handleChange}
                  style={{
                    flex: 1,
                    cursor: 'pointer',
                    height: 6,
                    borderRadius: 3,
                    background: 'var(--bg-2)',
                    outline: 'none',
                  }}
                />
                <div
                  style={{
                    width: 50,
                    padding: 'var(--sp-2)',
                    background: 'var(--ink)',
                    color: '#fff',
                    borderRadius: 4,
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {formData.nota}
                </div>
              </div>
            </div>
          </div>

          {/* Datas e Responsáveis */}
          <div style={{ paddingBottom: 'var(--sp-6)', borderBottom: `1px solid var(--bg-2)` }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', margin: 0, marginBottom: 'var(--sp-6)' }}>
              📅 Datas e Responsáveis
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
              <HalstenInput
                label="Data de Realização"
                type="date"
                name="dataRealizacao"
                value={formData.dataRealizacao}
                onChange={handleChange}
                required
              />
              <HalstenSelect
                label="Inspetor"
                name="inspetor"
                value={formData.inspetor}
                onChange={handleChange}
                options={inspetores}
                required
              />
            </div>
            <HalstenSelect
              label="Empreiteira"
              name="empreiteira"
              value={formData.empreiteira}
              onChange={handleChange}
              options={empreiteiras}
              required
              style={{ marginTop: 'var(--sp-4)' }}
            />
          </div>

          {/* Observações */}
          <div style={{ paddingBottom: 'var(--sp-6)', borderBottom: `1px solid var(--bg-2)` }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', margin: 0, marginBottom: 'var(--sp-6)' }}>
              📝 Observações
            </h2>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              placeholder="Adicione observações sobre a FVS..."
              style={{
                width: '100%',
                padding: 'var(--sp-3)',
                border: `1px solid var(--bg-2)`,
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
              {loading ? '⏳ Salvando...' : '✅ Salvar Alterações'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: 'var(--sp-3)',
                background: 'var(--bg-2)',
                color: 'var(--ink)',
                border: `1px solid var(--bg-2)`,
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
    </section>
  )
}
