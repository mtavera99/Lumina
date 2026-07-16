// ============================================================
//  Función "fan-out" de leads de Lumina
//  Reparte UN envío a: HubSpot + OpenSolar (si hay token) + respaldo Netlify.
//  Con ?debug=1 devuelve el estado de cada destino (para diagnóstico).
// ============================================================

const HUBSPOT_PORTAL_ID = '5491692'
const HUBSPOT_FORM_ID = 'ccfc4878-7dd2-4b34-85f5-ae427106ba13'

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
        body: JSON.stringify({ fields, context: { pageName: 'Landing Lumina' } }),
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

  if (debug) {
    return new Response(JSON.stringify(results, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(null, { status: 302, headers: { Location: '/gracias.html' } })
}
