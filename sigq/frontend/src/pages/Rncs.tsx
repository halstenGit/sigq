import { useState } from 'react'
import { CameraCapture } from '@/components/CameraCapture'
import { uploadService, PhotoMetadata } from '@/services/upload'

export function Rncs() {
  const [showCamera, setShowCamera] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handlePhotoCapture = async (photo: any) => {
    try {
      setIsUploading(true)
      setError(null)

      const metadata: PhotoMetadata = {
        timestamp: photo.timestamp,
      }

      if (photo.exif) {
        metadata.latitude = photo.exif.latitude
        metadata.longitude = photo.exif.longitude
        metadata.camera = photo.exif.camera
      }

      const result = await uploadService.uploadPhoto(
        photo.base64,
        photo.name,
        metadata
      )

      setUploadedPhotos((prev) => [...prev, result.url_r2])
      setShowCamera(false)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao fazer upload'
      setError(`Erro: ${errorMsg}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleError = (error: Error) => {
    setError(`Erro ao capturar: ${error.message}`)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Registros de Não Conformidade</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Seção de Câmera */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">📷 Capturar Foto</h2>

          {!showCamera ? (
            <button
              onClick={() => setShowCamera(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition font-semibold"
            >
              Abrir Câmera
            </button>
          ) : (
            <div className="space-y-4">
              <CameraCapture
                onCapture={handlePhotoCapture}
                onError={handleError}
              />
              <button
                onClick={() => setShowCamera(false)}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition"
              >
                Fechar
              </button>
            </div>
          )}

          {isUploading && (
            <div className="mt-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg text-center">
              ⏳ Enviando foto...
            </div>
          )}
        </div>

        {/* Fotos Capturadas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">✅ Fotos Enviadas</h2>

          {uploadedPhotos.length === 0 ? (
            <p className="text-gray-600">Nenhuma foto enviada ainda</p>
          ) : (
            <div className="space-y-4">
              {uploadedPhotos.map((url, index) => (
                <div
                  key={index}
                  className="border border-gray-300 rounded-lg overflow-hidden"
                >
                  <img
                    src={url}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-auto max-h-40 object-cover"
                  />
                  <div className="p-2 bg-gray-50 text-sm text-gray-600 truncate">
                    {url}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Informações da Integração */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">📌 Como Funciona:</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>
            ✅ <strong>Câmera Nativa:</strong> Usa @capacitor/camera para acesso
            direto à câmera do dispositivo
          </li>
          <li>
            ✅ <strong>EXIF Metadata:</strong> Extrai localização, timestamp,
            modelo da câmera
          </li>
          <li>
            ✅ <strong>Upload para R2:</strong> Cloudflare R2 (compatível com
            S3) armazena fotos
          </li>
          <li>
            ✅ <strong>Offline:</strong> Se offline, fila de sincronização
            automática
          </li>
        </ul>
      </div>
    </div>
  )
}
