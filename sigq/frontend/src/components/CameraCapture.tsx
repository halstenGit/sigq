import { useState } from 'react'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import piexif from 'piexifjs'

interface PhotoData {
  base64: string
  name: string
  timestamp: string
  exif?: Record<string, any>
}

interface CameraCaptureProps {
  onCapture: (photo: PhotoData) => void
  onError?: (error: Error) => void
}

export function CameraCapture({ onCapture, onError }: CameraCaptureProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const takePicture = async () => {
    try {
      setIsLoading(true)

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        promptLabelHeader: 'Capturar Foto',
        promptLabelCancel: 'Cancelar',
        promptLabelPicture: 'Câmera',
        promptLabelPhoto: 'Galeria',
      })

      if (!image.base64String) {
        throw new Error('Falha ao capturar foto')
      }

      const photoData: PhotoData = {
        base64: image.base64String,
        name: `SIGQ-${Date.now()}.jpg`,
        timestamp: new Date().toISOString(),
      }

      // Extrair EXIF se disponível
      try {
        if (image.exifData) {
          photoData.exif = {
            latitude: image.exifData.Latitude,
            longitude: image.exifData.Longitude,
            timestamp: image.exifData.DateTime,
            camera: image.exifData.Model,
          }
        }
      } catch (exifError) {
        console.warn('Erro ao ler EXIF:', exifError)
        // Continuar sem EXIF
      }

      setPreview(`data:image/jpeg;base64,${photoData.base64}`)
      onCapture(photoData)
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      console.error('Erro ao capturar foto:', err)
      onError?.(err)
    } finally {
      setIsLoading(false)
    }
  }

  const clearPreview = () => {
    setPreview(null)
  }

  return (
    <div className="space-y-4">
      <button
        onClick={takePicture}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
      >
        <span>📷</span>
        {isLoading ? 'Capturando...' : 'Tirar Foto'}
      </button>

      {preview && (
        <div className="space-y-3">
          <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Prévia"
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={clearPreview}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition"
            >
              Tirar outra
            </button>
            <button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition"
              disabled
            >
              Usar foto (será salva)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
