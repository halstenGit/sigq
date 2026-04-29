interface SidebarProps {
  currentPage: string
  onNavigate: (page: string, data?: any) => void
  onLogout: () => void
}

const NAV_ITEMS = [
  { id: '00', label: 'Dashboard', page: 'dashboard' },
  { id: '01', label: 'Empreendimentos', page: 'empreendimentos' },
  { id: '02', label: 'FVS', page: 'fvs' },
  { id: '03', label: 'RNCs', page: 'rncs' },
  { id: '04', label: 'Perfil', page: 'perfil' },
]

export function Sidebar({ currentPage, onNavigate, onLogout }: SidebarProps) {
  return (
    <aside className="side">
      <div className="brand">
        <div className="logo">SIGQ</div>
        <div className="product">Quality System</div>
        <div className="ver">v1.0 · Halsten · 2026</div>
      </div>

      <nav className="nav">
        <div className="nav-group">
          <div className="nav-label">Menu</div>
          {NAV_ITEMS.map(item => (
            <a
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={currentPage === item.page ? 'on' : ''}
            >
              <span className="idx">{item.id}</span>
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="foot">
        <span>SIGQ · v1.0</span>
        <button onClick={onLogout} style={{ marginLeft: 'auto' }}>LOGOUT</button>
      </div>
    </aside>
  )
}
