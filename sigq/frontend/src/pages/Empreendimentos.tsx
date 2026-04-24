import { Card } from '../components/Card'
import { colors } from '../styles/theme'
import { EMPREENDIMENTOS } from '../data/mockData'

export function Empreendimentos() {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: colors.primaryDark }}>Empreendimentos</div>
          <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>
            {EMPREENDIMENTOS.length} obras ativas
          </div>
        </div>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '9px 16px',
            background: colors.primary,
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background .15s',
          }}
          onMouseEnter={e => {
            (e.target as HTMLElement).style.background = colors.primaryDark
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.background = colors.primary
          }}
        >
          <span style={{ fontSize: 16 }}>+</span> Novo empreendimento
        </button>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 16 }}>
        {EMPREENDIMENTOS.map(e => (
          <Card
            key={e.id}
            borderColor={colors.border}
            padding="24px"
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 16,
              }}
            >
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: colors.primaryDark }}>{e.nome}</div>
                <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
                  {e.cidade} · {e.blocos} bloco{e.blocos > 1 ? 's' : ''} · {e.unidades} unidades
                </div>
              </div>
              <span
                style={{
                  fontSize: 11,
                  padding: '3px 10px',
                  background: '#e8f5e9',
                  color: colors.success,
                  borderRadius: 99,
                  fontWeight: 600,
                }}
              >
                Em andamento
              </span>
            </div>

            {/* Progress */}
            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 11,
                  color: colors.textMuted,
                  marginBottom: 4,
                }}
              >
                <span>Progresso geral</span>
                <span style={{ fontWeight: 600, color: colors.primaryDark }}>{e.progresso}%</span>
              </div>
              <div style={{ height: 8, background: colors.border, borderRadius: 99 }}>
                <div
                  style={{
                    height: '100%',
                    width: `${e.progresso}%`,
                    background: colors.primary,
                    borderRadius: 99,
                    transition: 'width .6s',
                  }}
                />
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 16, borderTop: `1px solid ${colors.border}`, paddingTop: 12 }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: colors.primaryDark }}>{e.fvs}</div>
                <div style={{ fontSize: 11, color: colors.textMuted }}>FVS realizadas</div>
              </div>
              <div style={{ width: 1, background: colors.border }} />
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: e.rncs > 5 ? colors.error : colors.primaryDark }}>
                  {e.rncs}
                </div>
                <div style={{ fontSize: 11, color: colors.textMuted }}>RNCs abertas</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
