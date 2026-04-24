import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { HalstenCard } from '../components/HalstenCard'

interface UserInfo {
  username: string
  email: string
}

export function Perfil() {
  const { logout } = useAuth()

  const { data: userInfo, isLoading } = useQuery({
    queryKey: ['userInfo'],
    queryFn: async () => {
      const { data } = await apiService.get('/v1/auth/me')
      return data as UserInfo
    },
  })

  const handleLogout = () => {
    logout()
    window.location.reload()
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 'var(--sp-8)' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)', margin: 0, marginBottom: 'var(--sp-8)' }}>
        Meu Perfil
      </h1>

      {isLoading ? (
        <div style={{ textAlign: 'center', color: 'var(--ink-2)', padding: 'var(--sp-12) var(--sp-6)' }}>
          Carregando...
        </div>
      ) : userInfo ? (
        <>
          <HalstenCard>
            <div style={{ marginBottom: 'var(--sp-6)' }}>
              <div style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 'var(--sp-1)' }}>Usuário</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{userInfo.username}</div>
            </div>

            <div style={{ marginBottom: 'var(--sp-6)' }}>
              <div style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 'var(--sp-1)' }}>Email</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{userInfo.email}</div>
            </div>

            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: 'var(--sp-3)',
                background: 'var(--ink)',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => ((e.target as HTMLElement).style.opacity = '0.9')}
              onMouseLeave={e => ((e.target as HTMLElement).style.opacity = '1')}
            >
              Sair
            </button>
          </HalstenCard>
        </>
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--ink-2)', padding: 'var(--sp-6)' }}>
          Erro ao carregar perfil
        </div>
      )}
    </div>
  )
}
