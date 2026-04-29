type Grade = 'A' | 'B' | 'C' | 'D' | 'F'

interface HalstenGradeBadgeProps {
  grade: Grade
  size?: 'sm' | 'md' | 'lg'
}

export function HalstenGradeBadge({ grade, size = 'md' }: HalstenGradeBadgeProps) {
  const sizeStyle =
    size === 'sm' ? { fontSize: 10, padding: '1px 5px', minWidth: 18 } :
    size === 'lg' ? { fontSize: 14, padding: '4px 10px', minWidth: 28 } :
    { fontSize: 11, padding: '2px 7px', minWidth: 22 }

  return (
    <span className={`grade ${grade}`} style={sizeStyle}>{grade}</span>
  )
}
