import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { empreendimentoService } from '@/services/api'
import { EmpreendimentoItem } from '@/components/EmpreendimentoItem'
import { EmpreendimentoForm } from '@/components/EmpreendimentoForm'
import { useState } from 'react'

export function Empreendimentos() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)

  const { data: empreendimentos = [], isLoading } = useQuery({
    queryKey: ['empreendimentos'],
    queryFn: () => empreendimentoService.listar(),
  })

  const createMutation = useMutation({
    mutationFn: empreendimentoService.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empreendimentos'] })
      setShowForm(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: empreendimentoService.deletar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empreendimentos'] })
    },
  })

  const handleCreate = async (obj: any) => {
    await createMutation.mutateAsync(obj)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este empreendimento?')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Empreendimentos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition"
        >
          {showForm ? 'Cancelar' : 'Novo Empreendimento'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <EmpreendimentoForm
            onSubmit={handleCreate}
            isLoading={createMutation.isPending}
          />
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Carregando empreendimentos...</p>
        </div>
      ) : empreendimentos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-600">Nenhum empreendimento cadastrado</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {empreendimentos.map((emp) => (
            <EmpreendimentoItem
              key={emp.id}
              empreendimento={emp}
              onDelete={handleDelete}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  )
}
