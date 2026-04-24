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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--hs-space-6)' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--hs-text-primary)', marginBottom: 'var(--hs-space-6)', margin: 0 }}>
        Meu Perfil
      </h1>

      {isLoading ? (
        <div style={{ textAlign: 'center', color: 'var(--hs-text-tertiary)', padding: '48px 24px' }}>
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
                  background: 'linear-gradient(135deg, var(--hs-text-primary), var(--hs-text-secondary))',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--hs-space-4)',
                  fontSize: 32,
                }}
              >
                👤
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--hs-text-primary)', marginBottom: 'var(--hs-space-1)', margin: 0 }}>
                {userInfo.username}
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--hs-text-tertiary)', margin: 0 }}>{userInfo.email}</p>
            </div>
          </HalstenCard>

          {/* Info Card */}
          <HalstenCard title="Informações da Conta">
            <div style={{ marginBottom: 'var(--hs-space-4)' }}>
              <label style={{ fontSize: '11px', color: 'var(--hs-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 'var(--hs-space-1)' }}>
                Nome de Usuário
              </label>
              <div
                style={{
                  fontSize: '14px',
                  color: 'var(--hs-text-primary)',
                  background: 'var(--hs-surface-alt)',
                  padding: '12px 14px',
                  borderRadius: 'var(--hs-radius-md)',
                  fontWeight: 600,
                }}
              >
                {userInfo.username}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--hs-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 'var(--hs-space-1)' }}>
                Email
              </label>
              <div
                style={{
                  fontSize: '14px',
                  color: 'var(--hs-text-primary)',
                  background: 'var(--hs-surface-alt)',
                  padding: '12px 14px',
                  borderRadius: 'var(--hs-radius-md)',
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
            <HalstenButton variant="danger" fullWidth onClick={handleLogout}>
              🚪 Sair da Conta
            </HalstenButton>
          </HalstenCard>
        </>
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--hs-error)', padding: '48px 24px' }}>
          Erro ao carregar informações do perfil
        </div>
      )}
    </div>
  )
}
