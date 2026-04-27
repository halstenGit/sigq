import { useState, useEffect } from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { FvsProvider } from './contexts/FvsContext'
import { RncProvider } from './contexts/RncContext'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { apiService } from './services/api'
import { Sidebar } from './components/Sidebar'
import { Login } from './components/Login'
import { Dashboard } from './pages/Dashboard'
import { Empreendimentos } from './pages/Empreendimentos'
import { Rncs } from './pages/Rncs'
import { NovaRnc } from './pages/NovaRnc'
import { Perfil } from './pages/Perfil'
import { Fvs } from './pages/Fvs'
import { NovaFvs } from './pages/NovaFvs'
import { EditarFvs } from './pages/EditarFvs'

const queryClient = new QueryClient()

function AppContent() {
  const { token, setToken, logout, isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [pageState, setPageState] = useState<{ page: string; data?: any }>({ page: 'dashboard' })
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (token) {
      apiService.setAuthToken(token)
    } else {
      apiService.clearAuthToken()
    }
  }, [token])

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken)
    setPageState({ page: 'dashboard' })
  }

  const handleLogout = () => {
    logout()
  }

  const handleNavigate = (page: string, data?: any) => {
    setPageState({ page, data })
  }

  if (!isAuthenticated) {
    return <Login onSuccess={handleLoginSuccess} />
  }

  return (
    <div className="shell">
      <Sidebar currentPage={pageState.page} onNavigate={handleNavigate} onLogout={handleLogout} />

      <div className="main">
        <header className="top">
          <div className="crumbs">
            <span className="here">SIGQ</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', flex: 1, justifyContent: 'center' }}>
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: 'var(--sp-2) var(--sp-3)',
                border: '1px solid var(--bg-2)',
                fontSize: 12,
                fontFamily: 'var(--font-body)',
                color: 'var(--ink)',
                backgroundColor: 'var(--bg)',
                width: 200,
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
            <button
              onClick={toggleTheme}
              title={`Ativar modo ${theme === 'light' ? 'escuro' : 'claro'}`}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 18,
                cursor: 'pointer',
                color: 'var(--ink-2)',
              }}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <div style={{ fontSize: '12px', color: 'var(--muted-1)', whiteSpace: 'nowrap' }}>
              Sistema de Gestão de Qualidade
            </div>
          </div>
        </header>

        <div className="content">
          {pageState.page === 'dashboard' && <Dashboard />}
          {pageState.page === 'empreendimentos' && <Empreendimentos />}
          {pageState.page === 'fvs' && <Fvs onNavigate={handleNavigate} />}
          {pageState.page === 'nova-fvs' && <NovaFvs onSuccess={() => handleNavigate('fvs')} />}
          {pageState.page === 'editar-fvs' && <EditarFvs fvsId={pageState.data?.fvsId} onSuccess={() => handleNavigate('fvs')} onCancel={() => handleNavigate('fvs')} />}
          {pageState.page === 'rncs' && <Rncs onNavigate={handleNavigate} />}
          {pageState.page === 'nova-rnc' && <NovaRnc fvsId={pageState.data?.fvsId} empreendimento={pageState.data?.empreendimento} servico={pageState.data?.servico} onSuccess={() => handleNavigate('rncs')} onCancel={() => handleNavigate('rncs')} />}
          {pageState.page === 'perfil' && <Perfil />}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <FvsProvider>
            <RncProvider>
              <AppContent />
            </RncProvider>
          </FvsProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
