import React from 'react'

interface HalstenBadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'solid'
  children: React.ReactNode
  className?: string
}

const VARIANT_CLASS: Record<NonNullable<HalstenBadgeProps['variant']>, string> = {
  default: '',
  success: 'ok',
  warning: 'warn',
  error: 'bad',
  solid: 'solid',
}

export function HalstenBadge({ variant = 'default', children, className = '' }: HalstenBadgeProps) {
  const classes = ['chip', VARIANT_CLASS[variant], className].filter(Boolean).join(' ')
  return <span className={classes}><span className="d" />{children}</span>
}
