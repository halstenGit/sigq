import { FormEvent, useState } from 'react'

interface EmpreendimentoFormProps {
  onSubmit: (data: any) => void
  isLoading?: boolean
}

export function EmpreendimentoForm({ onSubmit, isLoading = false }: EmpreendimentoFormProps) {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [localizacao, setLocalizacao] = useState('')
  const [idSienge, setIdSienge] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!nome.trim()) {
      alert('O nome é obrigatório')
      return
    }
    onSubmit({
      nome: nome.trim(),
      descricao: descricao.trim() || undefined,
      localizacao: localizacao.trim() || undefined,
      id_sienge: idSienge.trim() || undefined,
    })
    setNome('')
    setDescricao('')
    setLocalizacao('')
    setIdSienge('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome *
        </label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do empreendimento"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição do empreendimento"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Localização
          </label>
          <input
            type="text"
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
            placeholder="Ex: Joinville, SC"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Sienge
          </label>
          <input
            type="text"
            value={idSienge}
            onChange={(e) => setIdSienge(e.target.value)}
            placeholder="ID do Sienge"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isLoading}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition"
      >
        {isLoading ? 'Salvando...' : 'Salvar Empreendimento'}
      </button>
    </form>
  )
}
