import { HalstenCard } from '../components/HalstenCard'
import { EMPREENDIMENTOS } from '../data/mockData'

export function Empreendimentos() {
  return (
    <section className="sec">
      <div className="sec-head">
        <div>
          <div className="no">SEC · 01 · OBRAS</div>
          <h1>Empreendimentos</h1>
          <p className="lede">{EMPREENDIMENTOS.length} obras ativas no momento.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
        {EMPREENDIMENTOS.map(e => (
          <HalstenCard key={e.id}>
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.01em', margin: '0 0 4px' }}>{e.nome}</h3>
              <p className="mono" style={{ fontSize: 11, color: 'var(--muted-1)', margin: 0, letterSpacing: '0.04em' }}>
                {e.cidade} · {e.blocos} bloco{e.blocos > 1 ? 's' : ''} · {e.unidades} unidades
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted-1)', marginBottom: 6 }}>
                <span>Progresso</span>
                <span className="mono" style={{ color: 'var(--ink)', letterSpacing: 0 }}>{e.progresso}%</span>
              </div>
              <div className="score-bar">
                <i style={{ width: `${e.progresso}%` }} />
              </div>
            </div>
          </HalstenCard>
        ))}
      </div>
    </section>
  )
}
