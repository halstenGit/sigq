import { useState } from 'react'
import { Card } from '../components/Card'
import { HalstenButton } from '../components/HalstenButton'
import { HalstenCard } from '../components/HalstenCard'
import { EMPREENDIMENTOS } from '../data/mockData'
import { useFvs } from '../contexts/FvsContext'

interface NovaFvsProps {
  onSuccess?: () => void
}

interface FormData {
  nome: string
  tipoChecklist: string
  identificador: string
  empreendimento: string
  local: string
  localAvaliado: string
  classificacaoLocal: string
  pavimento: string
  unidade: string
  servico: string
  servicoAvaliado: string
  colaboradorAvaliado: string
  equipamentoAvaliado: string
  insumoAvaliado: string
  nota: number
  dataRealizacao: string
  dataValidade: string
  dataAtendimento: string
  inspetor: string
  empreiteira: string
  usuarioResponsavelVerificacao: string
  dscRevisao: string
  observacoes: string
  fotos: File[]
}

export function NovaFvs({ onSuccess }: NovaFvsProps) {
  const { addFvs } = useFvs()
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    tipoChecklist: '',
    identificador: '',
    empreendimento: '',
    local: '',
    localAvaliado: '',
    classificacaoLocal: '',
    pavimento: '',
    unidade: '',
    servico: '',
    servicoAvaliado: '',
    colaboradorAvaliado: '',
    equipamentoAvaliado: '',
    insumoAvaliado: '',
    nota: 5,
    dataRealizacao: '',
    dataValidade: '',
    dataAtendimento: '',
    inspetor: '',
    empreiteira: '',
    usuarioResponsavelVerificacao: '',
    dscRevisao: '',
    observacoes: '',
    fotos: [],
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const tiposChecklist = ['Serviço', 'Material', 'Equipamento', 'Colaborador']
  const classificacoesLocal = ['Estrutural', 'Vedação', 'Acabamento', 'Instalações']
  const servicos = [
    'Estrutura',
    'Alvenaria',
    'Revestimento Cerâmico',
    'Pintura',
    'Impermeabilização',
    'Contrapiso',
    'Piso',
    'Forro',
    'Vidros',
  ]
  const pavimentos = [
    'Fundação',
    'Subsolo',
    '1º Pavimento',
    '2º Pavimento',
    '3º Pavimento',
    '4º Pavimento',
    '5º Pavimento',
    'Cobertura',
  ]
  const inspetores = ['Amanda Costa', 'Francisco Neto', 'Marcelo Sena', 'João Silva']
  const empreiteiras = ['Construtora Alfa', 'SOAR OBRAS LTDA', 'Empreiteira Beta', 'Obras Gama']

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
        identificador: formData.identificador || undefined,
        localAvaliado: formData.localAvaliado || undefined,
        classificacaoLocal: formData.classificacaoLocal || undefined,
        colaboradorAvaliado: formData.colaboradorAvaliado || undefined,
        equipamentoAvaliado: formData.equipamentoAvaliado || undefined,
        servicoAvaliado: formData.servicoAvaliado || undefined,
        insumoAvaliado: formData.insumoAvaliado || undefined,
        dataValidade: formData.dataValidade || undefined,
        dataAtendimento: formData.dataAtendimento || undefined,
        dscRevisao: formData.dscRevisao || undefined,
        usuarioResponsavelVerificacao: formData.usuarioResponsavelVerificacao || undefined,
      })

      setSuccess(true)
      setLoading(false)
      setFormData({
        nome: '',
        tipoChecklist: '',
        identificador: '',
        empreendimento: '',
        local: '',
        localAvaliado: '',
        classificacaoLocal: '',
        pavimento: '',
        unidade: '',
        servico: '',
        servicoAvaliado: '',
        colaboradorAvaliado: '',
        equipamentoAvaliado: '',
        insumoAvaliado: '',
        nota: 5,
        dataRealizacao: '',
        dataValidade: '',
        dataAtendimento: '',
        inspetor: '',
        empreiteira: '',
        usuarioResponsavelVerificacao: '',
        dscRevisao: '',
        observacoes: '',
        fotos: [],
      })

      setTimeout(() => {
        setSuccess(false)
        onSuccess?.()
      }, 2000)
    }, 1000)
  }

  const renderField = (label: string, name: string, type: 'text' | 'date' | 'select' | 'textarea', options?: string[], required = false) => {
    const value = formData[name as keyof FormData]
    const isText = typeof value === 'string'
    const hasValue = isText ? value.trim() !== '' : value

    return (
      <div style={{ marginBottom: 24 }}>
        <label
          style={{
            display: 'block',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--hs-text-primary)',
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {label} {required && '*'}
        </label>
        {type === 'select' ? (
          <select
            name={name}
            value={isText ? (value as string) : ''}
            onChange={handleChange}
            required={required}
            style={{
              width: '100%',
              padding: '12px 14px',
              border: `1.5px solid ${hasValue ? 'var(--hs-text-primary)' : 'var(--hs-border)'}`,
              borderRadius: 8,
              fontSize: 14,
              color: 'var(--hs-text-primary)',
              background: 'var(--hs-surface)',
              cursor: 'pointer',
              transition: 'border .15s',
              fontFamily: 'inherit',
            }}
            onFocus={e => {
              (e.target as HTMLElement).style.borderColor = 'var(--hs-text-primary)'
            }}
            onBlur={e => {
              (e.target as HTMLElement).style.borderColor = hasValue ? 'var(--hs-text-primary)' : 'var(--hs-border)'
            }}
          >
            <option value="">Selecione</option>
            {options?.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            name={name}
            value={isText ? (value as string) : ''}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px 14px',
              border: `1.5px solid ${'var(--hs-border)'}`,
              borderRadius: 8,
              fontSize: 14,
              color: 'var(--hs-text-primary)',
              background: 'var(--hs-surface)',
              fontFamily: 'inherit',
              resize: 'vertical',
              minHeight: 80,
            }}
            onFocus={e => {
              (e.target as HTMLElement).style.borderColor = 'var(--hs-text-primary)'
            }}
            onBlur={e => {
              (e.target as HTMLElement).style.borderColor = 'var(--hs-border)'
            }}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={isText ? (value as string) : ''}
            onChange={handleChange}
            required={required}
            style={{
              width: '100%',
              padding: '12px 14px',
              border: `1.5px solid ${hasValue ? 'var(--hs-text-primary)' : 'var(--hs-border)'}`,
              borderRadius: 8,
              fontSize: 14,
              color: 'var(--hs-text-primary)',
              background: 'var(--hs-surface)',
              fontFamily: 'inherit',
            }}
            onFocus={e => {
              (e.target as HTMLElement).style.borderColor = 'var(--hs-text-primary)'
            }}
            onBlur={e => {
              (e.target as HTMLElement).style.borderColor = hasValue ? 'var(--hs-text-primary)' : 'var(--hs-border)'
            }}
          />
        )}
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--hs-text-primary)' }}>
          Nova Ficha de Verificação (FVS)
        </div>
        <div style={{ fontSize: 13, color: 'var(--hs-text-tertiary)', marginTop: 2 }}>
          Preencha os dados abaixo para registrar uma nova FVS alinhada com o Mobuss
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <Card
          borderColor={'var(--hs-success)'}
          padding="16px"
          style={{ marginBottom: 24, background: '#e8f5e9', borderLeft: `4px solid ${'var(--hs-success)'}` }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--hs-text-primary)' }}>FVS criada com sucesso!</div>
              <div style={{ fontSize: 12, color: 'var(--hs-text-tertiary)', marginTop: 2 }}>
                Você pode visualizá-la na listagem de FVS
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Form Card */}
      <Card borderColor={'var(--hs-text-primary)'} padding="32px">
        <form onSubmit={handleSubmit}>
          {/* Seção 1: Identificação */}
          <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: `2px solid ${'var(--hs-border)'}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--hs-text-primary)', marginBottom: 16 }}>
              📋 Identificação
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
              <div>{renderField('Nome da FVS', 'nome', 'text')}</div>
              <div>{renderField('Tipo de Checklist', 'tipoChecklist', 'select', tiposChecklist)}</div>
            </div>
            <div>{renderField('Código Identificador', 'identificador', 'text')}</div>
            <div>{renderField('Empreendimento', 'empreendimento', 'select', EMPREENDIMENTOS.map(e => e.nome), true)}</div>
          </div>

          {/* Seção 2: Localização */}
          <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: `2px solid ${'var(--hs-border)'}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--hs-text-primary)', marginBottom: 16 }}>
              📍 Localização
            </div>
            <div style={{ marginBottom: 24 }}>
              {renderField('Local Específico', 'local', 'text', undefined, true)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
              <div>{renderField('Local Avaliado', 'localAvaliado', 'text')}</div>
              <div>{renderField('Classificação Local', 'classificacaoLocal', 'select', classificacoesLocal)}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>{renderField('Pavimento', 'pavimento', 'select', pavimentos, true)}</div>
              <div>{renderField('Unidade', 'unidade', 'text')}</div>
            </div>
          </div>

          {/* Seção 3: Serviço e Avaliação */}
          <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: `2px solid ${'var(--hs-border)'}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--hs-text-primary)', marginBottom: 16 }}>
              🔨 Serviço e Avaliação
            </div>
            <div style={{ marginBottom: 24 }}>
              {renderField('Serviço', 'servico', 'select', servicos, true)}
            </div>
            <div style={{ marginBottom: 24 }}>
              {renderField('Serviço Avaliado (Detalhe)', 'servicoAvaliado', 'text')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
              <div>{renderField('Colaborador Avaliado', 'colaboradorAvaliado', 'text')}</div>
              <div>{renderField('Equipamento Avaliado', 'equipamentoAvaliado', 'text')}</div>
            </div>
            <div style={{ marginBottom: 24 }}>
              {renderField('Insumo/Material Avaliado', 'insumoAvaliado', 'text')}
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--hs-text-primary)',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Nota (0-10) *
              </label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
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
                    background: 'var(--hs-border)',
                    outline: 'none',
                  }}
                />
                <div
                  style={{
                    width: 50,
                    padding: '8px 12px',
                    background: 'var(--hs-text-primary)',
                    color: '#fff',
                    borderRadius: 6,
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

          {/* Seção 4: Datas e Responsáveis */}
          <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: `2px solid ${'var(--hs-border)'}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--hs-text-primary)', marginBottom: 16 }}>
              📅 Datas e Responsáveis
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
              <div>{renderField('Data de Realização', 'dataRealizacao', 'date', undefined, true)}</div>
              <div>{renderField('Data de Validade', 'dataValidade', 'date')}</div>
            </div>
            <div style={{ marginBottom: 24 }}>
              {renderField('Data de Atendimento', 'dataAtendimento', 'date')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
              <div>{renderField('Inspetor', 'inspetor', 'select', inspetores, true)}</div>
              <div>{renderField('Empreiteira', 'empreiteira', 'select', empreiteiras, true)}</div>
            </div>
            <div>
              {renderField('Responsável Verificação', 'usuarioResponsavelVerificacao', 'text')}
            </div>
          </div>

          {/* Seção 5: Revisão e Documentação */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--hs-text-primary)', marginBottom: 16 }}>
              📝 Revisão e Documentação
            </div>

            <div style={{ marginBottom: 24 }}>
              {renderField('Descrição da Revisão', 'dscRevisao', 'textarea')}
            </div>

            <div style={{ marginBottom: 24 }}>
              {renderField('Observações', 'observacoes', 'textarea')}
            </div>

            {/* Upload de Fotos */}
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--hs-text-primary)',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                📸 Fotos (opcional)
              </label>
              <div
                style={{
                  border: `2px dashed ${'var(--hs-text-primary)'}`,
                  borderRadius: 8,
                  padding: '24px',
                  textAlign: 'center',
                  background: 'var(--hs-surface-alt)',
                  cursor: 'pointer',
                  transition: 'all .15s',
                }}
                onDragOver={e => {
                  e.preventDefault()
                  ;(e.currentTarget as HTMLElement).style.background = 'var(--hs-border)'
                }}
                onDragLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--hs-surface-alt)'
                }}
                onDrop={e => {
                  e.preventDefault()
                  ;(e.currentTarget as HTMLElement).style.background = 'var(--hs-surface-alt)'
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
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--hs-text-primary)', marginBottom: 4 }}>
                    Clique ou arraste fotos aqui
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--hs-text-tertiary)' }}>PNG, JPG até 10MB cada</div>
                </label>
              </div>

              {/* Fotos Carregadas */}
              {formData.fotos.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--hs-text-primary)', marginBottom: 12 }}>
                    {formData.fotos.length} foto{formData.fotos.length !== 1 ? 's' : ''} carregada{formData.fotos.length !== 1 ? 's' : ''}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12 }}>
                    {formData.fotos.map((file, index) => (
                      <div
                        key={index}
                        style={{
                          position: 'relative',
                          background: 'var(--hs-surface-alt)',
                          borderRadius: 8,
                          padding: '8px',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: 32, marginBottom: 4 }}>🖼️</div>
                        <div style={{ fontSize: 11, color: 'var(--hs-text-tertiary)', wordBreak: 'break-all', marginBottom: 8 }}>
                          {file.name.substring(0, 20)}...
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          style={{
                            padding: '4px 8px',
                            background: 'var(--hs-error)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 4,
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
          </div>

          {/* Info Box */}
          <Card
            borderColor={'var(--hs-border)'}
            padding="16px"
            style={{
              marginBottom: 24,
              background: 'var(--hs-surface-alt)',
              borderLeft: `4px solid ${colors.info}`,
            }}
          >
            <div style={{ fontSize: 12, color: 'var(--hs-text-primary)' }}>
              <strong>ℹ️ Dica:</strong> Todos os campos marcados com * são obrigatórios. A FVS será criada em status "Rascunho" e poderá ser visualizada na listagem.
            </div>
          </Card>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: 'var(--hs-text-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background .15s',
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={e => {
                if (!loading) (e.target as HTMLElement).style.background = 'var(--hs-text-primary)'
              }}
              onMouseLeave={e => {
                if (!loading) (e.target as HTMLElement).style.background = 'var(--hs-text-primary)'
              }}
            >
              {loading ? '⏳ Criando...' : '✅ Criar FVS'}
            </button>
            <button
              type="reset"
              style={{
                padding: '12px 20px',
                background: 'var(--hs-border)',
                color: 'var(--hs-text-primary)',
                border: `1.5px solid ${'var(--hs-border)'}`,
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all .15s',
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.background = 'var(--hs-surface-alt)'
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.background = 'var(--hs-border)'
              }}
            >
              Limpar
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}
