import { Empreendimento } from '@/services/api'

interface EmpreendimentoItemProps {
  empreendimento: Empreendimento
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function EmpreendimentoItem({
  empreendimento,
  onDelete,
  isDeleting = false,
}: EmpreendimentoItemProps) {
  const dataFormatada = new Date(empreendimento.created_at).toLocaleDateString('pt-BR')

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900">{empreendimento.nome}</h2>
          {empreendimento.descricao && (
            <p className="text-gray-600 mt-1">{empreendimento.descricao}</p>
          )}
        </div>
        <button
          onClick={() => onDelete(empreendimento.id)}
          disabled={isDeleting}
          className="ml-4 px-3 py-1 text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50"
        >
          {isDeleting ? 'Deletando...' : 'Deletar'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
        {empreendimento.localizacao && (
          <div>
            <span className="font-medium">Localização:</span> {empreendimento.localizacao}
          </div>
        )}
        {empreendimento.id_sienge && (
          <div>
            <span className="font-medium">ID Sienge:</span> {empreendimento.id_sienge}
          </div>
        )}
        <div>
          <span className="font-medium">Criado em:</span> {dataFormatada}
        </div>
      </div>
    </div>
  )
}
