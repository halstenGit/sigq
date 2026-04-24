import { ReactNode } from 'react'

interface HalstenLabelProps {
  children: ReactNode
  htmlFor?: string
  required?: boolean
}

export function HalstenLabel({ children, htmlFor, required }: HalstenLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--muted-1)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        display: 'block',
        marginBottom: 'var(--sp-2)',
      }}
    >
      {children}
      {required && <span style={{ color: 'var(--bad)' }}> *</span>}
    </label>
  )
}
