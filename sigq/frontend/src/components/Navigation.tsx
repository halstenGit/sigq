import './Navigation.css'

interface NavigationProps {
  currentPage: string
  onNavigate: (page: string) => void
  onLogout?: () => void
}

export function Navigation({ currentPage, onNavigate, onLogout }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'empreendimentos', label: '📋 Empreendimentos' },
    { id: 'fvs', label: '📝 FVS' },
    { id: 'rncs', label: '⚠️ RNCs' },
    { id: 'perfil', label: '👤 Perfil' },
  ]

  return (
    <nav className="hs-nav-header">
      <div className="hs-nav-container">
        {/* Logo */}
        <div className="hs-nav-logo">
          <span className="hs-nav-logo-icon">🏗️</span>
          <span className="hs-nav-logo-text">SIGQ</span>
        </div>

        {/* Nav Items */}
        <div className="hs-nav-items">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`hs-nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Logout */}
        <button className="hs-btn hs-btn-danger hs-btn-sm" onClick={onLogout}>
          Sair
        </button>
      </div>
    </nav>
  )
}
