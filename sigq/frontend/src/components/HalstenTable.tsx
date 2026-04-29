import { ReactNode } from 'react'

interface HalstenTableProps {
  headers: string[]
  children: ReactNode
}

export function HalstenTable({ headers, children }: HalstenTableProps) {
  return (
    <div className="tbl">
      <table>
        <thead>
          <tr>
            {headers.map(h => <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

interface HalstenTableRowProps {
  children: ReactNode
  onClick?: () => void
}

export function HalstenTableRow({ children, onClick }: HalstenTableRowProps) {
  return (
    <tr onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      {children}
    </tr>
  )
}

interface HalstenTableCellProps {
  children: ReactNode
  variant?: 'header' | 'body' | 'numeric'
}

export function HalstenTableCell({ children, variant = 'body' }: HalstenTableCellProps) {
  if (variant === 'numeric') return <td className="num val">{children}</td>
  if (variant === 'header') return <td style={{ fontWeight: 600 }}>{children}</td>
  return <td>{children}</td>
}
