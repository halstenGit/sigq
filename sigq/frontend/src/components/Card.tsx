import { ReactNode, CSSProperties } from 'react'
import { colors } from '../styles/theme'

interface CardProps {
  children: ReactNode
  borderColor?: string
  padding?: string
  shadow?: boolean
  style?: CSSProperties
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export function Card({
  children,
  borderColor = colors.border,
  padding = '24px',
  shadow = false,
  style = {},
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: colors.bgWhite,
        border: `1px solid ${borderColor}`,
        borderRadius: 10,
        padding,
        boxShadow: shadow ? '0 4px 16px rgba(26,92,53,.12)' : 'none',
        transition: 'box-shadow .15s',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
