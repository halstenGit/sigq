import { ReactNode } from 'react'

interface HalstenModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  maxWidth?: string
}

export function HalstenModal({ isOpen, onClose, title, children, maxWidth = '600px' }: HalstenModalProps) {
  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(10, 10, 10, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'var(--sp-4)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg)',
          border: '1px solid var(--bg-2)',
          borderRadius: 6,
          maxWidth,
          width: '100%',
          maxHeight: '80vh',
          overflow: 'auto',
          padding: 'var(--sp-8)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-6)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: 'var(--muted-1)',
              padding: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ color: 'var(--ink-2)', lineHeight: 1.6 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
