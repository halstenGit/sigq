import { useEffect, useState } from 'react'
import { MsalProvider, useIsAuthenticated } from '@azure/msal-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Network } from '@capacitor/network'
import { msalInstance } from './config/msalConfig'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Login } from './components/Login'
import { Empreendimentos } from './pages/Empreendimentos'
import { Rncs } from './pages/Rncs'
import { Navigation } from './components/Navigation'
import { apiService } from './services/api'

const queryClient = new QueryClient()

function AppContent() {
  const isEntraAuthenticated = useIsAuthenticated()
  const { token, setToken, logout } = useAuth()
  const [isOnline, setIsOnline] = useState(true)
  const [currentPage, setCurrentPage] = useState('empreendimentos')

  useEffect(() => {
    const checkNetworkStatus = async () => {
      const status = await Network.getStatus()
      setIsOnline(status.connected)
    }

    checkNetworkStatus()

    const unsubscribe = Network.addListener('networkStatusChange', (status) => {
      setIsOnline(status.connected)
    })

    return () => {
      unsubscribe.then((e) => e())
    }
  }, [])

  useEffect(() => {
    if (token) {
      apiService.setAuthToken(token)
    } else {
      apiService.clearAuthToken()
    }
  }, [token])

  const handleLoginSuccess = (jwtToken: string) => {
    setToken(jwtToken)
  }

  const handleLogout = () => {
    logout()
  }

  if (!isEntraAuthenticated || !token) {
    return (
      <Login
        onSuccess={handleLoginSuccess}
        onError={(error) => {
          console.error('Login error:', error)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />

      <main>
        {currentPage === 'empreendimentos' && <Empreendimentos />}
        {currentPage === 'rncs' && <Rncs />}
      </main>

      {!isOnline && (
        <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-white p-4 text-center">
          ⚠️ Você está offline. Seus dados serão sincronizados quando a
          conexão for restabelecida.
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <AppContent />
        </QueryClientProvider>
      </AuthProvider>
    </MsalProvider>
  )
}

export default App
