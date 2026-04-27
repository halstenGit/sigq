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
}

export function HalstenSelect({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  options,
  disabled = false,
  required = false,
}: HalstenSelectProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
      {label && <HalstenLabel required={required}>{label}</HalstenLabel>}
      <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      style={{
        width: '100%',
        padding: 'var(--sp-2) var(--sp-3)',
        border: '1px solid var(--bg-2)',
        borderRadius: 4,
        fontSize: 13,
        fontFamily: 'var(--font-body)',
        color: 'var(--ink)',
        backgroundColor: 'var(--bg)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all .15s',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23999999' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right var(--sp-3) center',
        paddingRight: 'var(--sp-8)',
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
      </select>
    </div>
  )
}
