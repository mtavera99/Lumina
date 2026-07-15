import type { ReactNode } from 'react'
import { BRAND } from '../data/campaign'

// Landing final publicada (fuente de verdad de la campaña)
const LIVE_URL = 'https://luminapr-solar.netlify.app'
const THANKS_URL = 'https://luminapr-solar.netlify.app/gracias.html'
const FINAL_DOMAIN = 'https://solar.luminapr.net'
const PIXEL_ID = '2484699815368533'
const OPENSOLAR_WIDGET = '37f44522505b47079e01efd541348c31'

// Dónde llegan y se gestionan los leads
const HUBSPOT_LEADS_URL = 'https://app.hubspot.com/contacts/5491692'
const OPENSOLAR_LEADS_URL = 'https://app.opensolar.com/'
const WHATSAPP_INBOX_URL = 'https://business.facebook.com/latest/inbox/'

function StatusPill({ ok, children }: { ok: boolean; children: ReactNode }) {
  return <span className={`pill ${ok ? 'pill-green' : 'pill-amber'}`}>{children}</span>
}

export function LandingPage() {
  return (
    <div>
      <div className="callout" style={{ marginBottom: 22 }}>
        <div className="ico">🌞</div>
        <div>
          <h4>Landing de captación — en vivo</h4>
          <p>
            Esta es la página de destino real de la campaña de Meta. Captura los leads con el <b>widget de OpenSolar</b>{' '}
            (los mismos que ya usa {BRAND.company}), así entran a OpenSolar y de ahí a HubSpot sin romper la integración.
            Lleva el <b>píxel de Meta</b> para medir conversiones.
          </p>
        </div>
      </div>

      {/* Ver mis leads */}
      <div className="section-title">Ver mis leads</div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
        <a className="card" href={HUBSPOT_LEADS_URL} target="_blank" rel="noreferrer" style={{ padding: 20, textDecoration: 'none', display: 'block' }}>
          <div style={{ fontSize: 26 }}>🟠</div>
          <div style={{ fontWeight: 800, color: '#0A2342', marginTop: 6 }}>HubSpot → Contactos</div>
          <div style={{ fontSize: 13, color: '#5c6b83', marginTop: 4 }}>Tu CRM. Ordena por "Fecha de creación" para ver los leads más recientes.</div>
          <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: '#143B6B' }}>Abrir HubSpot →</div>
        </a>
        <a className="card" href={OPENSOLAR_LEADS_URL} target="_blank" rel="noreferrer" style={{ padding: 20, textDecoration: 'none', display: 'block' }}>
          <div style={{ fontSize: 26 }}>☀️</div>
          <div style={{ fontWeight: 800, color: '#0A2342', marginTop: 6 }}>OpenSolar → Leads</div>
          <div style={{ fontSize: 13, color: '#5c6b83', marginTop: 4 }}>Donde caen primero los leads del formulario, antes de sincronizar a HubSpot.</div>
          <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: '#143B6B' }}>Abrir OpenSolar →</div>
        </a>
        <a className="card" href={WHATSAPP_INBOX_URL} target="_blank" rel="noreferrer" style={{ padding: 20, textDecoration: 'none', display: 'block' }}>
          <div style={{ fontSize: 26 }}>💬</div>
          <div style={{ fontWeight: 800, color: '#0A2342', marginTop: 6 }}>Bandeja WhatsApp / Meta</div>
          <div style={{ fontSize: 13, color: '#5c6b83', marginTop: 4 }}>Mensajes por WhatsApp o desde los anuncios (Meta Business Suite).</div>
          <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: '#143B6B' }}>Abrir bandeja →</div>
        </a>
      </div>

      {/* Ficha técnica */}
      <div className="section-title">Ficha técnica</div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
        <div className="card" style={{ padding: 18 }}>
          <div className="ad-field-label">URL en vivo</div>
          <a href={LIVE_URL} target="_blank" rel="noreferrer" style={{ color: '#143B6B', fontWeight: 700, fontSize: 14, wordBreak: 'break-all' }}>
            luminapr-solar.netlify.app
          </a>
          <div style={{ marginTop: 6 }}><StatusPill ok>● Publicada</StatusPill></div>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div className="ad-field-label">Dominio final</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#0A2342', wordBreak: 'break-all' }}>solar.luminapr.net</div>
          <div style={{ marginTop: 6 }}><StatusPill ok={false}>● Pendiente DNS</StatusPill></div>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div className="ad-field-label">Píxel de Meta</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#0A2342' }}>{PIXEL_ID}</div>
          <div style={{ marginTop: 6 }}><StatusPill ok>● Instalado (LuminaPR)</StatusPill></div>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div className="ad-field-label">Captación de leads</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#0A2342' }}>Widget OpenSolar</div>
          <div style={{ fontSize: 12, color: '#8a97ac', marginTop: 3 }}>ID {OPENSOLAR_WIDGET.slice(0, 8)}… → OpenSolar → HubSpot</div>
        </div>
      </div>

      {/* Eventos del píxel */}
      <div className="section-title">Eventos del píxel</div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontWeight: 700, color: '#0A2342' }}>PageView</div>
          <div style={{ fontSize: 13, color: '#5c6b83', marginTop: 4 }}>Se dispara en cada visita a la landing.</div>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontWeight: 700, color: '#0A2342' }}>Lead</div>
          <div style={{ fontSize: 13, color: '#5c6b83', marginTop: 4 }}>
            Se dispara en <b>gracias.html</b> cuando OpenSolar redirige tras enviar el formulario.
          </div>
        </div>
      </div>

      {/* Botones */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '22px 0' }}>
        <a className="btn btn-primary" href={LIVE_URL} target="_blank" rel="noreferrer">🌐 Abrir landing en vivo</a>
        <a className="btn btn-ghost" href={THANKS_URL} target="_blank" rel="noreferrer">Ver página de gracias</a>
        <a className="btn btn-ghost" href={FINAL_DOMAIN} target="_blank" rel="noreferrer">Probar dominio final</a>
      </div>

      {/* Vista previa embebida (la landing real) */}
      <div className="section-title">Vista previa</div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
          <span style={{ marginLeft: 10, fontSize: 12.5, color: '#5c6b83' }}>{LIVE_URL}</span>
        </div>
        <iframe
          title="Landing Lumina en vivo"
          src={LIVE_URL}
          loading="lazy"
          style={{ width: '100%', height: 720, border: 0, display: 'block' }}
        />
      </div>

      <div className="callout" style={{ marginTop: 24 }}>
        <div className="ico">📥</div>
        <div>
          <h4>¿Dónde llegan los leads?</h4>
          <p>
            Los leads del formulario entran a <b>OpenSolar</b> y se sincronizan a <b>HubSpot</b> (mismo circuito que la web
            actual). Para gestionarlos, entra a tu OpenSolar/HubSpot. En Meta verás el evento <b>Lead</b> como conversión.
          </p>
        </div>
      </div>
    </div>
  )
}
