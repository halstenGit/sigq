import React from 'react'

interface HalstenInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function HalstenInput({ label, error, hint, className = '', ...props }: HalstenInputProps) {
  return (
    <div className="hs-field-group">
      {label && <label className="hs-label">{label}</label>}
      <input className={`hs-input ${error ? 'hs-input-error' : ''} ${className}`} {...props} />
      {error && <p className="hs-field-error">{error}</p>}
      {hint && <p className="hs-field-hint">{hint}</p>}
    </div>
  )
}
