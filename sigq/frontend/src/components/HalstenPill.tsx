interface HalstenPillOption {
  value: string | number
  label: string
}

interface HalstenPillProps {
  options: HalstenPillOption[]
  value: string | number
  onChange: (value: string | number) => void
  size?: 'sm' | 'md' | 'lg'
}

export function HalstenPill({ options, value, onChange }: HalstenPillProps) {
  return (
    <div className="pill-seg" role="group">
      {options.map(opt => (
        <button
          key={opt.value}
          className={value === opt.value ? 'on' : ''}
          onClick={() => onChange(opt.value)}
          type="button"
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
