import { ReactNode } from 'react'

interface HalstenLabelProps {
  children: ReactNode
  htmlFor?: string
  required?: boolean
}

export function HalstenLabel({ children, htmlFor, required }: HalstenLabelProps) {
  return (
    <label htmlFor={htmlFor}>
      {children}
      {required && <span className="req"> *</span>}
    </label>
  )
}
