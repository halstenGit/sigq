import React from 'react'

interface HalstenBadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error'
  children: React.ReactNode
  className?: string
}

export function HalstenBadge({ variant = 'default', children, className = '' }: HalstenBadgeProps) {
  const variantClass = variant !== 'default' ? `hs-badge-${variant}` : ''
  return <span className={`hs-badge ${variantClass} ${className}`}>{children}</span>
}
