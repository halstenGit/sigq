import React from 'react'
import { HalstenLabel } from './HalstenLabel'

interface HalstenInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  required?: boolean
}

export function HalstenInput({ label, error, hint, required = false, id, ...props }: HalstenInputProps) {
  return (
    <div className="fld">
      {label && <HalstenLabel htmlFor={id} required={required}>{label}</HalstenLabel>}
      <input id={id} required={required} aria-invalid={!!error || undefined} {...props} />
      {error && <span className="err">{error}</span>}
      {hint && !error && <span className="hint">{hint}</span>}
    </div>
  )
}
