import { useState, useEffect } from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { FvsProvider } from './contexts/FvsContext'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { apiService } from './services/api'
import { Sidebar } from './components/Sidebar'
import { Login } from './components/Login'
import { Dashboard } from './pages/Dashboard'
import { Empreendimentos } from './pages/Empreendimentos'
import { Rncs } from './pages/Rncs'
import { Perfil } from './pages/Perfil'
import { Fvs } from './pages/Fvs'
import { NovaFvs } from './pages/NovaFvs'

const queryClient = new QueryClient()

function AppContent() {
  const { token, setToken, logout, isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [currentPage, setCurrentPage] = useState('dashboard')
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
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    logout()
  }

  if (!isAuthenticated) {
    return <Login onSuccess={handleLoginSuccess} />
  }

  return (
    <div className="shell">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout} />

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
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'empreendimentos' && <Empreendimentos />}
          {currentPage === 'fvs' && <Fvs onNavigate={setCurrentPage} />}
          {currentPage === 'nova-fvs' && <NovaFvs onSuccess={() => setCurrentPage('fvs')} />}
          {currentPage === 'rncs' && <Rncs />}
          {currentPage === 'perfil' && <Perfil />}
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
            <AppContent />
          </FvsProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
