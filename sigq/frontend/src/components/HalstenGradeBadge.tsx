type Grade = 'A' | 'B' | 'C' | 'D' | 'F'

interface HalstenGradeBadgeProps {
  grade: Grade
  size?: 'sm' | 'md' | 'lg'
}

export function HalstenGradeBadge({ grade, size = 'md' }: HalstenGradeBadgeProps) {
  const getColor = () => {
    switch (grade) {
      case 'A':
        return 'var(--ok)'
      case 'B':
        return '#FFC107'
      case 'C':
        return '#FF9800'
      case 'D':
        return 'var(--bad)'
      case 'F':
        return '#333333'
      default:
        return 'var(--ink-2)'
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { width: 20, height: 20, fontSize: 11, fontWeight: 700 }
      case 'lg':
        return { width: 36, height: 36, fontSize: 16, fontWeight: 700 }
      case 'md':
      default:
        return { width: 28, height: 28, fontSize: 13, fontWeight: 700 }
    }
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        backgroundColor: getColor(),
        color: '#fff',
        fontFamily: 'var(--font-display)',
        ...getSizeStyles(),
      }}
    >
      {grade}
    </div>
  )
}
