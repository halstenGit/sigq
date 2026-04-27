import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface FvsData {
  id: string
  empreendimento: string
  local: string
  dataRealizacao: string
  servico: string
  pavimento: string
  unidade: string
  inspetor: string
  empreiteira: string
  nota: number
  observacoes: string
  status: 'rascunho' | 'finalizada' | 'com_nc'
  dataCriacao: string
  nome?: string
  tipoChecklist?: string
  identificador?: string
  localAvaliado?: string
  classificacaoLocal?: string
  colaboradorAvaliado?: string
  equipamentoAvaliado?: string
  servicoAvaliado?: string
  insumoAvaliado?: string
  dataValidade?: string
  dataAtendimento?: string
  dscRevisao?: string
  usuarioResponsavelVerificacao?: string
  codigoAtendimento?: string
}

interface FvsContextType {
  fvsList: FvsData[]
  addFvs: (fvs: Omit<FvsData, 'id' | 'status' | 'dataCriacao'>) => void
  updateFvs: (id: string, fvs: Partial<FvsData>) => void
  removeFvs: (id: string) => void
  getFvsById: (id: string) => FvsData | undefined
}

const FvsContext = createContext<FvsContextType | undefined>(undefined)

export function FvsProvider({ children }: { children: ReactNode }) {
  const [fvsList, setFvsList] = useState<FvsData[]>([])

  // Carregar do localStorage ao montar
  useEffect(() => {
    const saved = localStorage.getItem('sigq_fvs_list')
    if (saved) {
      try {
        setFvsList(JSON.parse(saved))
      } catch (e) {
        console.error('Erro ao carregar FVS salvas', e)
      }
    }
  }, [])

  // Salvar no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('sigq_fvs_list', JSON.stringify(fvsList))
  }, [fvsList])

  const addFvs = (fvs: Omit<FvsData, 'id' | 'status' | 'dataCriacao'>) => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 10000)
    const newFvs: FvsData = {
      ...fvs,
      id: `FVS-${timestamp}-${random}`,
      status: 'rascunho',
      dataCriacao: new Date().toLocaleDateString('pt-BR'),
    }
    setFvsList(prev => {
      const updated = [newFvs, ...prev]
      localStorage.setItem('sigq_fvs_list', JSON.stringify(updated))
      return updated
    })
  }

  const updateFvs = (id: string, updates: Partial<FvsData>) => {
    setFvsList(prev => {
      const updated = prev.map(f => f.id === id ? { ...f, ...updates } : f)
      localStorage.setItem('sigq_fvs_list', JSON.stringify(updated))
      return updated
    })
  }

  const removeFvs = (id: string) => {
    setFvsList(prev => prev.filter(f => f.id !== id))
  }

  const getFvsById = (id: string) => {
    return fvsList.find(f => f.id === id)
  }

  return (
    <FvsContext.Provider value={{ fvsList, addFvs, updateFvs, removeFvs, getFvsById }}>
      {children}
    </FvsContext.Provider>
  )
}

export function useFvs() {
  const context = useContext(FvsContext)
  if (!context) {
    throw new Error('useFvs deve ser usado dentro de FvsProvider')
  }
  return context
}
