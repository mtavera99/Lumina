// ============================================================
//  LuminaPR Solar Solutions — Fuente de verdad de la campana
//  Basado en el blueprint de marketing (grupo Atabaya).
// ============================================================

export const BRAND = {
  company: 'Lumina PR Solar Solutions',
  group: 'Grupo Atabaya',
  tagline: 'Tu hogar merece energia que nunca te abandone.',
  valueProp:
    'Reduce tu factura electrica y protege tu hogar de los apagones con un sistema solar residencial financiado. Sin pagar todo de contado. Sin complicaciones. Con acompanamiento completo.',
  offer: 'Evaluacion Solar Gratuita',
  contactClient: 'Eric',
  lead: 'Santiago Tavera',
  colors: {
    navy: '#0A2342',
    gold: '#C9A84C',
  },
}

export const COLORS = [
  { name: 'Navy', hex: '#0A2342', use: 'Color primario de marca' },
  { name: 'Oro', hex: '#C9A84C', use: 'Acento / CTA' },
  { name: 'Navy 700', hex: '#143B6B', use: 'Superficies oscuras' },
  { name: 'Oro suave', hex: '#E0C877', use: 'Detalles / highlights' },
]

// -------------------- Pilares del mensaje --------------------
export type PillarKey = 'respaldo' | 'ahorro' | 'independencia' | 'financiamiento' | 'confianza'

export const PILLARS: { key: PillarKey; label: string; icon: string; desc: string }[] = [
  { key: 'respaldo', label: 'Respaldo', icon: '🔋', desc: 'Manten funcionando lo esencial durante apagones.' },
  { key: 'ahorro', label: 'Ahorro', icon: '💰', desc: 'Reduce la factura desde el primer mes.' },
  { key: 'independencia', label: 'Independencia', icon: '⚡', desc: 'Menos dependencia de LUMA.' },
  { key: 'financiamiento', label: 'Financiamiento', icon: '📅', desc: 'Sin pagar todo de contado, desde $150/mes.' },
  { key: 'confianza', label: 'Confianza', icon: '🤝', desc: 'Acompanamiento completo: evaluacion, diseno, instalacion, seguimiento.' },
]

export const pillarLabel = (k: PillarKey) => PILLARS.find((p) => p.key === k)?.label ?? k

// -------------------- CTAs aprobados --------------------
export const CTAS = [
  'Solicita tu evaluacion gratuita →',
  'Calcula tu ahorro solar',
  'Descubre si tu hogar califica',
  'Habla con un asesor hoy',
  'Conoce cuanto podrias ahorrar',
  'Da el primer paso → independencia energetica',
]

// -------------------- Financiamiento --------------------
export interface FinancingRow {
  system: string
  kw: number
  panels: number
  value: number
  term: number
  rate: number
  monthly: number
  message: string
}

export const FINANCING: FinancingRow[] = [
  { system: '5kW · 8 placas + bateria', kw: 5, panels: 8, value: 18000, term: 20, rate: 7.95, monthly: 150, message: 'Respaldado por menos de $5/dia' },
  { system: '5kW · 8 placas + bateria', kw: 5, panels: 8, value: 18000, term: 15, rate: 6.95, monthly: 161, message: 'Independencia accesible' },
  { system: '10kW · 12 placas + bateria', kw: 10, panels: 12, value: 30000, term: 20, rate: 7.95, monthly: 250, message: 'Potencia completa para tu familia' },
  { system: '10kW · 12 placas + bateria', kw: 10, panels: 12, value: 30000, term: 15, rate: 6.95, monthly: 269, message: 'Maximo ahorro a mediano plazo' },
  { system: '15kW · 15 placas + bateria', kw: 15, panels: 15, value: 45000, term: 20, rate: 7.95, monthly: 369, message: 'Solucion premium para hogar grande' },
  { system: '15kW · 15 placas + bateria', kw: 15, panels: 15, value: 45000, term: 15, rate: 6.95, monthly: 394, message: 'Alto rendimiento, mayor ahorro' },
]

// -------------------- Presupuesto (Fase Validacion Mes 1) --------------------
export const BUDGET = {
  total: 2000,
  stages: [
    { key: 'top', label: 'Awareness (Top)', pct: 40, amount: 800, objective: 'Captar nuevos propietarios desconocedores de Lumina', color: '#C9A84C' },
    { key: 'mid', label: 'Consideracion (Mid)', pct: 35, amount: 700, objective: 'Nutrir interes, generar leads calificados', color: '#143B6B' },
    { key: 'bottom', label: 'Remarketing (Bottom)', pct: 25, amount: 500, objective: 'Recapturar intencion no completada', color: '#1F9D63' },
  ],
}

// -------------------- KPIs objetivo --------------------
export const KPIS = [
  { label: 'CPL (costo por lead)', value: '$20-$40', sub: 'Meta de eficiencia' },
  { label: 'Leads mes 1', value: '50-100', sub: 'Volumen objetivo' },
  { label: '% leads calificados', value: '≥60%', sub: 'Calidad del lead' },
  { label: 'Citas agendadas', value: '30%', sub: 'de calificados' },
  { label: 'Tasa de cierre', value: '≥40%', sub: 'de citas' },
  { label: 'Tiempo de respuesta', value: '<10 min', sub: 'Lead rapido vale 5x' },
  { label: 'CTR anuncio', value: '≥1.5%', sub: 'Rendimiento creativo' },
  { label: 'CPA', value: '<$1,000', sub: 'Costo por adquisicion' },
]

// -------------------- Funnel (6 pasos) --------------------
export const FUNNEL = [
  { title: 'Atraccion', desc: 'Meta Ads + organico. Mensajes: factura alta, apagones, ahorro, evaluacion gratuita. Audiencia: propietarios 30-65 en PR.' },
  { title: 'Educacion', desc: 'Contenido que responde dudas (como funciona, bateria, financiamiento). Carruseles, reels, videos.' },
  { title: 'Conversion', desc: 'Landing + formulario: nombre, telefono, municipio, tipo de vivienda, factura mensual, interes en bateria/financiamiento.' },
  { title: 'Calificacion', desc: 'Filtro interno: casa propia, factura suficiente, zona atendida, apertura a financiamiento.' },
  { title: 'Seguimiento', desc: 'Contacto en menos de 10 minutos. Un lead respondido rapido vale 5x mas.' },
  { title: 'Remarketing', desc: 'Testimonios, casos de exito, recordatorio de evaluacion gratuita.' },
]

// -------------------- Posicionamiento vs competencia --------------------
export const COMPETITORS = [
  { name: 'WindMar Home', strength: 'Autoridad, Tesla Powerwall, volumen', diff: 'Comunicacion mas cercana, educativa, calidad de proceso' },
  { name: 'ProSolar PR', strength: 'Ahorro + storage, clientes ya educados', diff: 'Contenido pedagogico para quien no entiende el solar' },
  { name: 'ISO Solar', strength: 'Autoridad tecnica, marcas premium', diff: 'Traducir marcas en beneficios reales, no solo nombres' },
  { name: 'Power Solar PR', strength: 'Mensajes directos de ahorro', diff: 'Narrativa emocional: proteger el hogar, depender menos de LUMA' },
]

export const DIFFERENTIATORS = ['Claridad en la comunicacion', 'Confianza en el proceso', 'Educacion del cliente antes de vender']

// -------------------- Biblioteca de creativos --------------------
export type FunnelStage = 'top' | 'mid' | 'bottom'

export interface AdCreative {
  id: string
  stage: FunnelStage
  pillar: PillarKey
  format: string
  headline: string
  primary: string
  description: string
  cta: string
}

export const STAGE_LABEL: Record<FunnelStage, string> = {
  top: 'Awareness',
  mid: 'Consideracion',
  bottom: 'Remarketing',
}

export const ADS: AdCreative[] = [
  // ---------- TOP / AWARENESS ----------
  {
    id: 'top-respaldo',
    stage: 'top',
    pillar: 'respaldo',
    format: 'Imagen / Reel',
    headline: 'Que se dane la comida en el proximo apagon no puede ser tu plan',
    primary:
      'Cada vez que se va la luz, corres el riesgo de perder la comida de la nevera, quedarte sin internet y pasar la noche con calor.\n\nUn sistema solar con bateria mantiene funcionando lo esencial de tu hogar aunque LUMA se caiga. Nevera, abanicos, internet, tu rutina… sigue.\n\nEn Lumina te explicamos como funciona, paso a paso, antes de que decidas nada.',
    description: 'Respaldo real para tu hogar durante los apagones.',
    cta: 'Descubre si tu hogar califica',
  },
  {
    id: 'top-ahorro',
    stage: 'top',
    pillar: 'ahorro',
    format: 'Imagen / Reel',
    headline: 'Tu factura de luz sube y sube. Tu casa puede empezar a producir la suya.',
    primary:
      'La factura de la luz en Puerto Rico no da tregua. Y seguira subiendo.\n\nCon un sistema solar, tu techo empieza a generar tu propia energia y tu factura baja desde el primer mes. Lo mejor: no tienes que pagarlo todo de contado.\n\nTe ayudamos a entender cuanto podrias ahorrar segun tu consumo real, sin compromiso.',
    description: 'Reduce tu factura desde el primer mes.',
    cta: 'Conoce cuanto podrias ahorrar',
  },
  {
    id: 'top-independencia',
    stage: 'top',
    pillar: 'independencia',
    format: 'Reel / Video corto',
    headline: 'Cuanto tiempo mas vas a depender de LUMA?',
    primary:
      'Apagones sin aviso. Facturas que no bajan. La sensacion de que no controlas la energia de tu propia casa.\n\nMiles de familias en PR ya estan dando el paso hacia la independencia energetica con energia solar. Menos dependencia de la red, mas control de tu hogar.\n\nEn Lumina te acompanamos en todo el proceso, con explicaciones claras y sin letra chiquita.',
    description: 'Toma el control de la energia de tu hogar.',
    cta: 'Da el primer paso → independencia energetica',
  },
  {
    id: 'top-financiamiento',
    stage: 'top',
    pillar: 'financiamiento',
    format: 'Imagen',
    headline: 'Y si pudieras tener paneles solares desde $150 al mes?',
    primary:
      'Mucha gente cree que la energia solar es solo para quien puede pagar miles de dolares de contado. No es asi.\n\nCon financiamiento, puedes empezar desde $150 al mes — en muchos casos, menos de lo que pagas hoy de luz. Tu factura trabaja para ti, no en tu contra.\n\nCalcula tu opcion sin compromiso y con acompanamiento de principio a fin.',
    description: 'Desde $150/mes. Sin pagar todo de contado.',
    cta: 'Calcula tu ahorro solar',
  },
  {
    id: 'top-confianza',
    stage: 'top',
    pillar: 'confianza',
    format: 'Video / Carrusel',
    headline: 'Energia solar sin letra chiquita ni sorpresas',
    primary:
      'Sabemos que instalar paneles solares es una decision grande. Por eso en Lumina no empezamos vendiendote: empezamos explicandote.\n\nEvaluamos tu factura, diseñamos el sistema para tu hogar, lo instalamos y te damos seguimiento. Tu entiendes cada paso antes de decidir.\n\nAsi trabajamos: con claridad y acompanamiento completo.',
    description: 'Acompanamiento completo, de principio a fin.',
    cta: 'Habla con un asesor hoy',
  },
  // ---------- MID / CONSIDERACION ----------
  {
    id: 'mid-financiamiento',
    stage: 'mid',
    pillar: 'financiamiento',
    format: 'Carrusel educativo',
    headline: 'Cuanto cuesta realmente un sistema solar? Te lo explicamos claro',
    primary:
      'La pregunta #1 que nos hacen: "y eso cuanto me sale?"\n\nEn vez de un numero gigante que asusta, mira las cuotas reales:\n\n• 5kW + bateria → desde $150/mes\n• 10kW + bateria → desde $250/mes\n• 15kW + bateria → desde $369/mes\n\nEn muchos casos la cuota es parecida o menor a tu factura actual de LUMA. Con la evaluacion gratuita te decimos exactamente cual encaja con tu hogar.',
    description: 'Planes desde $150/mes segun tu consumo.',
    cta: 'Solicita tu evaluacion gratuita →',
  },
  {
    id: 'mid-confianza',
    stage: 'mid',
    pillar: 'confianza',
    format: 'Carrusel / Video',
    headline: 'Que incluye la evaluacion solar gratuita de Lumina',
    primary:
      'Antes de hablar de instalar nada, hacemos esto contigo (gratis y sin compromiso):\n\n✔ Revisamos tu factura real\n✔ Analizamos tu consumo\n✔ Recomendacion preliminar del sistema\n✔ Estimacion de tu ahorro\n✔ Opciones de financiamiento\n✔ Orientacion sobre baterias\n\nAsi tomas la decision informado, no a ciegas. Eso es lo que nos diferencia.',
    description: 'Todo lo que recibes, gratis y sin compromiso.',
    cta: 'Solicita tu evaluacion gratuita →',
  },
  {
    id: 'mid-respaldo',
    stage: 'mid',
    pillar: 'respaldo',
    format: 'Reel educativo',
    headline: 'Que pasa con mis paneles cuando se va la luz? (spoiler: depende de la bateria)',
    primary:
      'Mucha gente no sabe esto: unos paneles solares sin bateria se apagan durante un apagon.\n\nLa bateria es la que guarda tu energia para que tu hogar siga funcionando cuando LUMA falla. Por eso en Lumina te explicamos cuando tiene sentido incluirla segun tu caso.\n\nNo se trata de venderte lo mas caro, sino lo correcto para tu hogar.',
    description: 'Entiende el rol de la bateria antes de decidir.',
    cta: 'Habla con un asesor hoy',
  },
  {
    id: 'mid-ahorro',
    stage: 'mid',
    pillar: 'ahorro',
    format: 'Imagen con calculadora',
    headline: 'Cuanto podrias ahorrar? Depende de tu factura actual',
    primary:
      'Si tu factura de luz ronda los $200, $300 o mas al mes, probablemente estas pagando de mas.\n\nCon un sistema solar bien dimensionado, gran parte de ese dinero se convierte en tu cuota — que al final es tuya, no de LUMA.\n\nHaz el ejercicio con nosotros: metemos tu consumo real y te mostramos el estimado de ahorro para tu hogar.',
    description: 'Estimacion personalizada segun tu consumo.',
    cta: 'Calcula tu ahorro solar',
  },
  // ---------- BOTTOM / REMARKETING ----------
  {
    id: 'bottom-confianza',
    stage: 'bottom',
    pillar: 'confianza',
    format: 'Testimonio en video',
    headline: 'Familias en PR que ya no le temen al proximo apagon',
    primary:
      'Empezaron con la misma duda que tu: "sera para mi? me conviene?"\n\nHoy tienen su factura bajo control y respaldo cuando se va la luz. Mira lo que cuentan nuestros clientes sobre el proceso con Lumina.\n\nTu evaluacion gratuita sigue disponible. Damos el paso contigo, a tu ritmo.',
    description: 'Casos reales de clientes Lumina.',
    cta: 'Solicita tu evaluacion gratuita →',
  },
  {
    id: 'bottom-financiamiento',
    stage: 'bottom',
    pillar: 'financiamiento',
    format: 'Imagen recordatorio',
    headline: 'Todavia pensandolo? Tu evaluacion gratuita te espera',
    primary:
      'Sabemos que es una decision importante y esta bien tomarse el tiempo.\n\nPero recuerda: cada mes que pasa es otra factura alta pagada a LUMA. Con planes desde $150/mes, ese dinero podria estar construyendo tu independencia energetica.\n\nRetoma tu evaluacion gratuita cuando quieras. Sin compromiso.',
    description: 'Retoma donde lo dejaste. Desde $150/mes.',
    cta: 'Conoce cuanto podrias ahorrar',
  },
  {
    id: 'bottom-respaldo',
    stage: 'bottom',
    pillar: 'respaldo',
    format: 'Reel / Imagen',
    headline: 'El proximo apagon va a llegar. Tu hogar va a estar listo?',
    primary:
      'No sabemos cuando, pero sabemos que va a pasar otra vez.\n\nLas familias que ya dieron el paso con Lumina no pierden la comida, no se quedan sin internet y no dependen de que LUMA "resuelva".\n\nTermina tu evaluacion gratuita y prepara tu hogar antes del proximo apagon.',
    description: 'Preparate antes del proximo apagon.',
    cta: 'Descubre si tu hogar califica',
  },
]

// -------------------- Pilares de contenido organico --------------------
export const ORGANIC_PILLARS = [
  { title: 'Educacion', desc: 'Como funciona el solar, que es una bateria, que pasa cuando llueve, que incluye una evaluacion.' },
  { title: 'Confianza', desc: 'Instalaciones reales, equipo tecnico en campo, antes/despues, detras de camaras.' },
  { title: 'Prueba social', desc: 'Testimonios en video, casos de exito, ahorros estimados, clientes satisfechos.' },
  { title: 'Conversion', desc: 'Evaluacion gratuita, cotizacion en 48h, opciones de financiamiento, agenda con asesor.' },
]

export const PR_MUNICIPIOS = [
  'San Juan', 'Bayamon', 'Carolina', 'Ponce', 'Caguas', 'Guaynabo', 'Arecibo', 'Toa Baja',
  'Mayaguez', 'Trujillo Alto', 'Toa Alta', 'Vega Baja', 'Humacao', 'Dorado', 'Manati',
  'Cayey', 'Fajardo', 'Aguadilla', 'Cidra', 'Otro',
]


// ============================================================
//  Prompts de imagenes (Nano Banana / Gemini / Midjourney)
//  Basados en los creativos de la biblioteca de anuncios.
// ============================================================

export interface ImagePrompt {
  id: string
  adId: string // referencia al creativo de ADS
  title: string
  pillar: PillarKey
  stage: FunnelStage
  aspect: string // formato recomendado en Meta
  prompt: string
  tips: string
}

// Nota de arte: navy #0A2342 y oro #C9A84C como acentos. Fotografia realista,
// luz calida de Puerto Rico, personas latinas/caribenas reales, sin texto dentro
// de la imagen (el texto se anade como overlay en Meta o en Canva).
export const IMAGE_PROMPTS: ImagePrompt[] = [
  {
    id: 'img-top-respaldo',
    adId: 'top-respaldo',
    title: 'Apagon vs. hogar iluminado',
    pillar: 'respaldo',
    stage: 'top',
    aspect: '4:5 (feed) · 1080x1350',
    prompt:
      'Fotografia realista, hora azul en un vecindario residencial de Puerto Rico durante un apagon: casas vecinas a oscuras y, en el centro, una casa de familia con las luces calidas encendidas y una nevera visible funcionando por la ventana. Familia latina relajada en la sala. Nube de tormenta disipandose al fondo. Iluminacion calida y acogedora contrastando con el azul oscuro del entorno. Acentos de color azul marino profundo y dorado. Composicion con espacio negativo limpio en el tercio superior para colocar texto despues. Estilo editorial, alta calidad, luz natural caribena.',
    tips: 'Deja el tercio superior despejado para el titular. Genera 3-4 variantes y elige la de mejor contraste luz/oscuridad.',
  },
  {
    id: 'img-top-ahorro',
    adId: 'top-ahorro',
    title: 'Techo solar + factura que baja',
    pillar: 'ahorro',
    stage: 'top',
    aspect: '1:1 (feed) · 1080x1080',
    prompt:
      'Fotografia aerea realista de una casa residencial tipica de Puerto Rico con paneles solares modernos en el techo, bajo un cielo despejado y sol brillante del Caribe. Palmeras alrededor, colores vibrantes de la vegetacion tropical. Sensacion de prosperidad y calma. Paleta con acentos azul marino y dorado calido del atardecer. Composicion equilibrada con cielo amplio arriba para texto. Nitida, luz dorada, aspecto premium y confiable.',
    tips: 'El cielo amplio arriba es ideal para overlay del copy. Evita gente en esta toma para enfocar en el producto/beneficio.',
  },
  {
    id: 'img-top-independencia',
    adId: 'top-independencia',
    title: 'Dueno tomando el control',
    pillar: 'independencia',
    stage: 'top',
    aspect: '9:16 (Reels/Stories) · 1080x1920',
    prompt:
      'Retrato vertical realista de un propietario puertorriqueno de unos 45 anos, de pie con confianza frente a su casa con paneles solares al atardecer, brazos cruzados y sonrisa serena. Luz dorada de hora magica. Al fondo, su hogar bien iluminado. Ambiente de orgullo y control. Acentos azul marino y dorado. Encuadre vertical dejando espacio en la parte inferior para texto y boton de llamada a la accion. Fotografia documental, calida, autentica, sin poses artificiales.',
    tips: 'Para Reels/Stories deja libre el 20% inferior (zona de CTA) y evita elementos importantes en los bordes que la interfaz tapa.',
  },
  {
    id: 'img-top-financiamiento',
    adId: 'top-financiamiento',
    title: 'Desde $150/mes (concepto visual)',
    pillar: 'financiamiento',
    stage: 'top',
    aspect: '1:1 (feed) · 1080x1080',
    prompt:
      'Fotografia realista y luminosa de una pareja joven puertorriquena feliz en la puerta de su casa con paneles solares, sosteniendo un cafe por la manana, ambiente relajado y accesible. Casa de clase media tipica de PR. Luz matutina suave y calida. Sensacion de que la energia solar es alcanzable y cotidiana. Acentos azul marino y dorado. Espacio limpio a un costado para colocar el precio y el texto. Estilo lifestyle, natural, cercano.',
    tips: 'No pongas el precio dentro de la imagen generada: anadelo como overlay para poder hacer variantes de precio sin regenerar.',
  },
  {
    id: 'img-mid-confianza',
    adId: 'mid-confianza',
    title: 'Equipo tecnico en instalacion',
    pillar: 'confianza',
    stage: 'mid',
    aspect: '4:5 (feed) · 1080x1350',
    prompt:
      'Fotografia documental realista de un equipo de dos tecnicos profesionales instalando paneles solares en el techo de una casa en Puerto Rico, con casco y equipo de seguridad, trabajando con cuidado bajo cielo azul. Ambiente profesional, confiable y humano. Detalle de manos y herramientas. Luz natural diurna. Acentos azul marino y dorado en uniformes o detalles. Composicion con aire arriba para texto. Autentico, sin stock genrico, aspecto de marca seria.',
    tips: 'Refuerza el pilar de confianza. Ideal tambien como foto real de tus instalaciones si las tienes: usa el prompt como guia de estilo.',
  },
  {
    id: 'img-bottom-confianza',
    adId: 'bottom-confianza',
    title: 'Familia satisfecha (testimonio)',
    pillar: 'confianza',
    stage: 'bottom',
    aspect: '1:1 (feed) · 1080x1080',
    prompt:
      'Retrato calido y realista de una familia puertorriquena de tres generaciones sonriendo frente a su casa con paneles solares, ambiente hogareno y feliz al atardecer. Sensacion de tranquilidad y seguridad. Luz dorada suave. Acentos azul marino y dorado. Composicion centrada con espacio arriba y abajo para nombre del cliente y texto de testimonio. Fotografia autentica, emotiva, alta calidad.',
    tips: 'Para remarketing funciona mejor con cara humana y emocion. Combina con un testimonio real corto como overlay.',
  },
]

// ============================================================
//  Configuracion de la campana en Meta (paso a paso, optimizada)
// ============================================================

export interface ConfigStep {
  detail: string
  tip?: string
}

export interface ConfigPhase {
  phase: string
  icon: string
  goal: string
  steps: ConfigStep[]
}

export const CAMPAIGN_CONFIG: ConfigPhase[] = [
  {
    phase: '0. Preparacion (antes de abrir Meta)',
    icon: '🧰',
    goal: 'Tener todo listo para no improvisar dentro del administrador de anuncios.',
    steps: [
      { detail: 'Cuenta de Meta Business Suite creada y con acceso de administrador a la pagina de Facebook e Instagram de Lumina.' },
      { detail: 'Cuenta publicitaria configurada con metodo de pago y moneda en USD.' },
      { detail: 'Pixel de Meta instalado en la landing y evento "Lead" configurado.', tip: 'Sin el pixel + evento Lead, Meta no puede optimizar por conversiones. Es lo primero.' },
      { detail: 'Landing publicada y probada en movil (la mayoria del trafico sera movil).' },
      { detail: 'Creativos e imagenes listos (usa la Biblioteca de Anuncios y la seccion de Prompts de Imagenes).' },
    ],
  },
  {
    phase: '1. Objetivo de la campana',
    icon: '🎯',
    goal: 'Elegir el objetivo correcto: buscamos contactos, no solo alcance.',
    steps: [
      { detail: 'Crear campana nueva y elegir el objetivo "Clientes potenciales" (Leads).', tip: 'Es el objetivo disenado para captar datos de contacto de gente interesada.' },
      { detail: 'Metodo de conversion recomendado: "Sitio web" apuntando a tu landing con el evento Lead. Alternativa a testear: "Formularios instantaneos" (Instant Forms) dentro de Meta.', tip: 'Sitio web da leads mas calificados; los formularios instantaneos dan mas volumen y CPL mas bajo. Puedes probar ambos.' },
      { detail: 'Nombrar la campana con convencion clara, ej: "LUMINA | Leads | Validacion Mes 1".' },
    ],
  },
  {
    phase: '2. Presupuesto y estructura',
    icon: '💵',
    goal: 'Repartir los $2,000 del mes 1 por etapa del funnel.',
    steps: [
      { detail: 'Estructura: 1 Campana → 3 Conjuntos de anuncios (Awareness, Consideracion, Remarketing) → varios anuncios por conjunto.' },
      { detail: 'Awareness 40% (~$800) · Consideracion 35% (~$700) · Remarketing 25% (~$500).', tip: 'Empieza con presupuesto por conjunto (ABO) para controlar el gasto de cada etapa mientras validas.' },
      { detail: 'Presupuesto diario aproximado por conjunto: Awareness ~$27/dia, Consideracion ~$23/dia, Remarketing ~$17/dia (30 dias).' },
      { detail: 'Cuando ya sepas que creativos/publicos ganan, migra a Advantage+ (CBO) para que Meta reparta solo.', tip: 'No uses CBO desde el dia 1: primero necesitas datos de que funciona.' },
    ],
  },
  {
    phase: '3. Publicos (conjuntos de anuncios)',
    icon: '👥',
    goal: 'Mostrar cada mensaje a la audiencia correcta del funnel.',
    steps: [
      { detail: 'Ubicacion: Puerto Rico. Puedes segmentar por municipios prioritarios donde ya instalas.' },
      { detail: 'Edad 30-65, todos los generos. Enfoque en propietarios de vivienda.' },
      { detail: 'AWARENESS (frio): intereses como energia solar, ahorro de energia, mejoras del hogar, sostenibilidad, propietarios de vivienda. Activa expansion de publico Advantage+.', tip: 'En frio, deja que Meta amplie el publico; da mejores resultados que segmentar demasiado.' },
      { detail: 'CONSIDERACION: publico similar (Lookalike 1-3%) basado en visitantes de la landing o leads previos.' },
      { detail: 'REMARKETING: visitantes de la landing ultimos 30 dias que NO enviaron el formulario, y personas que interactuaron con los anuncios/pagina.', tip: 'Este es el publico mas barato de convertir: no lo descuides.' },
    ],
  },
  {
    phase: '4. Optimizacion y entrega',
    icon: '⚙️',
    goal: 'Configurar como Meta gasta y aprende.',
    steps: [
      { detail: 'Evento de optimizacion: "Lead" (conversion en tu landing).' },
      { detail: 'Ubicaciones: usa "Advantage+ (automaticas)" para que Meta encuentre lo mas barato.', tip: 'Manuales solo cuando ya tengas datos que justifiquen excluir alguna ubicacion.' },
      { detail: 'Ventana de atribucion: 7 dias clic / 1 dia visualizacion (estandar).' },
      { detail: 'Programacion: campana activa 24/7 durante la fase de validacion para recoger datos.' },
    ],
  },
  {
    phase: '5. Anuncios',
    icon: '🖼️',
    goal: 'Cargar los creativos con orden para poder medir que gana.',
    steps: [
      { detail: 'Carga 2-3 anuncios por conjunto, cada uno con un pilar distinto (respaldo, ahorro, financiamiento...).', tip: 'Usa las variantes A/B de la Biblioteca de Anuncios: mismo publico, distinto angulo.' },
      { detail: 'Formatos: imagen 1:1 y 4:5 para feed, y video/imagen 9:16 para Reels y Stories.' },
      { detail: 'Copia el titular, texto principal, descripcion y CTA desde la Biblioteca de Anuncios (boton copiar).' },
      { detail: 'Enlaza a la landing con parametros UTM para medir en Meta y en tu analitica.', tip: 'Nunca lideres con el precio total; siempre con la cuota mensual (desde $150/mes).' },
    ],
  },
  {
    phase: '6. Lanzamiento y aprendizaje',
    icon: '🚀',
    goal: 'Publicar y NO tocar mientras Meta aprende.',
    steps: [
      { detail: 'Revisa el checklist de pre-lanzamiento (abajo) y publica.' },
      { detail: 'Fase de aprendizaje: Meta necesita ~50 conversiones por conjunto por semana para estabilizar.', tip: 'No edites presupuestos ni publicos los primeros 3-4 dias: reinicia el aprendizaje.' },
      { detail: 'Responde cada lead en menos de 10 minutos. Un lead contactado rapido vale hasta 5x mas.' },
    ],
  },
  {
    phase: '7. Optimizacion continua',
    icon: '📈',
    goal: 'Escalar lo que funciona, cortar lo que no.',
    steps: [
      { detail: 'A los 4-5 dias: pausa anuncios con CTR < 1% o CPL muy alto; sube presupuesto a los ganadores.' },
      { detail: 'Vigila el CPL objetivo ($20-$40) y el % de leads calificados (>=60%).', tip: 'Un CPL bajo con leads malos no sirve. Mide calidad, no solo cantidad.' },
      { detail: 'Escala presupuesto de a 20-30% cada 3-4 dias para no reiniciar el aprendizaje.' },
      { detail: 'Refresca creativos cada 2-3 semanas para evitar fatiga de anuncio (frecuencia > 2-3).' },
    ],
  },
]

export const LAUNCH_CHECKLIST = [
  'Pixel activo y evento "Lead" disparando correctamente (probado con el Test Events de Meta)',
  'Landing carga rapido y el formulario funciona en movil',
  'Metodo de pago verificado en la cuenta publicitaria',
  'Presupuesto repartido 40/35/25 entre los 3 conjuntos',
  '2-3 anuncios por conjunto, con pilares distintos',
  'Formatos 1:1, 4:5 y 9:16 subidos',
  'Copias pegadas desde la Biblioteca de Anuncios (cuota mensual, no precio total)',
  'UTMs anadidos a los enlaces',
  'Publico de remarketing creado (visitantes que no convirtieron)',
  'Plan de respuesta a leads en < 10 minutos definido con el equipo',
]
