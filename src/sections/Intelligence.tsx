import { useEffect, useMemo, useState } from 'react'
import {
  askLuminaAgent,
  connectGoogleWorkspace,
  disconnectGoogleWorkspace,
  fetchIntelligenceStatus,
  getCachedGoogleWorkspace,
  googleWorkspaceConfig,
  syncGoogleWorkspace,
  syncIntelligenceContext,
  startReadAiConnection,
  disconnectReadAiConnection,
  type AgentCitation,
  type ContextSyncResult,
  type GoogleSession,
  type IntelligenceServiceStatus,
  type WorkspaceSync,
} from '../services/googleWorkspace'

type View = 'resumenes' | 'calendario' | 'agente'
type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string; citations?: AgentCitation[] }

const DATE_FORMAT = new Intl.DateTimeFormat('es-PR', { dateStyle: 'medium', timeStyle: 'short' })
const DATE_ONLY_FORMAT = new Intl.DateTimeFormat('es-PR', { dateStyle: 'medium' })
const SUGGESTIONS = ['¿Que acordamos sobre HubSpot?', 'Prepara mi proxima reunion con Natana', '¿Que tareas siguen pendientes?']
const welcomeMessages = (): ChatMessage[] => [{
  id: 'welcome', role: 'assistant',
  content: 'Hola Santiago. Cuando el backend privado este conectado, podre consultar tus reuniones de Read AI y Calendar con citas verificables.',
}]

function formatDate(value: string | null): string {
  if (!value) return 'Fecha no disponible'
  const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  const date = dateOnly ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3])) : new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return dateOnly ? DATE_ONLY_FORMAT.format(date) : DATE_FORMAT.format(date)
}

function isUpcoming(value: string): boolean { return Boolean(value) && Date.parse(value) >= Date.now() }

export function Intelligence() {
  const cached = getCachedGoogleWorkspace()
  const [session, setSession] = useState<GoogleSession | null>(cached.session)
  const [workspace, setWorkspace] = useState<WorkspaceSync | null>(cached.workspace)
  const [serviceStatus, setServiceStatus] = useState<IntelligenceServiceStatus | null>(null)
  const [privateSync, setPrivateSync] = useState<ContextSyncResult | null>(null)
  const [view, setView] = useState<View>('resumenes')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [syncingContext, setSyncingContext] = useState(false)
  const [readAiConnecting, setReadAiConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string>()
  const [agentInput, setAgentInput] = useState('')
  const [agentLoading, setAgentLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(welcomeMessages)

  const filteredReports = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return workspace?.reports ?? []
    return (workspace?.reports ?? []).filter((report) => `${report.subject} ${report.sender} ${report.preview}`.toLowerCase().includes(normalized))
  }, [query, workspace])
  const upcoming = useMemo(() => (workspace?.calendar ?? []).filter((meeting) => isUpcoming(meeting.startsAt)), [workspace])
  const agentReady = Boolean(session && serviceStatus?.assistant && serviceStatus?.persistentStorage)

  useEffect(() => {
    if (!session || serviceStatus || !googleWorkspaceConfig.apiConfigured) return
    let active = true
    fetchIntelligenceStatus(session)
      .then((status) => { if (active) setServiceStatus(status) })
      .catch((caught) => { if (active) setError(caught instanceof Error ? caught.message : 'No se pudo verificar el backend privado.') })
    return () => { active = false }
  }, [session, serviceStatus])

  const refreshPrivateContext = async (nextSession: GoogleSession) => {
    if (!googleWorkspaceConfig.apiConfigured) return
    setSyncingContext(true)
    try {
      const result = await syncIntelligenceContext(nextSession)
      setPrivateSync(result)
      if (result.warnings.length) setError(`Sincronizacion parcial: ${result.warnings.join(' · ')}`)
    } finally { setSyncingContext(false) }
  }

  useEffect(() => {
    const handleReadAiOAuth = (event: MessageEvent) => {
      if (event.origin !== googleWorkspaceConfig.apiOrigin || event.data?.type !== 'lumina-read-ai-oauth') return
      setReadAiConnecting(false)
      if (!event.data.ok || !session) {
        setError(event.data?.message || 'No se pudo conectar Read AI.')
        return
      }
      setError(null)
      fetchIntelligenceStatus(session)
        .then(async (status) => {
          setServiceStatus(status)
          await refreshPrivateContext(session)
        })
        .catch((caught) => setError(caught instanceof Error ? caught.message : 'No se pudo activar la memoria de Read AI.'))
    }
    window.addEventListener('message', handleReadAiOAuth)
    return () => window.removeEventListener('message', handleReadAiOAuth)
  }, [session])

  const connectReadAi = async () => {
    if (!session || readAiConnecting) return
    const popup = window.open('about:blank', 'lumina-read-ai-oauth', 'popup,width=720,height=760')
    if (!popup) { setError('El navegador bloqueo la ventana de Read AI. Permite ventanas emergentes e intenta nuevamente.'); return }
    setReadAiConnecting(true); setError(null)
    try {
      const { authorizationUrl } = await startReadAiConnection(session)
      popup.location.href = authorizationUrl
    } catch (caught) {
      popup.close(); setReadAiConnecting(false)
      setError(caught instanceof Error ? caught.message : 'No se pudo iniciar la conexion con Read AI.')
    }
  }

  const connect = async () => {
    setLoading(true); setError(null)
    try {
      const nextSession = await connectGoogleWorkspace()
      setSession(nextSession)
      setWorkspace(await syncGoogleWorkspace(nextSession))
      const nextStatus = await fetchIntelligenceStatus(nextSession)
      setServiceStatus(nextStatus)
      if (nextStatus?.persistentStorage) await refreshPrivateContext(nextSession)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo conectar Google Workspace.')
    } finally { setLoading(false) }
  }

  const sync = async () => {
    if (!session) return
    setLoading(true); setError(null)
    try {
      setWorkspace(await syncGoogleWorkspace(session))
      const nextStatus = await fetchIntelligenceStatus(session)
      setServiceStatus(nextStatus)
      if (nextStatus?.persistentStorage) await refreshPrivateContext(session)
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'No se pudo sincronizar.') }
    finally { setLoading(false) }
  }

  const disconnectReadAi = async () => {
    if (!session || readAiConnecting) return
    setReadAiConnecting(true); setError(null)
    try {
      await disconnectReadAiConnection(session)
      const status = await fetchIntelligenceStatus(session)
      setServiceStatus(status)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo desconectar Read AI.')
    } finally { setReadAiConnecting(false) }
  }

  const disconnect = () => {
    if (session && serviceStatus?.readAiDirect) disconnectReadAiConnection(session).catch(() => {})
    disconnectGoogleWorkspace(session)
    setSession(null); setWorkspace(null); setServiceStatus(null); setPrivateSync(null); setQuery(''); setConversationId(undefined)
    setAgentInput(''); setAgentLoading(false); setMessages(welcomeMessages())
  }

  const ask = async (suggestion?: string) => {
    if (!session || !agentReady || agentLoading) return
    const question = (suggestion ?? agentInput).trim()
    if (!question) return
    setAgentInput(''); setAgentLoading(true); setError(null)
    setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'user', content: question }])
    try {
      const result = await askLuminaAgent(session, question, conversationId)
      setConversationId(result.conversationId)
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'assistant', content: result.answer, citations: result.citations }])
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'El agente no pudo responder.')
    } finally { setAgentLoading(false) }
  }

  return (
    <div className="intelligence">
      <section className="intelligence-hero card">
        <div><span className="pill pill-gold">Centro privado</span><h2>El contexto de Lumina, organizado automaticamente</h2><p>Reune Read AI y Google Calendar, y convierte reuniones en respuestas, decisiones y proximos pasos para <b>{googleWorkspaceConfig.allowedEmail}</b>.</p></div>
        <div className="intelligence-hero-action">
          {session ? <><div className="signed-user">{session.picture && <img src={session.picture} alt="" referrerPolicy="no-referrer" />}<div><b>{session.name}</b><span>{session.email}</span></div></div><div className="intelligence-actions"><button className="btn btn-primary" onClick={sync} disabled={loading || syncingContext}>{loading || syncingContext ? 'Sincronizando…' : '↻ Sincronizar'}</button><button className="btn btn-ghost" onClick={connectReadAi} disabled={readAiConnecting}>{readAiConnecting ? 'Procesando…' : serviceStatus?.readAiDirect ? 'Reconectar Read AI' : 'Conectar Read AI'}</button>{serviceStatus?.readAiDirect && <button className="btn btn-ghost" onClick={disconnectReadAi} disabled={readAiConnecting}>Desconectar Read AI</button>}<button className="btn btn-ghost" onClick={disconnect}>Desconectar</button></div></> : <button className="btn btn-primary" onClick={connect} disabled={loading || !googleWorkspaceConfig.configured}>{loading ? 'Conectando…' : 'Conectar mi cuenta de Google'}</button>}
        </div>
      </section>

      {!googleWorkspaceConfig.apiConfigured && <Callout title="Falta enlazar el backend privado" text="Google ya puede mostrar reportes y calendario. Para activar memoria y Agente Lumina, configura VITE_INTELLIGENCE_API_URL con la funcion segura de Netlify." />}
      {error && <Callout title="No se pudo completar la accion" text={error} error />}
      {privateSync && privateSync.storedReports === 0 && <Callout title="El agente aun no tiene memoria de Read AI" text={serviceStatus?.readAiDirect ? 'Read AI esta conectado, pero todavia no devolvio reuniones con contenido. Pulsa Sincronizar nuevamente.' : 'Conecta Read AI directamente para importar resumenes, tareas, temas y transcripciones. Gmail queda disponible solamente como respaldo.'} error />}
      {workspace?.warnings.map((warning) => <Callout key={warning} title="Sincronizacion parcial" text={warning} />)}

      <div className="section-title">Estado de conexiones</div>
      <div className="grid intelligence-connections">
        <ConnectionCard icon="🧠" name="Read AI directo" description="Resumenes, tareas, temas y transcripciones" state={serviceStatus?.readAiDirect ? 'connected' : session ? 'ready' : 'pending'} />
        <ConnectionCard icon="✉️" name="Gmail" description="Respaldo de reportes enviados por Read AI" state={session ? 'connected' : googleWorkspaceConfig.configured ? 'ready' : 'pending'} />
        <ConnectionCard icon="📅" name="Google Calendar" description="Eventos en modo de solo lectura" state={session ? 'connected' : googleWorkspaceConfig.configured ? 'ready' : 'pending'} />
        <ConnectionCard icon="🗄️" name="Memoria privada" description="Contexto protegido en Supabase" state={serviceStatus?.persistentStorage ? 'connected' : 'pending'} />
        <ConnectionCard icon="✦" name="Agente Lumina" description="Respuestas privadas con Gemini" state={serviceStatus?.assistant ? 'connected' : 'pending'} />
      </div>

      {session && workspace ? <>
        <div className="grid intelligence-stats">
          <div className="card stat"><div className="stat-label">Reportes de Read AI</div><div className="stat-value">{privateSync?.storedReports ?? workspace.reports.length}</div><div className="stat-sub">{privateSync ? `${privateSync.reports} procesados ahora · memoria privada` : 'Ultimos 24 meses'}</div></div>
          <div className="card stat"><div className="stat-label">Reuniones proximas</div><div className="stat-value">{upcoming.length}</div><div className="stat-sub">Siguientes 60 dias</div></div>
          <div className="card stat"><div className="stat-label">Ultima sincronizacion</div><div className="stat-value stat-time">{DATE_FORMAT.format(workspace.syncedAt)}</div><div className="stat-sub">{syncingContext ? 'Guardando contexto privado…' : 'Google Workspace conectado'}</div></div>
        </div>

        <div className="intelligence-tabs" role="tablist" aria-label="Vistas de Lumina Intelligence">
          <button className={view === 'resumenes' ? 'active' : ''} onClick={() => setView('resumenes')}>Resumenes</button>
          <button className={view === 'calendario' ? 'active' : ''} onClick={() => setView('calendario')}>Calendario</button>
          <button className={view === 'agente' ? 'active' : ''} onClick={() => setView('agente')}>Agente Lumina</button>
        </div>

        {view === 'resumenes' && <section><div className="intelligence-toolbar"><div><h3>Reportes disponibles</h3><p>Read AI directo alimenta al agente; Gmail se muestra como respaldo.</p></div><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar tema, persona o decision…" /></div><div className="intelligence-list">{filteredReports.map((report) => <article className="card report-card" key={report.id}><div className="report-head"><div><h3>{report.subject}</h3><span>{formatDate(report.receivedAt)} · {report.sender}</span></div>{report.reportUrl && <a className="btn btn-ghost btn-sm" href={report.reportUrl} target="_blank" rel="noreferrer">Abrir en Read AI ↗</a>}</div><p>{report.preview}</p></article>)}{!filteredReports.length && <EmptyState icon="📭" text={query ? 'No encontramos reportes con esa busqueda.' : 'No encontramos correos verificados de Read AI.'} />}</div></section>}

        {view === 'calendario' && <section><div className="intelligence-toolbar"><div><h3>Agenda conectada</h3><p>Reuniones recientes y proximas.</p></div></div><div className="intelligence-list">{workspace.calendar.map((meeting) => <article className="card meeting-card" key={meeting.id}><div className="meeting-date"><span>{formatDate(meeting.startsAt)}</span>{isUpcoming(meeting.startsAt) && <b>Proxima</b>}</div><div className="meeting-body"><h3>{meeting.title}</h3><p>{meeting.attendees.length ? meeting.attendees.join(' · ') : 'Sin participantes visibles'}</p></div>{meeting.meetingUrl && <a className="btn btn-navy btn-sm" href={meeting.meetingUrl} target="_blank" rel="noreferrer">Entrar ↗</a>}</article>)}{!workspace.calendar.length && <EmptyState icon="📅" text="No hay eventos visibles en este rango." />}</div></section>}

        {view === 'agente' && <section className="card agent-chat"><div className="agent-chat-head"><div className="agent-icon">✦</div><div><h3>Agente Lumina</h3><p>{agentReady ? 'Memoria privada y Gemini conectados.' : 'Pendiente de conectar Supabase, Gemini y Netlify.'}</p></div><span className={`connection-state ${agentReady ? 'connected' : 'pending'}`}>● {agentReady ? 'Disponible' : 'Configuracion pendiente'}</span></div><div className="agent-messages" aria-live="polite">{messages.map((message) => <div className={`agent-message ${message.role}`} key={message.id}><b>{message.role === 'assistant' ? 'Lumina' : 'Tu'}</b><p>{message.content}</p>{message.citations?.length ? <div className="agent-citations">{message.citations.map((citation) => citation.url ? <a key={citation.id} href={citation.url} target="_blank" rel="noreferrer">[{citation.id}] {citation.title} · {formatDate(citation.date)}</a> : <span key={citation.id}>[{citation.id}] {citation.title} · {formatDate(citation.date)}</span>)}</div> : null}</div>)}{agentLoading && <div className="agent-message assistant"><b>Lumina</b><p>Analizando reuniones y acuerdos…</p></div>}</div><div className="agent-suggestions">{SUGGESTIONS.map((suggestion) => <button key={suggestion} onClick={() => ask(suggestion)} disabled={!agentReady || agentLoading}>{suggestion}</button>)}</div><form className="agent-input" onSubmit={(event) => { event.preventDefault(); void ask() }}><input value={agentInput} onChange={(event) => setAgentInput(event.target.value)} disabled={!agentReady || agentLoading} maxLength={2000} placeholder={agentReady ? 'Pregunta sobre reuniones, decisiones o pendientes…' : 'Completa la conexion segura para activar el agente'} /><button className="btn btn-navy" disabled={!agentReady || agentLoading || !agentInput.trim()}>Enviar</button></form></section>}
      </> : <section className="card intelligence-empty"><div>🔐</div><h3>Tus reuniones aun no se han cargado</h3><p>Conecta {googleWorkspaceConfig.allowedEmail}. La aplicacion nunca solicita ni guarda tu contrasena.</p></section>}

      <div className="intelligence-privacy"><span>🛡️</span><p><b>Privacidad:</b> Read AI se conecta por OAuth de solo lectura para importar resumenes, temas, tareas y transcripciones; Gmail queda como respaldo. El agente omite enlaces, codigos y credenciales de acceso a reuniones. Los secretos de Supabase, Read AI y Gemini viven solamente en Netlify y la memoria privada; el navegador nunca los recibe.</p></div>
    </div>
  )
}

function Callout({ title, text, error = false }: { title: string; text: string; error?: boolean }) { return <div className={`callout intelligence-setup ${error ? 'intelligence-error' : ''}`}><div className="ico">{error ? '⚠️' : 'ℹ️'}</div><div><h4>{title}</h4><p>{text}</p></div></div> }
function ConnectionCard({ icon, name, description, state }: { icon: string; name: string; description: string; state: 'connected' | 'ready' | 'pending' }) { const labels = { connected: 'Conectado', ready: 'Listo para conectar', pending: 'Pendiente' }; return <div className="card connection-card"><div className="connection-icon">{icon}</div><div><h3>{name}</h3><p>{description}</p><span className={`connection-state ${state}`}>● {labels[state]}</span></div></div> }
function EmptyState({ icon, text }: { icon: string; text: string }) { return <div className="card intelligence-list-empty"><span>{icon}</span><p>{text}</p></div> }
