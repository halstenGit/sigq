import axios, { AxiosInstance } from 'axios'

class ApiService {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  setAuthToken(token: string) {
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  clearAuthToken() {
    delete this.instance.defaults.headers.common['Authorization']
  }

  get(url: string, config = {}) {
    return this.instance.get(url, config)
  }

  post(url: string, data = {}, config = {}) {
    return this.instance.post(url, data, config)
  }

  put(url: string, data = {}, config = {}) {
    return this.instance.put(url, data, config)
  }

  delete(url: string, config = {}) {
    return this.instance.delete(url, config)
  }

  getAxiosInstance() {
    return this.instance
  }
}

export const apiService = new ApiService()

// Types
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

export interface EmpreendimentoCreate {
  nome: string
  descricao?: string
  localizacao?: string
  id_sienge?: string
}

export interface EmpreendimentoUpdate {
  nome?: string
  descricao?: string
  localizacao?: string
  ativo?: boolean
}

// Services
class EmpreendimentoService {
  async listar(): Promise<Empreendimento[]> {
    const { data } = await apiService.get('/v1/empreendimentos')
    return data
  }

  async buscar(id: string): Promise<Empreendimento> {
    const { data } = await apiService.get(`/v1/empreendimentos/${id}`)
    return data
  }

  async criar(empreendimento: EmpreendimentoCreate): Promise<Empreendimento> {
    const { data } = await apiService.post('/v1/empreendimentos', empreendimento)
    return data
  }

  async atualizar(id: string, empreendimento: EmpreendimentoUpdate): Promise<Empreendimento> {
    const { data } = await apiService.put(`/v1/empreendimentos/${id}`, empreendimento)
    return data
  }

  async deletar(id: string): Promise<void> {
    await apiService.delete(`/v1/empreendimentos/${id}`)
  }
}

export const empreendimentoService = new EmpreendimentoService()
