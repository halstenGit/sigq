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

export function HalstenPill({ options, value, onChange, size = 'md' }: HalstenPillProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: 'var(--sp-1)', buttonPadding: 'var(--sp-1) var(--sp-2)', fontSize: 11 }
      case 'lg':
        return { padding: 'var(--sp-2)', buttonPadding: 'var(--sp-3) var(--sp-5)', fontSize: 13 }
      case 'md':
      default:
        return { padding: 'var(--sp-1)', buttonPadding: 'var(--sp-2) var(--sp-3)', fontSize: 12 }
    }
  }

  const styles = getSizeStyles()

  return (
    <div
      style={{
        display: 'inline-flex',
        gap: 'var(--sp-1)',
        backgroundColor: 'var(--bg-1)',
        border: '1px solid var(--bg-2)',
        borderRadius: 20,
        padding: styles.padding,
      }}
    >
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          style={{
            padding: styles.buttonPadding,
            backgroundColor: value === option.value ? 'var(--bg)' : 'transparent',
            color: value === option.value ? 'var(--ink)' : 'var(--ink-2)',
            border: 'none',
            borderRadius: 16,
            fontSize: styles.fontSize,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 200ms',
            boxShadow: value === option.value ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
            fontFamily: 'var(--font-body)',
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
