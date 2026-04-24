import { useState, useEffect } from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { FvsProvider } from './contexts/FvsContext'
import { apiService } from './services/api'
import { Navigation } from './components/Navigation'
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
  const [currentPage, setCurrentPage] = useState('dashboard')

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
    <div style={{ background: 'var(--hs-bg)', minHeight: '100vh' }}>
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout} />

      <main>
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'empreendimentos' && <Empreendimentos />}
        {currentPage === 'fvs' && <Fvs onNavigate={setCurrentPage} />}
        {currentPage === 'nova-fvs' && <NovaFvs onSuccess={() => setCurrentPage('fvs')} />}
        {currentPage === 'rncs' && <Rncs />}
        {currentPage === 'perfil' && <Perfil />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FvsProvider>
          <AppContent />
        </FvsProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
