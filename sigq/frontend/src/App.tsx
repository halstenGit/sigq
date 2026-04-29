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
import { EditarRnc } from './pages/EditarRnc'
import { Perfil } from './pages/Perfil'
import { Fvs } from './pages/Fvs'
import { NovaFvs } from './pages/NovaFvs'
import { EditarFvs } from './pages/EditarFvs'

const queryClient = new QueryClient()

const PAGE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  empreendimentos: 'Empreendimentos',
  fvs: 'FVS',
  'nova-fvs': 'Nova FVS',
  'editar-fvs': 'Editar FVS',
  rncs: 'RNCs',
  'nova-rnc': 'Nova RNC',
  'editar-rnc': 'Editar RNC',
  perfil: 'Perfil',
}

function AppContent() {
  const { token, setToken, logout, isAuthenticated } = useAuth()
  const { theme, toggleTheme, density, setDensity } = useTheme()
  const [pageState, setPageState] = useState<{ page: string; data?: any }>({ page: 'dashboard' })
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (token) apiService.setAuthToken(token)
    else apiService.clearAuthToken()
  }, [token])

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken)
    setPageState({ page: 'dashboard' })
  }

  const handleNavigate = (page: string, data?: any) => setPageState({ page, data })

  if (!isAuthenticated) return <Login onSuccess={handleLoginSuccess} />

  const here = PAGE_LABELS[pageState.page] ?? pageState.page.toUpperCase()

  return (
    <div className="shell">
      <Sidebar currentPage={pageState.page} onNavigate={handleNavigate} onLogout={logout} />

      <div className="main">
        <header className="top">
          <div className="crumbs">
            <span>SIGQ</span>
            <span className="sep">/</span>
            <span className="here">{here}</span>
          </div>

          <div className="grow" />

          <div className="search">
            <span style={{ color: 'var(--muted-2)' }}>⌕</span>
            <input
              type="text"
              placeholder="Buscar FVS, RNC, empreendimento…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span className="kbd">⌘K</span>
          </div>

          <div className="pill-seg" role="group" aria-label="Densidade">
            <button
              className={density === 'compact' ? 'on' : ''}
              onClick={() => setDensity('compact')}
              title="Densidade compacta"
            >
              Compact
            </button>
            <button
              className={density === 'comfortable' ? 'on' : ''}
              onClick={() => setDensity('comfortable')}
              title="Densidade confortável"
            >
              Comfort
            </button>
          </div>

          <div className="pill-seg" role="group" aria-label="Tema">
            <button
              className={theme === 'light' ? 'on' : ''}
              onClick={() => theme !== 'light' && toggleTheme()}
              title="Modo claro"
            >
              Light
            </button>
            <button
              className={theme === 'dark' ? 'on' : ''}
              onClick={() => theme !== 'dark' && toggleTheme()}
              title="Modo escuro"
            >
              Dark
            </button>
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
          {pageState.page === 'editar-rnc' && <EditarRnc rncId={pageState.data?.rncId} onSuccess={() => handleNavigate('rncs')} onCancel={() => handleNavigate('rncs')} />}
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
