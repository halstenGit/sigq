interface BadgeProps {
  type: 'fvs' | 'rnc' | 'gravidade'
  value: string
}

const statusFVS: Record<string, { label: string; color: string; bg: string }> = {
  rascunho: { label: 'Rascunho', color: '#546e7a', bg: '#eceff1' },
  finalizada: { label: 'Finalizada', color: '#2e7d32', bg: '#e8f5e9' },
  com_nc: { label: 'Com NC', color: '#c62828', bg: '#ffebee' },
}

const statusRNC: Record<string, { label: string; color: string; bg: string }> = {
  aberta: { label: 'Aberta', color: '#c62828', bg: '#ffebee' },
  em_analise: { label: 'Em Análise', color: '#e65100', bg: '#fff3e0' },
  em_correcao: { label: 'Em Correção', color: '#1565c0', bg: '#e3f2fd' },
  em_verificacao: { label: 'Em Verificação', color: '#6a1b9a', bg: '#f3e5f5' },
  fechada: { label: 'Fechada', color: '#2e7d32', bg: '#e8f5e9' },
}

const gravidade: Record<string, { label: string; color: string; bg: string }> = {
  critica: { label: 'Crítica', color: '#fff', bg: '#c62828' },
  maior: { label: 'Maior', color: '#fff', bg: '#e65100' },
  menor: { label: 'Menor', color: '#fff', bg: '#1565c0' },
  observacao: { label: 'Observação', color: '#fff', bg: '#546e7a' },
}

export function Badge({ type, value }: BadgeProps) {
  const map = type === 'fvs' ? statusFVS : type === 'rnc' ? statusRNC : gravidade
  const s = map[value] || { label: value, color: '#666', bg: '#f0f0f0' }

  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: 99,
        color: s.color,
        background: s.bg,
        letterSpacing: '0.3px',
        display: 'inline-block',
      }}
    >
      {s.label}
    </span>
  )
}
