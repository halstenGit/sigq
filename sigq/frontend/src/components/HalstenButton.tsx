import React from 'react'

interface HalstenButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  children: React.ReactNode
}

export function HalstenButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}: HalstenButtonProps) {
  const variantClass = `hs-btn-${variant}`
  const sizeClass = size !== 'md' ? `hs-btn-${size}` : ''
  const fullWidthClass = fullWidth ? 'hs-btn-full' : ''

  const classes = [
    'hs-btn',
    variantClass,
    sizeClass,
    fullWidthClass,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
