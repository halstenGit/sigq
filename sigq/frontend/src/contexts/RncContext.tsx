import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface RncData {
  id: string
  empreendimento: string
  servico: string
  descricao: string
  gravidade: 'observacao' | 'menor' | 'maior' | 'critica'
  status: 'aberta' | 'em_analise' | 'em_correcao' | 'em_verificacao' | 'fechada'
  responsavel: string
  abertura: string
  prazo: string
  fvsId?: string
}

interface RncContextType {
  rncList: RncData[]
  addRnc: (rnc: Omit<RncData, 'id'>) => void
  updateRnc: (id: string, rnc: Partial<RncData>) => void
  removeRnc: (id: string) => void
  getRncById: (id: string) => RncData | undefined
  getRncsByFvs: (fvsId: string) => RncData[]
}

const RncContext = createContext<RncContextType | undefined>(undefined)

export function RncProvider({ children }: { children: ReactNode }) {
  const [rncList, setRncList] = useState<RncData[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('sigq_rnc_list')
    if (saved) {
      try {
        setRncList(JSON.parse(saved))
      } catch (e) {
        console.error('Erro ao carregar RNCs salvas', e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('sigq_rnc_list', JSON.stringify(rncList))
  }, [rncList])

  const addRnc = (rnc: Omit<RncData, 'id'>) => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 10000)
    const newRnc: RncData = {
      ...rnc,
      id: `RNC-${timestamp}-${random}`,
    }
    setRncList(prev => {
      const updated = [newRnc, ...prev]
      localStorage.setItem('sigq_rnc_list', JSON.stringify(updated))
      return updated
    })
  }

  const updateRnc = (id: string, updates: Partial<RncData>) => {
    setRncList(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, ...updates } : r)
      localStorage.setItem('sigq_rnc_list', JSON.stringify(updated))
      return updated
    })
  }

  const removeRnc = (id: string) => {
    setRncList(prev => prev.filter(r => r.id !== id))
  }

  const getRncById = (id: string) => {
    return rncList.find(r => r.id === id)
  }

  const getRncsByFvs = (fvsId: string) => {
    return rncList.filter(r => r.fvsId === fvsId)
  }

  return (
    <RncContext.Provider value={{ rncList, addRnc, updateRnc, removeRnc, getRncById, getRncsByFvs }}>
      {children}
    </RncContext.Provider>
  )
}

export function useRnc() {
  const context = useContext(RncContext)
  if (!context) {
    throw new Error('useRnc deve ser usado dentro de RncProvider')
  }
  return context
}
