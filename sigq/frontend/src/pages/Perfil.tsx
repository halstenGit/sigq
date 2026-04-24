import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { HalstenCard } from '../components/HalstenCard'
import { HalstenButton } from '../components/HalstenButton'

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
          Carregando informações...
        </div>
      ) : userInfo ? (
        <>
          {/* Avatar Card */}
          <HalstenCard>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(135deg, var(--ink), var(--ink-1))',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--sp-4)',
                  fontSize: 32,
                }}
              >
                👤
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', margin: 0, marginBottom: 'var(--sp-1)' }}>
                {userInfo.username}
              </h2>
              <p style={{ fontSize: 12, color: 'var(--ink-2)', margin: 0 }}>{userInfo.email}</p>
            </div>
          </HalstenCard>

          {/* Info Card */}
          <HalstenCard title="Informações da Conta">
            <div style={{ marginBottom: 'var(--sp-6)' }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted-1)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 'var(--sp-2)' }}>
                Nome de Usuário
              </label>
              <div
                style={{
                  fontSize: 13,
                  color: 'var(--ink)',
                  background: 'var(--bg-1)',
                  padding: 'var(--sp-2) var(--sp-3)',
                  borderRadius: 4,
                  fontWeight: 600,
                }}
              >
                {userInfo.username}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted-1)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 'var(--sp-2)' }}>
                Email
              </label>
              <div
                style={{
                  fontSize: 13,
                  color: 'var(--ink)',
                  background: 'var(--bg-1)',
                  padding: 'var(--sp-2) var(--sp-3)',
                  borderRadius: 4,
                  fontWeight: 600,
                  wordBreak: 'break-all',
                }}
              >
                {userInfo.email}
              </div>
            </div>
          </HalstenCard>

          {/* Actions Card */}
          <HalstenCard title="Ações">
            <HalstenButton variant="primary" fullWidth onClick={handleLogout}>
              🚪 Sair da Conta
            </HalstenButton>
          </HalstenCard>
        </>
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--bad)', padding: 'var(--sp-12) var(--sp-6)' }}>
          Erro ao carregar informações do perfil
        </div>
      )}
    </div>
  )
}
