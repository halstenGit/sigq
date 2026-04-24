import { ReactNode } from 'react'

interface HalstenTableProps {
  headers: string[]
  children: ReactNode
}

export function HalstenTable({ headers, children }: HalstenTableProps) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 12,
        fontFamily: 'var(--font-body)',
      }}>
        <thead>
          <tr style={{ background: 'var(--bg-1)', borderBottom: '1px solid var(--bg-2)' }}>
            {headers.map(h => (
              <th
                key={h}
                style={{
                  padding: 'var(--sp-2) var(--sp-3)',
                  textAlign: 'left',
                  color: 'var(--muted-1)',
                  fontWeight: 600,
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  )
}

interface HalstenTableRowProps {
  children: ReactNode
  onClick?: () => void
  isHovered?: boolean
}

export function HalstenTableRow({ children, onClick, isHovered }: HalstenTableRowProps) {
  return (
    <tr
      onClick={onClick}
      style={{
        borderBottom: '1px solid var(--bg-2)',
        background: isHovered ? 'var(--bg-1)' : 'transparent',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background .1s',
      }}
    >
      {children}
    </tr>
  )
}

interface HalstenTableCellProps {
  children: ReactNode
  variant?: 'header' | 'body' | 'numeric'
}

export function HalstenTableCell({ children, variant = 'body' }: HalstenTableCellProps) {
  return (
    <td
      style={{
        padding: 'var(--sp-3)',
        color: variant === 'header' ? 'var(--ink)' : 'var(--ink-2)',
        fontWeight: variant === 'header' ? 600 : 400,
        textAlign: variant === 'numeric' ? 'right' : 'left',
      }}
    >
      {children}
    </td>
  )
}
