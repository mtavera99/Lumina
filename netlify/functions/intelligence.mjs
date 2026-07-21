// Backend privado para Lumina Intelligence.
// Valida cuenta, audiencia y permisos del token de Google antes de exponer HubSpot.

const ALLOWED_EMAIL = 'mtavera99@gmail.com'
const REQUIRED_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/calendar.events.readonly',
]
const DEFAULT_ORIGINS = [
  'https://mtavera99.github.io',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]

function allowedOrigins() {
  const configured = (process.env.INTELLIGENCE_ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
  return [...new Set([...DEFAULT_ORIGINS, ...configured])]
}

function corsHeaders(req) {
  const origin = req.headers.get('origin') || ''
  const allowed = allowedOrigins()
  return {
    'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0],
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8',
    'Vary': 'Origin',
  }
}

function json(req, body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(req) })
}

function validRequestOrigin(req) {
  const origin = req.headers.get('origin')
  return !origin || allowedOrigins().includes(origin)
}

async function authorize(req) {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
  if (!clientId) return { error: 'El cliente OAuth del backend no esta configurado.', status: 503 }

  const authorization = req.headers.get('authorization') || ''
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : ''
  if (!token) return { error: 'Falta la autorizacion de Google.', status: 401 }

  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(token)}`)
  if (!response.ok) return { error: 'La sesion de Google no es valida o vencio.', status: 401 }

  const info = await response.json()
  if (String(info.aud || '') !== clientId) {
    return { error: 'El token no pertenece a Lumina Intelligence.', status: 403 }
  }
  if (String(info.email || '').toLowerCase() !== ALLOWED_EMAIL || String(info.email_verified) !== 'true') {
    return { error: 'Esta cuenta no tiene acceso a Lumina Intelligence.', status: 403 }
  }

  const scopes = new Set(String(info.scope || '').split(' ').filter(Boolean))
  if (!REQUIRED_SCOPES.every((scope) => scopes.has(scope))) {
    return { error: 'La autorizacion no incluye los permisos de solo lectura requeridos.', status: 403 }
  }

  return { profile: { email: info.email } }
}

async function searchHubSpot(query) {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN
  if (!token) return { error: 'HubSpot todavia no esta configurado.', status: 503 }

  const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: String(query || '').slice(0, 120),
      limit: 10,
      properties: ['firstname', 'lastname', 'email', 'phone', 'lifecyclestage', 'lastmodifieddate'],
    }),
  })

  const body = await response.json().catch(() => ({}))
  if (!response.ok) return { error: body.message || `HubSpot respondio ${response.status}.`, status: 502 }
  return {
    contacts: (body.results || []).map((contact) => ({ id: contact.id, properties: contact.properties })),
    total: body.total || 0,
  }
}

export default async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(req) })
  if (!validRequestOrigin(req)) return json(req, { error: 'Origen no autorizado.' }, 403)
  if (!['GET', 'POST'].includes(req.method)) return json(req, { error: 'Metodo no permitido.' }, 405)

  const auth = await authorize(req)
  if (auth.error) return json(req, { error: auth.error }, auth.status)

  if (req.method === 'GET') {
    return json(req, {
      account: auth.profile.email,
      services: {
        google: true,
        readAiEmailImport: true,
        hubspot: Boolean(process.env.HUBSPOT_PRIVATE_APP_TOKEN),
        assistant: Boolean(process.env.INTELLIGENCE_AI_API_KEY),
        persistentStorage: Boolean(process.env.INTELLIGENCE_DATABASE_URL),
      },
    })
  }

  let payload
  try {
    payload = await req.json()
  } catch {
    return json(req, { error: 'El cuerpo JSON no es valido.' }, 400)
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return json(req, { error: 'El cuerpo debe ser un objeto JSON.' }, 400)
  }

  if (payload.action === 'hubspot-search') {
    const result = await searchHubSpot(payload.query)
    if (result.error) return json(req, { error: result.error }, result.status)
    return json(req, result)
  }

  return json(req, { error: 'Accion no reconocida.' }, 400)
}
