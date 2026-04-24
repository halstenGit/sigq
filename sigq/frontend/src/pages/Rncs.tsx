import { Card } from '../components/Card'
import { Badge } from '../components/Badge'
import { colors } from '../styles/theme'
import { RNC_LIST } from '../data/mockData'

export function Rncs() {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24,
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: colors.primaryDark }}>
            Registros de Não Conformidade (RNC)
          </div>
          <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>
            {RNC_LIST.length} RNCs registradas
          </div>
        </div>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '9px 16px',
            background: colors.error,
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background .15s',
          }}
          onMouseEnter={e => {
            (e.target as HTMLElement).style.background = '#a61818'
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.background = colors.error
          }}
        >
          <span style={{ fontSize: 16 }}>+</span> Nova RNC
        </button>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 16 }}>
        {RNC_LIST.map(rnc => (
          <Card key={rnc.id} borderColor={colors.border} padding="20px" shadow={true}>
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 12,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: colors.primaryDark }}>{rnc.id}</div>
              <Badge type="gravidade" value={rnc.gravidade} />
            </div>

            {/* Empreendimento */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Empreendimento
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: colors.text }}>{rnc.empreendimento}</div>
            </div>

            {/* Serviço */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Serviço
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: colors.text }}>{rnc.servico}</div>
            </div>

            {/* Descrição */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Descrição
              </div>
              <div style={{ fontSize: 12, color: colors.text, lineHeight: '1.4' }}>{rnc.descricao}</div>
            </div>

            {/* Status e Responsável */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                marginBottom: 12,
                paddingBottom: 12,
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Status
                </div>
                <div style={{ marginTop: 4 }}>
                  <Badge type="rnc" value={rnc.status} />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Responsável
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: colors.text, marginTop: 4 }}>
                  {rnc.responsavel}
                </div>
              </div>
            </div>

            {/* Datas */}
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Abertura
                </div>
                <div style={{ fontSize: 12, color: colors.text, marginTop: 4 }}>{rnc.abertura}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Prazo
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: colors.text, marginTop: 4 }}>{rnc.prazo}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
