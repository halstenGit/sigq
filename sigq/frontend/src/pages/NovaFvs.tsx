import { useState } from 'react'
import { HalstenButton } from '../components/HalstenButton'
import { HalstenCard } from '../components/HalstenCard'
import { HalstenInput } from '../components/HalstenInput'
import { HalstenSelect } from '../components/HalstenSelect'
import { EMPREENDIMENTOS } from '../data/mockData'
import { useFvs } from '../contexts/FvsContext'

interface NovaFvsProps {
  onSuccess?: () => void
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

export function NovaFvs({ onSuccess }: NovaFvsProps) {
  const { addFvs } = useFvs()
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

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

      // Upload fotos
      for (const foto of formData.fotos) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', foto)

        const response = await fetch(`${apiUrl}/v1/evidencias/upload`, {
          method: 'POST',
          body: uploadFormData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Erro ao fazer upload da foto: ${response.statusText}`)
        }
      }

      // Criar FVS após upload das fotos
      addFvs({
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
      setFormData({
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

      setTimeout(() => {
        setSuccess(false)
        onSuccess?.()
        setLoading(false)
      }, 2000)
    } catch (error) {
      console.error('Erro ao criar FVS:', error)
      setLoading(false)
      alert(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }

  return (
    <section className="sec" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="sec-head">
        <div>
          <div className="no">SEC · 02 · NOVA FVS</div>
          <h1>Nova Ficha de Verificação</h1>
          <p className="lede">Preencha os dados para registrar uma nova FVS.</p>
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
            <div style={{ fontWeight: 600, color: 'var(--ink)' }}>FVS criada com sucesso!</div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>Você pode visualizá-la na listagem de FVS</div>
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

          {/* Fotos */}
          <div style={{ paddingBottom: 'var(--sp-6)', borderBottom: `1px solid var(--bg-2)` }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', margin: 0, marginBottom: 'var(--sp-6)' }}>
              📸 Fotos (opcional)
            </h2>
            <div
              style={{
                border: `2px dashed var(--bg-2)`,
                borderRadius: 4,
                padding: 'var(--sp-6)',
                textAlign: 'center',
                background: 'var(--bg-1)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onDragOver={e => {
                e.preventDefault();
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--ink)'
              }}
              onDragLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--bg-2)'
              }}
              onDrop={e => {
                e.preventDefault();
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--bg-2)'
                if (e.dataTransfer.files) {
                  setFormData(prev => ({
                    ...prev,
                    fotos: [...prev.fotos, ...Array.from(e.dataTransfer.files)],
                  }))
                }
              }}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-input"
              />
              <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: 32, marginBottom: 'var(--sp-3)' }}>📷</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-1)' }}>
                  Clique ou arraste fotos aqui
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>PNG, JPG até 10MB cada</div>
              </label>
            </div>

            {formData.fotos.length > 0 && (
              <div style={{ marginTop: 'var(--sp-4)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-3)' }}>
                  {formData.fotos.length} foto{formData.fotos.length !== 1 ? 's' : ''} carregada{formData.fotos.length !== 1 ? 's' : ''}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 'var(--sp-3)' }}>
                  {formData.fotos.map((file, index) => (
                    <div
                      key={index}
                      style={{
                        position: 'relative',
                        background: 'var(--bg-1)',
                        borderRadius: 4,
                        padding: 'var(--sp-2)',
                        textAlign: 'center',
                        border: `1px solid var(--bg-2)`,
                      }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 'var(--sp-2)' }}>🖼️</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-2)', wordBreak: 'break-all', marginBottom: 'var(--sp-2)' }}>
                        {file.name.substring(0, 15)}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        style={{
                          padding: '4px 8px',
                          background: 'var(--bad)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 3,
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              {loading ? '⏳ Criando...' : '✅ Criar FVS'}
            </button>
            <button
              type="reset"
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
              Limpar
            </button>
          </div>
        </form>
      </HalstenCard>
    </section>
  )
}
