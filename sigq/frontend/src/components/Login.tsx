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
      const msg = err instanceof Error ? err.message : 'Falha no login de teste'
      setError(msg)
      onError?.(err instanceof Error ? err : new Error(msg))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-shell">
      <aside className="ll">
        <div>
          <div className="mk">HALSTEN</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted-2)', letterSpacing: '0.06em', marginTop: 8 }}>
            QUALITY SYSTEM · v1.0
          </div>
        </div>

        <div className="big">
          SIGQ<br /><span>· qualidade ·</span>
        </div>

        <div className="rl">
          Joinville · SC · 2026
        </div>
      </aside>

      <main className="lr">
        <form onSubmit={e => { e.preventDefault(); handleTestLogin() }}>
          <div className="heading">Bem-vindo</div>
          <div className="sub">Acesse com sua conta corporativa Microsoft Entra ID.</div>

          {error && <div className="err">{error}</div>}

          <button
            type="submit"
            className="btn primary full lg"
            disabled={isLoading}
            style={{ marginTop: 8 }}
          >
            <svg width="14" height="14" viewBox="0 0 18 18" aria-hidden="true">
              <rect x="0" y="0" width="8" height="8" fill="#F25022" />
              <rect x="10" y="0" width="8" height="8" fill="#7FBA00" />
              <rect x="0" y="10" width="8" height="8" fill="#00A4EF" />
              <rect x="10" y="10" width="8" height="8" fill="#FFB900" />
            </svg>
            {isLoading ? 'Autenticando…' : 'Entrar com Microsoft'}
          </button>

          <div style={{
            marginTop: 18,
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            color: 'var(--muted-2)',
            letterSpacing: '0.04em',
            textAlign: 'center',
          }}>
            SSO corporativo · Microsoft Entra ID
          </div>
        </form>
      </main>
    </div>
  )
}
