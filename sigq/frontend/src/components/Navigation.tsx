import { useMsal } from '@azure/msal-react'

interface NavigationProps {
  currentPage: string
  onNavigate: (page: string) => void
  onLogout?: () => void
}

export function Navigation({ currentPage, onNavigate, onLogout }: NavigationProps) {
  const { instance, accounts } = useMsal()

  const handleLogout = async () => {
    try {
      await instance.logoutPopup()
      onLogout?.()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏗️</span>
            <h1 className="text-xl font-bold">SIGQ</h1>
          </div>

          <div className="flex gap-4 flex-wrap items-center">
            <button
              onClick={() => onNavigate('empreendimentos')}
              className={`px-4 py-2 rounded-lg transition ${
                currentPage === 'empreendimentos'
                  ? 'bg-blue-800'
                  : 'hover:bg-blue-700'
              }`}
            >
              📋 Empreendimentos
            </button>

            <button
              onClick={() => onNavigate('rncs')}
              className={`px-4 py-2 rounded-lg transition ${
                currentPage === 'rncs' ? 'bg-blue-800' : 'hover:bg-blue-700'
              }`}
            >
              📷 RNCs
            </button>

            <div className="flex items-center gap-3 ml-auto">
              {accounts.length > 0 && (
                <span className="text-sm opacity-90">{accounts[0].name}</span>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-sm font-semibold"
              >
                🚪 Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
