import { useState } from 'react'
import axios from 'axios'

interface LoginProps {
  onSuccess: (token: string) => void
  onError?: (error: Error) => void
}

export function Login({ onSuccess, onError }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTestLogin = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await axios.post<{ access_token: string }>(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8001'}/v1/auth/test-login`
      )

      onSuccess(response.data.access_token)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Falha no login de teste'
      setError(errorMsg)
      onError?.(err instanceof Error ? err : new Error(errorMsg))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #0A0A0A 0%, #1A1A1A 60%, #52524E 100%)',
        padding: 24,
      }}
    >
      <div
        style={{
          background: '#FAFAF7',
          borderRadius: 12,
          padding: '48px 40px',
          width: '100%',
          maxWidth: 380,
          boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div
            style={{
              width: 38,
              height: 38,
              background: '#0A0A0A',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M3 11L9 17L19 5"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.3px' }}>
              SIGQ
            </div>
            <div style={{ fontSize: 11, color: '#999999', marginTop: -2 }}>Halsten Incorporadora</div>
          </div>
        </div>

        {/* Heading */}
        <div style={{ fontSize: 22, fontWeight: 700, color: '#0A0A0A', marginBottom: 6 }}>Bem-vindo</div>
        <div style={{ fontSize: 13, color: '#999999', marginBottom: 28 }}>
          Acesse com sua conta corporativa Microsoft
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              marginBottom: 16,
              padding: '12px 14px',
              background: '#ffebee',
              border: '1px solid #F44336',
              borderRadius: 6,
              color: '#c62828',
              fontSize: 12,
          }}
          >
            {error}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleTestLogin}
          disabled={isLoading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '12px 20px',
            border: '1.5px solid #EFEFEB',
            borderRadius: 8,
            background: '#FAFAF7',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: 14,
            fontWeight: 600,
            color: '#0A0A0A',
            transition: 'all .15s',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <rect x="0" y="0" width="8" height="8" fill="#F25022" />
            <rect x="10" y="0" width="8" height="8" fill="#7FBA00" />
            <rect x="0" y="10" width="8" height="8" fill="#00A4EF" />
            <rect x="10" y="10" width="8" height="8" fill="#FFB900" />
          </svg>
          {isLoading ? 'Autenticando…' : 'Entrar com Microsoft'}
        </button>

        {/* Footer */}
        <div style={{ marginTop: 24, fontSize: 12, color: '#999999', textAlign: 'center' }}>
          Autenticação via Microsoft Entra ID · SSO corporativo
        </div>
      </div>

      <div style={{ marginTop: 24, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
        SIGQ v0.1 · Halsten Incorporadora · Joinville, SC
      </div>
    </div>
  )
}
