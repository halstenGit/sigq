interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

export function Sidebar({ currentPage, onNavigate, onLogout }: SidebarProps) {
  const navItems = [
    { id: '00', label: 'Dashboard', page: 'dashboard' },
    { id: '01', label: 'Empreendimentos', page: 'empreendimentos' },
    { id: '02', label: 'RNCs', page: 'rncs' },
    { id: '03', label: 'FVS', page: 'fvs' },
    { id: '04', label: 'Perfil', page: 'perfil' },
  ]

  return (
    <aside className="side">
      {/* Brand */}
      <div className="brand">
        <div className="logo">SIGQ</div>
        <div className="product">Quality System</div>
        <div className="ver">v1.0.0</div>
      </div>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-group">
          <div className="nav-label">Menu</div>
          {navItems.map(item => (
            <a
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`${currentPage === item.page ? 'on' : ''}`}
              style={{ cursor: 'pointer' }}
            >
              <span className="idx">{item.id}</span>
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="foot">
        <button
          onClick={onLogout}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--muted-2)',
            fontSize: '11px',
            cursor: 'pointer',
            textDecoration: 'none',
            letterSpacing: '0.08em',
            fontFamily: 'var(--font-mono)',
          }}
        >
          LOGOUT
        </button>
      </div>
    </aside>
  )
}
