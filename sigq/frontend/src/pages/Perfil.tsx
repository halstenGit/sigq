import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { Card } from '../components/Card'
import { colors } from '../styles/theme'

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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: colors.primaryDark, marginBottom: 24 }}>
        Meu Perfil
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', color: colors.textMuted, padding: '48px 24px' }}>
          Carregando informações...
        </div>
      ) : userInfo ? (
        <>
          {/* Avatar Card */}
          <Card borderColor={colors.primary} padding="32px" style={{ textAlign: 'center', marginBottom: 24 }}>
            <div
              style={{
                width: 80,
                height: 80,
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: 32,
              }}
            >
              👤
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: colors.primaryDark, marginBottom: 4 }}>
              {userInfo.username}
            </div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>{userInfo.email}</div>
          </Card>

          {/* Info Card */}
          <Card borderColor={colors.border} padding="24px" style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.primaryDark, marginBottom: 16 }}>
              Informações da Conta
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>
                Nome de Usuário
              </label>
              <div
                style={{
                  fontSize: 14,
                  color: colors.text,
                  background: colors.bgLight,
                  padding: '12px 14px',
                  borderRadius: 6,
                  fontWeight: 600,
                }}
              >
                {userInfo.username}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>
                Email
              </label>
              <div
                style={{
                  fontSize: 14,
                  color: colors.text,
                  background: colors.bgLight,
                  padding: '12px 14px',
                  borderRadius: 6,
                  fontWeight: 600,
                  wordBreak: 'break-all',
                }}
              >
                {userInfo.email}
              </div>
            </div>
          </Card>

          {/* Actions Card */}
          <Card borderColor={colors.border} padding="24px">
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.primaryDark, marginBottom: 16 }}>
              Ações
            </div>

            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: colors.error,
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background .15s',
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.background = '#a61818'
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.background = colors.error
              }}
            >
              🚪 Sair da Conta
            </button>
          </Card>
        </>
      ) : (
        <div style={{ textAlign: 'center', color: colors.error, padding: '48px 24px' }}>
          Erro ao carregar informações do perfil
        </div>
      )}
    </div>
  )
}
