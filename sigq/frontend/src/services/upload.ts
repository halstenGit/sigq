import { api } from './api'

export interface PhotoMetadata {
  latitude?: number
  longitude?: number
  timestamp?: string
  camera?: string
}

export interface UploadResponse {
  id: string
  url_r2: string
  nome_arquivo: string
  created_at: string
}

export const uploadService = {
  async uploadPhoto(
    base64Photo: string,
    fileName: string,
    metadata?: PhotoMetadata
  ): Promise<UploadResponse> {
    try {
      // Converter base64 para Blob
      const byteCharacters = atob(base64Photo)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'image/jpeg' })

      // Criar FormData
      const formData = new FormData()
      formData.append('file', blob, fileName)

      if (metadata) {
        formData.append('metadata', JSON.stringify(metadata))
      }

      // Upload
      const response = await fetch('/v1/evidencias/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  },

  async getEvidencia(evidenciaId: string): Promise<UploadResponse> {
    try {
      const response = await api.get(`/v1/evidencias/${evidenciaId}`)
      return response.data
    } catch (error) {
      console.error('Get evidencia error:', error)
      throw error
    }
  },
}
