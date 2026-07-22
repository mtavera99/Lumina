const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim() ?? ''
const INTELLIGENCE_API_URL = (import.meta.env.VITE_INTELLIGENCE_API_URL as string | undefined)?.trim() ?? ''
const ALLOWED_EMAIL = 'mtavera99@gmail.com'

const GOOGLE_SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/calendar.events.readonly',
].join(' ')

const GIS_SCRIPT = 'https://accounts.google.com/gsi/client'
let cachedSession: GoogleSession | null = null
let cachedWorkspace: WorkspaceSync | null = null

interface GoogleTokenResponse {
  access_token?: string
  expires_in?: number
  error?: string
  error_description?: string
}

interface GoogleTokenClient {
  requestAccessToken(options?: { prompt?: string }): void
}

interface GoogleAccountsOAuth2 {
  initTokenClient(config: {
    client_id: string
    scope: string
    callback: (response: GoogleTokenResponse) => void
    error_callback?: (error: { type?: string; message?: string }) => void
  }): GoogleTokenClient
  revoke(token: string, callback?: () => void): void
}

declare global {
  interface Window {
    google?: { accounts: { oauth2: GoogleAccountsOAuth2 } }
  }
}

export interface GoogleSession {
  accessToken: string
  expiresAt: number
  email: string
  name: string
  picture?: string
}

export interface ReadAiReport {
  id: string
  subject: string
  sender: string
  receivedAt: string
  preview: string
  reportUrl?: string
}

export interface CalendarMeeting {
  id: string
  title: string
  startsAt: string
  endsAt: string
  attendees: string[]
  meetingUrl?: string
  status: string
}

export interface WorkspaceSync {
  reports: ReadAiReport[]
  calendar: CalendarMeeting[]
  warnings: string[]
  syncedAt: number
}

export interface IntelligenceServiceStatus {
  google: boolean
  readAiEmailImport: boolean
  readAiDirect: boolean
  hubspot: boolean
  assistant: boolean
  persistentStorage: boolean
}

export interface ContextSyncResult {
  reports: number
  storedReports: number
  meetings: number
  total: number
  readAi: {
    matchedEmails: number
    trustedEmails: number
    importedReports: number
    emptyBodies: number
    failedMessages: number
    attachmentFailures: number
  }
  readAiDirect: {
    connected: boolean
    processedMeetings: number
    pages: number
    hasMore: boolean
    historyComplete: boolean
  }
  warnings: string[]
  syncedAt: string
}

export interface AgentCitation {
  id: string
  title: string
  date: string | null
  type: 'read_ai' | 'calendar'
  url: string | null
}

export interface AgentAnswer {
  conversationId: string
  answer: string
  citations: AgentCitation[]
}

export const googleWorkspaceConfig = {
  clientId: GOOGLE_CLIENT_ID,
  allowedEmail: ALLOWED_EMAIL,
  configured: Boolean(GOOGLE_CLIENT_ID),
  apiConfigured: Boolean(INTELLIGENCE_API_URL),
  apiOrigin: INTELLIGENCE_API_URL ? new URL(INTELLIGENCE_API_URL).origin : '',
}

export function getCachedGoogleWorkspace(): { session: GoogleSession | null; workspace: WorkspaceSync | null } {
  if (cachedSession && Date.now() >= cachedSession.expiresAt) {
    cachedSession = null
    cachedWorkspace = null
  }
  return { session: cachedSession, workspace: cachedWorkspace }
}

function loadGoogleIdentityServices(): Promise<void> {
  if (window.google?.accounts.oauth2) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SCRIPT}"]`)
    if (existing) {
      let attempts = 0
      const timer = window.setInterval(() => {
        attempts += 1
        if (window.google?.accounts.oauth2) {
          window.clearInterval(timer)
          resolve()
        } else if (attempts >= 100) {
          window.clearInterval(timer)
          reject(new Error('Google Identity Services no respondio.'))
        }
      }, 50)
      return
    }

    const script = document.createElement('script')
    script.src = GIS_SCRIPT
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('No se pudo cargar Google Identity Services.'))
    document.head.appendChild(script)
  })
}

async function googleJson<T>(url: string, accessToken: string): Promise<T> {
  const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: { message?: string } } | null
    throw new Error(body?.error?.message || `Google respondio ${response.status}.`)
  }
  return response.json() as Promise<T>
}

export async function connectGoogleWorkspace(): Promise<GoogleSession> {
  const cached = getCachedGoogleWorkspace().session
  if (cached) return cached
  if (!GOOGLE_CLIENT_ID) throw new Error('Falta configurar VITE_GOOGLE_CLIENT_ID en el despliegue de la aplicacion.')

  await loadGoogleIdentityServices()
  const token = await new Promise<GoogleTokenResponse>((resolve, reject) => {
    const oauth2 = window.google?.accounts.oauth2
    if (!oauth2) {
      reject(new Error('Google Identity Services no esta disponible.'))
      return
    }

    const client = oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: GOOGLE_SCOPES,
      callback: (response) => response.error
        ? reject(new Error(response.error_description || response.error))
        : resolve(response),
      error_callback: (error) => reject(new Error(error.message || 'La autorizacion de Google fue cancelada.')),
    })
    client.requestAccessToken()
  })

  if (!token.access_token) throw new Error('Google no devolvio un token de acceso.')
  const profile = await googleJson<{
    email?: string
    email_verified?: boolean
    name?: string
    picture?: string
  }>('https://www.googleapis.com/oauth2/v3/userinfo', token.access_token)

  if (!profile.email_verified || profile.email?.toLowerCase() !== ALLOWED_EMAIL) {
    window.google?.accounts.oauth2.revoke(token.access_token)
    throw new Error(`Esta seccion solo acepta la cuenta ${ALLOWED_EMAIL}.`)
  }

  cachedSession = {
    accessToken: token.access_token,
    expiresAt: Date.now() + Math.max(0, (token.expires_in ?? 3600) - 60) * 1000,
    email: profile.email,
    name: profile.name || 'Santiago Tavera',
    picture: profile.picture,
  }
  return cachedSession
}

export function disconnectGoogleWorkspace(session: GoogleSession | null): void {
  if (session?.accessToken) window.google?.accounts.oauth2.revoke(session.accessToken)
  cachedSession = null
  cachedWorkspace = null
}

function decodeBase64Url(value: string): string {
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
    const bytes = Uint8Array.from(atob(normalized), (character) => character.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  } catch {
    return ''
  }
}

interface GmailPart {
  mimeType?: string
  body?: { data?: string; attachmentId?: string }
  parts?: GmailPart[]
}

function collectMimeParts(part: GmailPart | undefined, matches: GmailPart[] = []): GmailPart[] {
  if (!part) return matches
  if (['text/plain', 'text/html'].includes(part.mimeType ?? '') && (part.body?.data || part.body?.attachmentId)) matches.push(part)
  for (const child of part.parts ?? []) collectMimeParts(child, matches)
  return matches
}

async function mimePartText(messageId: string, part: GmailPart, accessToken: string): Promise<string> {
  let data = part.body?.data ?? ''
  if (!data && part.body?.attachmentId) {
    const attachment = await googleJson<{ data?: string }>(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${encodeURIComponent(messageId)}/attachments/${encodeURIComponent(part.body.attachmentId)}`,
      accessToken,
    )
    data = attachment.data ?? ''
  }
  if (!data) return ''
  const decoded = decodeBase64Url(data)
  if (part.mimeType !== 'text/html') return decoded.replace(/\r/g, '').trim()
  const documentBody = new DOMParser().parseFromString(decoded, 'text/html').body
  return documentBody.textContent?.replace(/\s+/g, ' ').trim() ?? ''
}

async function collectMessageBody(messageId: string, part: GmailPart | undefined, accessToken: string, snippet = ''): Promise<string> {
  const settled = await Promise.allSettled(collectMimeParts(part).map((candidate) => mimePartText(messageId, candidate, accessToken)))
  const candidates = settled
    .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled')
    .map((result) => result.value)
    .filter(Boolean)
  if (part?.body?.data) candidates.push(decodeBase64Url(part.body.data).trim())
  if (snippet) candidates.push(snippet.trim())
  return [...new Set(candidates)].sort((a, b) => b.length - a.length)[0] ?? ''
}

function findReadReportUrl(text: string): string | undefined {
  const match = text.match(/https:\/\/(?:app\.)?read\.ai\/[^\s<>"')]+/i)
  return match?.[0]?.replace(/&amp;/g, '&')
}

function safeIsoDate(timestamp?: string, fallback?: string): string {
  const preferred = timestamp ? new Date(Number(timestamp)) : new Date(fallback || '')
  return Number.isNaN(preferred.getTime()) ? new Date().toISOString() : preferred.toISOString()
}

function isReadAiSender(...values: string[]): boolean {
  return values.some((value) => [...value.matchAll(/[\w.+-]+@[\w.-]+/g)]
    .some(([email]) => /@(?:[\w-]+\.)*read\.ai$/i.test(email)))
}

function isAuthenticatedReadAiEmail(headers: { name: string; value: string }[]): boolean {
  const values = (name: string) => headers
    .filter((item) => item.name.toLowerCase() === name)
    .map((item) => item.value)
  if (!isReadAiSender(...values('from'))) return false
  const clauses = values('authentication-results')
    .filter((value) => /^\s*mx\.google\.com\s*;/i.test(value))
    .flatMap((value) => value.split(';').slice(1))
  return clauses.some((clause) => (
    (/\bdmarc=pass\b/i.test(clause) && /\bheader\.from=(?:[\w-]+\.)*read\.ai(?:\s|$)/i.test(clause))
    || (/\bdkim=pass\b/i.test(clause) && /\bheader\.(?:d|i)=@?(?:[\w-]+\.)*read\.ai(?:\s|$)/i.test(clause))
    || (/\bspf=pass\b/i.test(clause) && /\bsmtp\.mailfrom=(?:[^\s;@]+@)?(?:[\w-]+\.)*read\.ai(?:\s|$)/i.test(clause))
  ))
}

async function fetchReadAiReports(accessToken: string): Promise<ReadAiReport[]> {
  const queries = [
    'newer_than:2y {from:(read.ai) from:(read-ai)}',
    'newer_than:2y {subject:("Read AI") subject:("meeting report") subject:("reunion report")}',
  ]
  const references = new Map<string, { id: string }>()
  for (const search of queries) {
    const queryReferences = new Map<string, { id: string }>()
    let pageToken = ''
    do {
      const params = new URLSearchParams({ q: search, maxResults: '100' })
      if (pageToken) params.set('pageToken', pageToken)
      const page = await googleJson<{ messages?: { id: string }[]; nextPageToken?: string }>(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?${params}`,
        accessToken,
      )
      for (const reference of page.messages ?? []) queryReferences.set(reference.id, reference)
      pageToken = page.nextPageToken ?? ''
    } while (pageToken && queryReferences.size < 250)
    for (const reference of [...queryReferences.values()].slice(0, 250)) references.set(reference.id, reference)
  }

  const settled = await Promise.allSettled([...references.values()].map(async ({ id }) => {
    const message = await googleJson<{
      id: string
      snippet?: string
      internalDate?: string
      payload?: GmailPart & { headers?: { name: string; value: string }[] }
    }>(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`, accessToken)
    const headers = message.payload?.headers ?? []
    const header = (name: string) => headers.find((item) => item.name.toLowerCase() === name)?.value ?? ''
    if (!isAuthenticatedReadAiEmail(headers)) return null
    const body = await collectMessageBody(message.id, message.payload, accessToken, message.snippet)
    return {
      id: message.id,
      subject: header('subject') || 'Reporte de reunion de Read AI',
      sender: header('from'),
      receivedAt: safeIsoDate(message.internalDate, header('date')),
      preview: (body || 'El correo no incluyo un resumen legible.').slice(0, 3000),
      reportUrl: findReadReportUrl(body),
    }
  }))

  return settled
    .flatMap((result) => result.status === 'fulfilled' && result.value ? [result.value] : [])
    .sort((a, b) => Date.parse(b.receivedAt) - Date.parse(a.receivedAt))
}

interface GoogleCalendarEvent {
  id: string
  summary?: string
  status?: string
  start?: { dateTime?: string; date?: string }
  end?: { dateTime?: string; date?: string }
  attendees?: { email?: string; displayName?: string }[]
  hangoutLink?: string
  location?: string
  description?: string
  conferenceData?: { entryPoints?: { uri?: string; entryPointType?: string }[] }
}

function trustedMeetingUrl(value?: string): string | undefined {
  if (!value) return undefined
  const match = value.match(/https?:\/\/[^\s<>"']+/i)?.[0]
  if (!match) return undefined
  try {
    const host = new URL(match).hostname.toLowerCase()
    const trusted = ['teams.microsoft.com', 'teams.live.com', 'meet.google.com', 'zoom.us', 'webex.com']
    return trusted.some((domain) => host === domain || host.endsWith(`.${domain}`)) ? match : undefined
  } catch {
    return undefined
  }
}

async function fetchCalendarMeetings(accessToken: string): Promise<CalendarMeeting[]> {
  const timeMin = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const timeMax = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
  const events: GoogleCalendarEvent[] = []
  let pageToken = ''

  do {
    const params = new URLSearchParams({
      timeMin,
      timeMax,
      maxResults: '100',
      singleEvents: 'true',
      orderBy: 'startTime',
      conferenceDataVersion: '1',
    })
    if (pageToken) params.set('pageToken', pageToken)

    const page = await googleJson<{ items?: GoogleCalendarEvent[]; nextPageToken?: string }>(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
      accessToken,
    )
    events.push(...(page.items ?? []))
    pageToken = page.nextPageToken ?? ''
  } while (pageToken && events.length < 500)

  return events.map((event) => {
    const conferenceUrl = event.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === 'video')?.uri
    const teamsUrl = event.description?.match(/https:\/\/(?:teams\.microsoft\.com|teams\.live\.com)\/[^\s<>"']+/i)?.[0]
    return {
      id: event.id,
      title: event.summary || 'Reunion sin titulo',
      startsAt: event.start?.dateTime || event.start?.date || '',
      endsAt: event.end?.dateTime || event.end?.date || '',
      attendees: (event.attendees ?? []).map((attendee) => attendee.displayName || attendee.email || '').filter(Boolean),
      meetingUrl: trustedMeetingUrl(teamsUrl) || trustedMeetingUrl(conferenceUrl) || trustedMeetingUrl(event.hangoutLink) || trustedMeetingUrl(event.location),
      status: event.status || 'confirmed',
    }
  })
}

export async function syncGoogleWorkspace(session: GoogleSession): Promise<WorkspaceSync> {
  if (Date.now() >= session.expiresAt) throw new Error('La autorizacion de Google vencio. Vuelve a conectar tu cuenta.')

  const [reportsResult, calendarResult] = await Promise.allSettled([
    fetchReadAiReports(session.accessToken),
    fetchCalendarMeetings(session.accessToken),
  ])
  if (reportsResult.status === 'rejected' && calendarResult.status === 'rejected') {
    throw new Error('Google no permitio leer Gmail ni Calendar. Revisa los permisos concedidos.')
  }

  const warnings: string[] = []
  if (reportsResult.status === 'rejected') warnings.push(`Gmail: ${reportsResult.reason instanceof Error ? reportsResult.reason.message : 'no disponible'}`)
  if (calendarResult.status === 'rejected') warnings.push(`Calendar: ${calendarResult.reason instanceof Error ? calendarResult.reason.message : 'no disponible'}`)

  cachedWorkspace = {
    reports: reportsResult.status === 'fulfilled' ? reportsResult.value : [],
    calendar: calendarResult.status === 'fulfilled' ? calendarResult.value : [],
    warnings,
    syncedAt: Date.now(),
  }
  return cachedWorkspace
}

async function intelligenceRequest<T>(session: GoogleSession, method: 'GET' | 'POST', payload?: unknown): Promise<T> {
  if (!INTELLIGENCE_API_URL) throw new Error('El backend privado de Lumina Intelligence no esta configurado.')
  const response = await fetch(INTELLIGENCE_API_URL, {
    method,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      ...(payload ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(payload ? { body: JSON.stringify(payload) } : {}),
  })
  const body = await response.json().catch(() => null) as (T & { error?: string }) | null
  if (!response.ok) throw new Error(body?.error || `El backend privado respondio ${response.status}.`)
  if (!body) throw new Error('El backend privado devolvio una respuesta vacia.')
  return body
}

export async function fetchIntelligenceStatus(session: GoogleSession): Promise<IntelligenceServiceStatus | null> {
  if (!INTELLIGENCE_API_URL) return null
  const body = await intelligenceRequest<{ services: IntelligenceServiceStatus }>(session, 'GET')
  return body.services
}

export function syncIntelligenceContext(session: GoogleSession): Promise<ContextSyncResult> {
  return intelligenceRequest<ContextSyncResult>(session, 'POST', { action: 'sync' })
}

export function startReadAiConnection(session: GoogleSession): Promise<{ authorizationUrl: string }> {
  return intelligenceRequest<{ authorizationUrl: string }>(session, 'POST', { action: 'read-ai-connect' })
}

export function disconnectReadAiConnection(session: GoogleSession, purgeMemory = false): Promise<{ disconnected: boolean; purged: boolean }> {
  return intelligenceRequest<{ disconnected: boolean; purged: boolean }>(session, 'POST', { action: 'read-ai-disconnect', purgeMemory })
}

export function askLuminaAgent(
  session: GoogleSession,
  message: string,
  conversationId?: string,
): Promise<AgentAnswer> {
  return intelligenceRequest<AgentAnswer>(session, 'POST', { action: 'chat', message, conversationId })
}
