import { useMemo, useState } from 'react'
import {
  ADS,
  PILLARS,
  STAGE_LABEL,
  pillarLabel,
  type AdCreative,
  type FunnelStage,
  type PillarKey,
} from '../data/campaign'

const STAGES: { key: FunnelStage | 'all'; label: string }[] = [
  { key: 'all', label: 'Todas las etapas' },
  { key: 'top', label: 'Awareness' },
  { key: 'mid', label: 'Consideracion' },
  { key: 'bottom', label: 'Remarketing' },
]

function adToText(ad: AdCreative): string {
  return [
    `TITULAR: ${ad.headline}`,
    ``,
    `TEXTO PRINCIPAL:`,
    ad.primary,
    ``,
    `DESCRIPCION: ${ad.description}`,
    `CTA: ${ad.cta}`,
    ``,
    `[Etapa: ${STAGE_LABEL[ad.stage]} · Pilar: ${pillarLabel(ad.pillar)} · Formato: ${ad.format}]`,
  ].join('\n')
}

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
      {copied ? '✓ Copiado' : '⧉ Copiar'}
    </button>
  )
}

function AdCard({ ad }: { ad: AdCreative }) {
  const pillar = PILLARS.find((p) => p.key === ad.pillar)
  return (
    <div className="card ad-card">
      <div className="ad-head">
        <div className="ad-tags">
          <span className="pill pill-navy">{STAGE_LABEL[ad.stage]}</span>
          <span className="pill pill-gold">
            {pillar?.icon} {pillarLabel(ad.pillar)}
          </span>
        </div>
      </div>
      <div className="ad-body">
        <div className="ad-field">
          <div className="ad-field-label">Titular</div>
          <div className="ad-title">{ad.headline}</div>
        </div>
        <div className="ad-field">
          <div className="ad-field-label">Texto principal</div>
          <div className="ad-primary">{ad.primary}</div>
        </div>
        <div className="ad-field">
          <div className="ad-field-label">Descripcion · {ad.format}</div>
          <div className="ad-desc">{ad.description}</div>
        </div>
      </div>
      <div className="ad-cta-row">
        <span className="ad-cta">{ad.cta}</span>
        <CopyButton text={adToText(ad)} />
      </div>
    </div>
  )
}

export function AdLibrary() {
  const [stage, setStage] = useState<FunnelStage | 'all'>('all')
  const [pillar, setPillar] = useState<PillarKey | 'all'>('all')

  const filtered = useMemo(
    () =>
      ADS.filter((a) => (stage === 'all' || a.stage === stage) && (pillar === 'all' || a.pillar === pillar)),
    [stage, pillar],
  )

  const copyAll = async () => {
    const text = filtered.map(adToText).join('\n\n──────────────────────\n\n')
    try {
      await navigator.clipboard.writeText(text)
      alert(`${filtered.length} anuncios copiados al portapapeles.`)
    } catch {
      alert('No se pudo copiar automaticamente. Copia cada anuncio individualmente.')
    }
  }

  return (
    <div>
      <div className="callout" style={{ marginBottom: 22 }}>
        <div className="ico">💡</div>
        <div>
          <h4>Como usar esta biblioteca</h4>
          <p>
            Cada tarjeta es un anuncio listo para pegar en Meta Ads Manager (titular, texto principal, descripcion y
            CTA). Las variantes A/B atacan pilares distintos para que midas cual gana. Nunca lideramos con precio total,
            siempre con la cuota mensual.
          </p>
        </div>
      </div>

      <div className="toolbar">
        <div className="filter-group">
          {STAGES.map((s) => (
            <button
              key={s.key}
              className={`chip ${stage === s.key ? 'active' : ''}`}
              onClick={() => setStage(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div className="toolbar">
        <div className="filter-group">
          <button className={`chip ${pillar === 'all' ? 'active' : ''}`} onClick={() => setPillar('all')}>
            Todos los pilares
          </button>
          {PILLARS.map((p) => (
            <button
              key={p.key}
              className={`chip ${pillar === p.key ? 'active' : ''}`}
              onClick={() => setPillar(p.key)}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="results-toolbar">
        <span style={{ fontSize: 13.5, color: '#5c6b83', fontWeight: 600 }}>
          {filtered.length} {filtered.length === 1 ? 'anuncio' : 'anuncios'}
        </span>
        {filtered.length > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={copyAll}>
            ⧉ Copiar todos
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state">No hay anuncios con esa combinacion de filtros.</div>
      ) : (
        <div className="grid ads-grid">
          {filtered.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      )}
    </div>
  )
}
