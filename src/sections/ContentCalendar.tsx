import { useMemo, useState } from 'react'
import { CONTENT_CALENDAR, STORIES_IDEAS, HASHTAGS, PILLAR_COLORS, type OrganicPillar, type ContentPost } from '../data/campaign'

const PILLARS: (OrganicPillar | 'all')[] = ['all', 'Educacion', 'Confianza', 'Prueba social', 'Conversion']

function CopyButton({ text, label = '⧉ Copiar' }: { text: string; label?: string }) {
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
      {copied ? '✓ Copiado' : label}
    </button>
  )
}

function postToText(p: ContentPost): string {
  return `${p.caption}\n\n${p.hashtags.join(' ')}\n\n${p.cta}`
}

function PostCard({ p }: { p: ContentPost }) {
  return (
    <div className="card ad-card">
      <div className="ad-head">
        <div className="ad-tags">
          <span className="pill" style={{ background: PILLAR_COLORS[p.pillar] + '22', color: PILLAR_COLORS[p.pillar] }}>
            {p.pillar}
          </span>
          <span className="pill pill-navy">{p.format}</span>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#8a97ac' }}>{p.day}</span>
      </div>
      <div className="ad-body">
        <div className="ad-field">
          <div className="ad-field-label">Idea</div>
          <div className="ad-title">{p.title}</div>
        </div>
        <div className="ad-field">
          <div className="ad-field-label">Copy para publicar</div>
          <div className="ad-primary">{p.caption}</div>
        </div>
        <div className="ad-field">
          <div className="ad-field-label">Hashtags</div>
          <div className="ad-desc" style={{ color: '#143B6B' }}>{p.hashtags.join(' ')}</div>
        </div>
        <div className="ad-field" style={{ marginBottom: 0 }}>
          <div className="ad-field-label">Plataforma</div>
          <div className="ad-desc">{p.platform}</div>
        </div>
      </div>
      <div className="ad-cta-row">
        <span className="ad-cta">{p.cta}</span>
        <CopyButton text={postToText(p)} label="⧉ Copiar post" />
      </div>
    </div>
  )
}

export function ContentCalendar() {
  const [pillar, setPillar] = useState<OrganicPillar | 'all'>('all')

  const weeks = useMemo(() => {
    const filtered = CONTENT_CALENDAR.filter((p) => pillar === 'all' || p.pillar === pillar)
    const byWeek = new Map<number, ContentPost[]>()
    filtered.forEach((p) => {
      if (!byWeek.has(p.week)) byWeek.set(p.week, [])
      byWeek.get(p.week)!.push(p)
    })
    return [...byWeek.entries()].sort((a, b) => a[0] - b[0])
  }, [pillar])

  return (
    <div>
      <div className="callout" style={{ marginBottom: 22 }}>
        <div className="ico">📅</div>
        <div>
          <h4>Parrilla de contenido organico — 4 semanas</h4>
          <p>
            Calendario de publicaciones para Facebook e Instagram: 2 posts por semana (martes y jueves), rotando los 4
            pilares de contenido. Cada tarjeta trae el copy listo para publicar, hashtags y CTA. Complementa con
            historias durante la semana.
          </p>
        </div>
      </div>

      <div className="toolbar">
        <div className="filter-group">
          {PILLARS.map((p) => (
            <button key={p} className={`chip ${pillar === p ? 'active' : ''}`} onClick={() => setPillar(p)}>
              {p === 'all' ? 'Todos los pilares' : p}
            </button>
          ))}
        </div>
      </div>

      {weeks.map(([week, posts]) => (
        <div key={week}>
          <div className="section-title">Semana {week}</div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))' }}>
            {posts.map((p) => (
              <PostCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      ))}

      {/* Ideas para historias */}
      <div className="section-title">Ideas para historias (durante la semana)</div>
      <div className="card" style={{ padding: 20 }}>
        <ul className="info-list" style={{ listStyle: 'none' }}>
          {STORIES_IDEAS.map((idea, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, padding: '7px 0', fontSize: 14 }}>
              <span style={{ color: '#C9A84C', fontWeight: 800 }}>›</span>
              <span>{idea}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Banco de hashtags */}
      <div className="section-title">Banco de hashtags</div>
      <div className="card" style={{ padding: 20 }}>
        <div className="cta-bank" style={{ marginBottom: 16 }}>
          {HASHTAGS.map((h) => (
            <span key={h} className="pill pill-navy" style={{ fontSize: 13, padding: '8px 13px', textTransform: 'none', letterSpacing: 0 }}>
              {h}
            </span>
          ))}
        </div>
        <CopyButton text={HASHTAGS.join(' ')} label="⧉ Copiar todos los hashtags" />
      </div>
    </div>
  )
}
