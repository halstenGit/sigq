import { useEffect, useState } from 'react'
import { useMsal } from '@azure/msal-react'
import { loginRequest } from '@/config/msalConfig'
import axios from 'axios'

interface LoginProps {
  onSuccess: (token: string) => void
  onError?: (error: Error) => void
}

export function Login({ onSuccess, onError }: LoginProps) {
  const { instance, accounts } = useMsal()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleLogin = async () => {
      try {
        if (accounts.length === 0) {
          return
        }

        setIsLoading(true)
        setError(null)

        // Get the access token from Entra ID
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        })

        // Exchange Entra ID token for our JWT
        const jwtResponse = await axios.post<{ access_token: string }>(
          `${import.meta.env.VITE_API_URL}/v1/auth/login`,
          {
            access_token: response.accessToken,
          }
        )

        onSuccess(jwtResponse.data.access_token)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Falha na autenticação'
        setError(errorMsg)
        onError?.(
          err instanceof Error ? err : new Error('Erro desconhecido na autenticação')
        )
      } finally {
        setIsLoading(false)
      }
    }

    if (accounts.length > 0) {
      handleLogin()
    }
  }, [accounts, instance, onSuccess, onError])

  const handleSignIn = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await instance.loginPopup(loginRequest)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Falha no login'
      setError(errorMsg)
      onError?.(err instanceof Error ? err : new Error(errorMsg))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🏗️ SIGQ</h1>
          <p className="text-gray-600">
            Sistema de Gestão da Qualidade - Halsten
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⏳</span>
              Autenticando...
            </>
          ) : (
            <>
              <span>🔐</span>
              Entrar com Microsoft
            </>
          )}
        </button>

        <p className="text-center text-gray-600 text-sm mt-6">
          Você será redirecionado para autenticação na Microsoft Entra ID
        </p>
      </div>
    </div>
  )
}
