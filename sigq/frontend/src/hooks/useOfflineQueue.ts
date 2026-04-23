import { useCallback } from 'react'

interface SyncItem {
  id: string
  type: 'create' | 'update' | 'delete'
  endpoint: string
  data: any
  timestamp: number
}

const QUEUE_KEY = 'sigq_sync_queue'

export function useOfflineQueue() {
  const addToQueue = useCallback((type: SyncItem['type'], endpoint: string, data: any) => {
    const queue = getQueue()
    const item: SyncItem = {
      id: `${type}-${endpoint}-${Date.now()}`,
      type,
      endpoint,
      data,
      timestamp: Date.now(),
    }
    queue.push(item)
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
  }, [])

  const getQueue = useCallback((): SyncItem[] => {
    const stored = localStorage.getItem(QUEUE_KEY)
    return stored ? JSON.parse(stored) : []
  }, [])

  const removeFromQueue = useCallback((id: string) => {
    const queue = getQueue()
    const filtered = queue.filter((item) => item.id !== id)
    localStorage.setItem(QUEUE_KEY, JSON.stringify(filtered))
  }, [getQueue])

  const clearQueue = useCallback(() => {
    localStorage.removeItem(QUEUE_KEY)
  }, [])

  return {
    addToQueue,
    getQueue,
    removeFromQueue,
    clearQueue,
  }
}
