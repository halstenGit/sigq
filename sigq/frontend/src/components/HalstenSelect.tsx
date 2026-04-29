import { CSSProperties } from 'react'
import { HalstenLabel } from './HalstenLabel'

interface HalstenSelectProps {
  id?: string
  name?: string
  label?: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  placeholder?: string
  options: Array<{ value: string | number; label: string }>
  disabled?: boolean
  required?: boolean
  hint?: string
  error?: string
  style?: CSSProperties
}

export function HalstenSelect({
  id, name, label, value, onChange, placeholder, options,
  disabled = false, required = false, hint, error, style,
}: HalstenSelectProps) {
  return (
    <div className="fld" style={style}>
      {label && <HalstenLabel htmlFor={id} required={required}>{label}</HalstenLabel>}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-invalid={!!error || undefined}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="err">{error}</span>}
      {hint && !error && <span className="hint">{hint}</span>}
    </div>
  )
}
