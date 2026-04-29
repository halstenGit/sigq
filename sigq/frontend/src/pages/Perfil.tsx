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

  const FieldRow = ({ label, value }: { label: string; value: string }) => (
    <div className="fld" style={{ marginBottom: 14 }}>
      <label>{label}</label>
      <div style={{ fontSize: 13, color: 'var(--ink)', fontFamily: 'var(--font-mono)', padding: '8px 0' }}>
        {value}
      </div>
    </div>
  )

  return (
    <section className="sec" style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="sec-head">
        <div>
          <div className="no">SEC · 04 · CONTA</div>
          <h1>Perfil</h1>
          <p className="lede">Dados da conta autenticada via SSO.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="state">
          <div className="hd">Carregando…</div>
        </div>
      ) : userInfo ? (
        <HalstenCard>
          <FieldRow label="Usuário" value={userInfo.username} />
          <FieldRow label="Email" value={userInfo.email} />

          <button onClick={handleLogout} className="btn primary full lg" style={{ marginTop: 12 }}>
            Sair
          </button>
        </HalstenCard>
      ) : (
        <div className="state err">
          <div className="gl">!</div>
          <div className="hd">Erro ao carregar perfil</div>
        </div>
      )}
    </section>
  )
}
