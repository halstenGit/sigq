import { useEffect, useState } from 'react'
import { SQLiteDBConnection, CapacitorSQLite } from '@capacitor-community/sqlite'
import { Network } from '@capacitor/network'

const DB_NAME = 'sigq.db'

interface StorageItem {
  id: string
  type: string
  data: any
  synced: boolean
  timestamp: number
}

export function useOfflineStorage() {
  const [db, setDb] = useState<SQLiteDBConnection | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const initDb = async () => {
      try {
        const sqlite = CapacitorSQLite
        const connection = await sqlite.createConnection(DB_NAME, false, 'no-encryption', 1, false)
        await connection.open()

        // Criar tabelas se não existirem
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS offline_queue (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            data TEXT NOT NULL,
            synced BOOLEAN DEFAULT 0,
            timestamp INTEGER NOT NULL
          )
        `)

        setDb(connection)
        setIsReady(true)
      } catch (error) {
        console.error('Erro ao inicializar DB offline:', error)
      }
    }

    initDb()

    return () => {
      if (db) {
        db.close()
      }
    }
  }, [])

  const saveForSync = async (type: string, data: any) => {
    if (!db) return

    try {
      const id = `${type}-${Date.now()}`
      const query = `
        INSERT INTO offline_queue (id, type, data, synced, timestamp)
        VALUES (?, ?, ?, 0, ?)
      `
      await db.run(query, [id, type, JSON.stringify(data), Date.now()])
    } catch (error) {
      console.error('Erro ao salvar para sincronizar:', error)
    }
  }

  const getPendingSync = async (): Promise<StorageItem[]> => {
    if (!db) return []

    try {
      const result = await db.query(
        'SELECT * FROM offline_queue WHERE synced = 0 ORDER BY timestamp ASC'
      )
      return result.values?.map((row: any) => ({
        id: row.id,
        type: row.type,
        data: JSON.parse(row.data),
        synced: Boolean(row.synced),
        timestamp: row.timestamp,
      })) || []
    } catch (error) {
      console.error('Erro ao obter itens pendentes:', error)
      return []
    }
  }

  const markAsSynced = async (id: string) => {
    if (!db) return

    try {
      await db.run('UPDATE offline_queue SET synced = 1 WHERE id = ?', [id])
    } catch (error) {
      console.error('Erro ao marcar como sincronizado:', error)
    }
  }

  return {
    isReady,
    saveForSync,
    getPendingSync,
    markAsSynced,
  }
}
