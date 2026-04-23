import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export interface Empreendimento {
  id: string
  nome: string
  descricao?: string
  localizacao?: string
  id_sienge?: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export const empreendimentoService = {
  async listar(skip = 0, limit = 100): Promise<Empreendimento[]> {
    const { data } = await api.get('/v1/empreendimentos', {
      params: { skip, limit },
    })
    return data
  },

  async obter(id: string): Promise<Empreendimento> {
    const { data } = await api.get(`/v1/empreendimentos/${id}`)
    return data
  },

  async criar(obj: Omit<Empreendimento, 'id' | 'ativo' | 'created_at' | 'updated_at'>) {
    const { data } = await api.post('/v1/empreendimentos', obj)
    return data
  },

  async atualizar(
    id: string,
    obj: Partial<Omit<Empreendimento, 'id' | 'created_at' | 'updated_at'>>
  ) {
    const { data } = await api.put(`/v1/empreendimentos/${id}`, obj)
    return data
  },

  async deletar(id: string) {
    await api.delete(`/v1/empreendimentos/${id}`)
  },
}
