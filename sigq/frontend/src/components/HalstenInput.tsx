import React from 'react'
import { HalstenLabel } from './HalstenLabel'

interface HalstenInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  required?: boolean
}

export function HalstenInput({ label, error, hint, required = false, ...props }: HalstenInputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
      {label && <HalstenLabel required={required}>{label}</HalstenLabel>}
      <input
        {...props}
        required={required}
        style={{
          padding: 'var(--sp-2) var(--sp-3)',
          border: `1px solid ${error ? 'var(--bad)' : 'var(--bg-2)'}`,
          borderRadius: 4,
          fontSize: 13,
          fontFamily: 'var(--font-body)',
          color: 'var(--ink)',
          backgroundColor: 'var(--bg)',
          transition: 'all .15s',
          outline: 'none',
          ...(props.style as any),
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = 'var(--ink)'
          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(10, 10, 10, 0.1)'
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = error ? 'var(--bad)' : 'var(--bg-2)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      />
      {error && <p style={{ fontSize: 12, color: 'var(--bad)', margin: 0 }}>{error}</p>}
      {hint && <p style={{ fontSize: 12, color: 'var(--muted-1)', margin: 0 }}>{hint}</p>}
    </div>
  )
}
