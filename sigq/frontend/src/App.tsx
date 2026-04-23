import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Capacitor } from '@capacitor/core'
import { Network } from '@capacitor/network'
import { Empreendimentos } from './pages/Empreendimentos'

const queryClient = new QueryClient()

function App() {
  const [isOnline, setIsOnline] = useState(true)

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
      unsubscribe.then(e => e())
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Empreendimentos />
        {!isOnline && (
          <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-white p-4 text-center">
            Você está offline. Seus dados serão sincronizados quando a conexão for restabelecida.
          </div>
        )}
      </div>
    </QueryClientProvider>
  )
}

export default App
