import React from 'react'

interface HalstenCardProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export function HalstenCard({ title, subtitle, children, className = '' }: HalstenCardProps) {
  return (
    <div className={`card ${className}`.trim()}>
      {(title || subtitle) && (
        <div className="hs-card-header">
          {title && <h3 className="hs-card-title">{title}</h3>}
          {subtitle && <p className="hs-card-subtitle">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}
