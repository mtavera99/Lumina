import { useMemo, useState } from 'react'
import { IMAGE_PROMPTS, ADS, PILLARS, STAGE_LABEL, pillarLabel, type PillarKey } from '../data/campaign'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }
  return (
    <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={onCopy}>
      {copied ? '✓ Copiado' : '⧉ Copiar prompt'}
    </button>
  )
}

export function ImagePrompts() {
  const [pillar, setPillar] = useState<PillarKey | 'all'>('all')

  const filtered = useMemo(
    () => IMAGE_PROMPTS.filter((p) => pillar === 'all' || p.pillar === pillar),
    [pillar],
  )

  return (
    <div>
      <div className="callout" style={{ marginBottom: 22 }}>
        <div className="ico">🎨</div>
        <div>
          <h4>Prompts para generar las imagenes de los anuncios</h4>
          <p>
            Copia cada prompt y pegalo en Nano Banana (Google Gemini), Midjourney, DALL-E o tu app de imagenes favorita.
            Estan disenados para los mismos anuncios de la biblioteca. Consejo clave: no metas el texto dentro de la
            imagen generada; anadelo despues como overlay (Canva o el editor de Meta) para poder hacer variantes sin
            regenerar.
          </p>
        </div>
      </div>

      <div className="toolbar">
        <div className="filter-group">
          <button className={`chip ${pillar === 'all' ? 'active' : ''}`} onClick={() => setPillar('all')}>
            Todos los pilares
          </button>
          {PILLARS.map((p) => (
            <button key={p.key} className={`chip ${pillar === p.key ? 'active' : ''}`} onClick={() => setPillar(p.key)}>
              {p.icon} {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(360px,1fr))' }}>
        {filtered.map((p) => {
          const ad = ADS.find((a) => a.id === p.adId)
          return (
            <div key={p.id} className="card ad-card">
              <div className="ad-head">
                <div className="ad-tags">
                  <span className="pill pill-navy">{STAGE_LABEL[p.stage]}</span>
                  <span className="pill pill-gold">{pillarLabel(p.pillar)}</span>
                </div>
                <span className="pill pill-green">{p.aspect}</span>
              </div>
              <div className="ad-body">
                <div className="ad-field">
                  <div className="ad-field-label">Concepto</div>
                  <div className="ad-title">{p.title}</div>
                </div>
                {ad && (
                  <div className="ad-field">
                    <div className="ad-field-label">Anuncio asociado</div>
                    <div className="ad-desc">{ad.headline}</div>
                  </div>
                )}
                <div className="ad-field">
                  <div className="ad-field-label">Prompt</div>
                  <div className="prompt-box">{p.prompt}</div>
                </div>
                <div className="ad-field" style={{ marginBottom: 0 }}>
                  <div className="ad-field-label">Tip</div>
                  <div className="ad-desc">{p.tips}</div>
                </div>
              </div>
              <div className="ad-cta-row">
                <span style={{ fontSize: 12, color: '#8a97ac' }}>{p.aspect}</span>
                <CopyButton text={p.prompt} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
