import React from 'react'

interface HalstenButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  children: React.ReactNode
}

const VARIANT_CLASS: Record<NonNullable<HalstenButtonProps['variant']>, string> = {
  primary: 'primary',
  secondary: '',
  ghost: 'ghost',
  danger: 'danger',
}

export function HalstenButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}: HalstenButtonProps) {
  const classes = [
    'btn',
    VARIANT_CLASS[variant],
    size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : '',
    fullWidth ? 'full' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
