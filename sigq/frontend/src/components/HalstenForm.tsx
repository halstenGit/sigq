import { ReactNode } from 'react'

interface HalstenFormProps {
  onSubmit: (e: React.FormEvent) => void
  children: ReactNode
}

export function HalstenForm({ onSubmit, children }: HalstenFormProps) {
  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
      {children}
    </form>
  )
}

interface HalstenFormGroupProps {
  children: ReactNode
  columns?: 1 | 2 | 3
}

export function HalstenFormGroup({ children, columns = 1 }: HalstenFormGroupProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: columns === 1 ? '1fr' : columns === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
        gap: 'var(--sp-4)',
      }}
    >
      {children}
    </div>
  )
}

interface HalstenFormFieldProps {
  children: ReactNode
}

export function HalstenFormField({ children }: HalstenFormFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
      {children}
    </div>
  )
}
