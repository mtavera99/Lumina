// ============================================================
//  Función "fan-out" de leads de Lumina
//  Reparte UN envío a: HubSpot + OpenSolar (si hay token) + respaldo Netlify
//  y envía el evento "Lead" a la Conversions API de Meta (CAPI) con
//  deduplicación por event_id (mismo id que dispara el pixel del navegador).
//  Con ?debug=1 devuelve el estado de cada destino (para diagnóstico).
// ============================================================

import crypto from 'node:crypto'

const HUBSPOT_PORTAL_ID = '5491692'
const HUBSPOT_FORM_ID = 'ccfc4878-7dd2-4b34-85f5-ae427106ba13'

// Pixel de LuminaPR (mismo ID que en la landing). Se puede sobreescribir por env.
const META_PIXEL_ID = process.env.META_PIXEL_ID || '2484699815368533'
const META_API_VERSION = 'v21.0'

// --- utilidades ---------------------------------------------------------

// SHA-256 en minúsculas/hex, como exige Meta para los datos personales.
function sha256(value) {
  if (!value) return undefined
  return crypto.createHash('sha256').update(String(value).trim().toLowerCase()).digest('hex')
}

// Teléfono: solo dígitos + código de país (PR/US = 1) para el hash.
function hashPhone(phone) {
  if (!phone) return undefined
  let digits = String(phone).replace(/\D/g, '')
  if (digits.length === 10) digits = '1' + digits // 787XXXXXXX -> 1787XXXXXXX
  return digits ? crypto.createHash('sha256').update(digits).digest('hex') : undefined
}

function clientIp(req) {
  return (
    req.headers.get('x-nf-client-connection-ip') ||
    (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
    ''
  )
}

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Método no permitido', { status: 405 })
  }

  const url = new URL(req.url)
  const debug = url.searchParams.get('debug') === '1'
  const origin = url.origin

  // Leer datos (form-encoded o JSON)
  let d = {}
  try {
    const ct = req.headers.get('content-type') || ''
    if (ct.includes('application/json')) d = await req.json()
    else {
      const form = await req.formData()
      d = Object.fromEntries(form.entries())
    }
  } catch {
    d = {}
  }

  // event_id compartido entre el pixel del navegador y la CAPI (deduplicación).
  // Si el navegador ya generó uno, lo respetamos; si no, lo creamos aquí.
  const eventId = d.event_id || crypto.randomUUID()
  const eventSourceUrl = d.landing_url || `${origin}/`

  const results = {}

  // -------- 1) HubSpot --------
  try {
    const fields = [
      { name: 'firstname', value: d.nombre || '' },
      { name: 'email', value: d.email || '' },
      { name: 'phone', value: d.telefono || '' },
      { name: 'city', value: d.municipio || '' },
    ].filter((f) => f.value)

    const r = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields,
          // pageUri incluye los UTMs: HubSpot los atribuye automáticamente.
          context: { pageUri: eventSourceUrl, pageName: 'Landing Lumina' },
        }),
      },
    )
    results.hubspot = { status: r.status, body: (await r.text()).slice(0, 400) }
  } catch (e) {
    results.hubspot = { error: String(e) }
  }

  // -------- 2) OpenSolar (solo si hay token) --------
  const OS_TOKEN = process.env.OPENSOLAR_TOKEN
  const OS_ORG = process.env.OPENSOLAR_ORG_ID || '64288'
  if (OS_TOKEN) {
    try {
      const r = await fetch(`https://api.opensolar.com/api/orgs/${OS_ORG}/contacts/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OS_TOKEN}` },
        body: JSON.stringify({
          name: d.nombre || '',
          email: d.email || '',
          phone: d.telefono || '',
          address: d.municipio || '',
        }),
      })
      results.opensolar = { status: r.status }
    } catch (e) {
      results.opensolar = { error: String(e) }
    }
  } else {
    results.opensolar = 'skipped (sin token)'
  }

  // -------- 3) Respaldo → Netlify Forms --------
  try {
    const r = await fetch(`${origin}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ 'form-name': 'leads-respaldo', ...d }).toString(),
    })
    results.respaldo = { status: r.status }
  } catch (e) {
    results.respaldo = { error: String(e) }
  }

  // -------- 4) Meta Conversions API (Lead, server-side) --------
  const CAPI_TOKEN = process.env.META_CAPI_TOKEN
  if (CAPI_TOKEN) {
    try {
      const userData = {
        em: sha256(d.email) ? [sha256(d.email)] : undefined,
        ph: hashPhone(d.telefono) ? [hashPhone(d.telefono)] : undefined,
        fn: sha256(d.nombre) ? [sha256(d.nombre)] : undefined,
        ct: sha256(d.municipio) ? [sha256(d.municipio)] : undefined,
        country: [sha256('pr')],
        client_ip_address: clientIp(req),
        client_user_agent: req.headers.get('user-agent') || '',
      }
      if (d.fbc) userData.fbc = d.fbc
      if (d.fbp) userData.fbp = d.fbp
      // Limpiar claves vacías/undefined.
      Object.keys(userData).forEach((k) => {
        if (userData[k] === undefined || userData[k] === '') delete userData[k]
      })

      const payload = {
        data: [
          {
            event_name: 'Lead',
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            event_source_url: eventSourceUrl,
            event_id: eventId, // <-- deduplicación con el pixel del navegador
            user_data: userData,
            custom_data: {
              utm_source: d.utm_source || '',
              utm_medium: d.utm_medium || '',
              utm_campaign: d.utm_campaign || '',
              utm_content: d.utm_content || '',
              utm_term: d.utm_term || '',
              municipio: d.municipio || '',
              factura: d.factura || '',
              vivienda: d.vivienda || '',
            },
          },
        ],
      }
      // Código de prueba opcional para "Probar eventos" en el Administrador de eventos.
      if (process.env.META_TEST_EVENT_CODE) {
        payload.test_event_code = process.env.META_TEST_EVENT_CODE
      }

      const r = await fetch(
        `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(CAPI_TOKEN)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
      results.capi = { status: r.status, body: (await r.text()).slice(0, 400) }
    } catch (e) {
      results.capi = { error: String(e) }
    }
  } else {
    results.capi = 'skipped (sin META_CAPI_TOKEN)'
  }

  if (debug) {
    return new Response(JSON.stringify({ eventId, ...results }, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Pasamos el event_id a la página de gracias para que el pixel del
  // navegador dispare "Lead" con el MISMO id y Meta deduplique.
  return new Response(null, {
    status: 302,
    headers: { Location: `/gracias.html?eid=${encodeURIComponent(eventId)}` },
  })
}
