// ============================================================
//  Función "fan-out" de leads de Lumina
//  Recibe UN envío del formulario y lo reparte a:
//    1) HubSpot  (Forms Submission API — no requiere token)
//    2) OpenSolar (API autenticada — solo si hay OPENSOLAR_TOKEN)
//    3) Respaldo  (Netlify Forms → "leads-respaldo")
//  Al terminar, redirige a /gracias.html (dispara el evento Lead del pixel).
// ============================================================

const HUBSPOT_PORTAL_ID = '5491692'
const HUBSPOT_FORM_ID = 'ccfc4878-7dd2-4b34-85f5-ae427106ba13'

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Método no permitido', { status: 405 })
  }

  // Leer datos del formulario (form-encoded o JSON)
  let d = {}
  try {
    const ct = req.headers.get('content-type') || ''
    if (ct.includes('application/json')) {
      d = await req.json()
    } else {
      const form = await req.formData()
      d = Object.fromEntries(form.entries())
    }
  } catch {
    d = {}
  }

  const origin = new URL(req.url).origin
  const tasks = []

  // -------- 1) HubSpot --------
  tasks.push(
    fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: [
            { name: 'firstname', value: d.nombre || '' },
            { name: 'email', value: d.email || '' },
            { name: 'phone', value: d.telefono || '' },
            { name: 'city', value: d.municipio || '' },
          ].filter((f) => f.value),
          context: { pageUri: origin, pageName: 'Landing Lumina' },
        }),
      },
    ).catch(() => {}),
  )

  // -------- 2) OpenSolar (solo si hay token configurado) --------
  const OS_TOKEN = process.env.OPENSOLAR_TOKEN
  const OS_ORG = process.env.OPENSOLAR_ORG_ID || '64288'
  if (OS_TOKEN) {
    tasks.push(
      fetch(`https://api.opensolar.com/api/orgs/${OS_ORG}/contacts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OS_TOKEN}`,
        },
        body: JSON.stringify({
          name: d.nombre || '',
          email: d.email || '',
          phone: d.telefono || '',
          address: d.municipio || '',
        }),
      }).catch(() => {}),
    )
  }

  // -------- 3) Respaldo → Netlify Forms ("leads-respaldo") --------
  tasks.push(
    fetch(`${origin}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ 'form-name': 'leads-respaldo', ...d }).toString(),
    }).catch(() => {}),
  )

  await Promise.allSettled(tasks)

  // Redirige a la página de gracias (dispara el evento Lead del pixel de Meta)
  return new Response(null, { status: 302, headers: { Location: '/gracias.html' } })
}
