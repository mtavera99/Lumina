# Campaña de WhatsApp — guía de montaje y bitácora

Guía completa para lanzar y mantener la campaña. Basada en el análisis de la Biblioteca de
Anuncios de Meta (~100 anuncios activos de WindMar en Puerto Rico), en la propuesta comercial
real de Lumina, y en los datos de la campaña anterior.

**Actualizado:** 30 de julio de 2026 — incluye los primeros resultados, el hallazgo de que Meta
cuenta más conversaciones de las que llegan (sección 5.1), la inteligencia competitiva de la
Biblioteca de Anuncios (sección 11) y el flujo de producción de creativos (sección 12).

---

## 1. Qué campaña se monta y por qué

**Una sola campaña: Mensajes a WhatsApp.** No dos en paralelo.

Con $20–25/día no hay presupuesto para dividir. Y hay una razón técnica: Meta necesita ~50
conversiones semanales del evento optimizado para calibrar. Las conversaciones iniciadas tienen
mucho más volumen que los leads de formulario, así que es el único escalón alcanzable con este
presupuesto.

Evidencia que lo respalda:

- La landing corregida recibió **127 visitas y 3 interacciones, cero leads**
- El anuncio anterior a WhatsApp no recibió mensajes, **pero estaba dentro de una campaña
  optimizada por conversiones web**: Meta nunca buscó gente que escribiera. El canal no se probó
- **WindMar no manda tráfico frío a ningún formulario.** Sus vendedores usan `API.WHATSAPP.COM`
  con el botón "Send WhatsApp message". La landing (`ready.windmar.com`) la usa la página
  oficial, no los vendedores
- Natana confirmó que responde rápido, que es el requisito crítico del canal

La landing queda como destino para una segunda campaña más adelante, cuando haya volumen.

---

## 2. ● Antes de gastar un dólar: verificaciones

- [ ] **Probar el enlace de WhatsApp** desde un celular: `https://wa.me/19393755858`. Debe abrir
      el chat con el número correcto y con WhatsApp activo
- [ ] **Configurar el mensaje de bienvenida** en WhatsApp Business (sección 6)
- [ ] **Definir horario de atención** y qué se responde fuera de él
- [ ] **Confirmar que el equipo NO menciona** los $15,000 del incentivo de PR ni el 30% federal:
      ambos programas están inactivos (ver `lumina-contexto.md`, sección 1.1)
- [ ] **Revisar cada flyer** antes de subirlo: que no mencione incentivos vencidos ni cuota
      mensual (ver sección 4)
- [ ] **Apagar el traductor de Chrome** en `facebook.com` (ver sección 9, trampa 10)

---

## 3. Configuración real publicada

Esta es la configuración que quedó al aire el 27–28 de julio de 2026, no una propuesta.

### 3.1 Campaña

**Pantalla "Selecciona una configuración de campaña":** elegir **"Campaña de participación
manual"**, nunca *"Campaña de mensajes personalizados"*.

La opción "personalizada/optimizada" trae **ubicaciones Advantage+** preestablecidas, es decir
Audience Network y Estados de WhatsApp activados de fábrica: exactamente el inventario que
tenemos que excluir. Con la ruta manual se configuran las ubicaciones a mano desde el principio.

| Campo | Valor |
|---|---|
| Nombre | `LUMINA \| WhatsApp \| Inspección` |
| Objetivo | **Compromiso** / *Interacción* (varía la traducción según la cuenta) |
| Tipo de compra | Subasta |
| Anuncio de vídeo en directo | Apagado |
| Advantage+ campaña | **Apagado** |
| Estrategia presupuestaria | **Presupuesto del conjunto de anuncios** |
| Compartir hasta 20% con otros conjuntos | **DESMARCADO** |
| Estrategia de puja | Costo más bajo / *Highest volume*, **sin límite de puja** |

> **Trampa confirmada:** si dejas activo el reparto de presupuesto del 20%, Meta **bloquea el
> objetivo de rendimiento** y no lo podrás cambiar después sin duplicar el conjunto.
> **Cómo verificar:** si el campo "Objetivo de rendimiento" aparece en gris, el reparto está
> activo.

No se usa el objetivo **Clientes potenciales** porque optimiza para formularios web (ya falló),
ni **Tráfico** porque repite el error original: 104 visitas, 0 leads.

### 3.2 Conjunto de anuncios

| Campo | Valor real |
|---|---|
| Nombre | `PR \| Inspección \| 30-65 \| Manual` |
| ID | `120248969238750786` |
| Ubicación de conversión | **Destinos de los mensajes → solo WhatsApp** |
| Número | +1 939-375-5858 |
| Página | Lumina PR Solar Solution |
| Messenger / Instagram como destino | **DESMARCADOS** |
| Compartir datos de anuncios | Apagado |
| Objetivo de rendimiento | **Maximizar el número de conversaciones** |
| Presupuesto | **$22.00 diario** |
| Programación de presupuesto | No |
| Fecha de fin | Run as ongoing |
| Género | Todos |
| Tipo de entrega | Standard |

**Por qué $22 y no $50:** una conversación cuesta $3–8 en este mercado, así que $22/día da 3–7
conversaciones diarias — suficiente para acercarse a las ~50 semanales que Meta necesita. Con
$50/día se quema el presupuesto mientras Meta todavía aprende; con $22 hay casi tres semanas de
datos por el mismo dinero que antes duró cinco días.

**Zona horaria: la cuenta está en Pacific Time y Puerto Rico está 3 horas adelante.**
Para arrancar a las 8:00 AM de PR hay que poner **5:00 AM Pacific**. Todos los reportes salen en
hora Pacific: el "martes" del reporte termina a las 3 AM del miércoles hora de PR.

**Nunca arrancar una campaña por la tarde.** Meta intenta gastar el presupuesto diario completo
dentro del día calendario; si arranca a las 7 PM tiene que colocar $22 en 5 horas, puja
agresivo, infla el CPM y contamina justo el primer día de aprendizaje.

**Geografía real publicada** (ciudad + radio, no municipio):

- `Caguas, Caguas, PR` + 10 millas
- `Humacao, Humacao, PR` + 15 millas
- `San Juan, San Juan, PR` + 15 millas

> El radio **solo existe si la ubicación se agrega como *City***, no como *Region* o
> *Municipality*. Si no aparece la flechita del radio, hay que borrar la ubicación y volver a
> agregarla eligiendo la opción etiquetada **City**.

> Si existe el desplegable **"Tipos de ubicación"** (botón ⌄ al final de la fila de búsqueda),
> elegir **"Personas que viven en esta ubicación"**. Puerto Rico recibe millones de turistas y
> boricuas de Florida de visita. En destino WhatsApp Meta a veces no ofrece este control; no es
> crítico.

**Edad:** mínima **30**. El panel nuevo de "Controles" **no tiene campo de edad máxima** para
destino WhatsApp — no perder tiempo buscándolo. Bajo los 30 casi nadie en PR es dueño de la casa
donde vive, y sin ser dueño de la estructura no se puede firmar.

Dejar **DESMARCADA** la casilla *"Incluir en WhatsApp a personas cuya edad se desconoce"*.
Al subir la edad mínima por encima de 18, Meta la desmarca sola y el aviso *"Edad desconocida en
WhatsApp: Incluida"* cambia a *Excluido*.

**Segmentación detallada** — la estructura de dos bloques es lo que importa:

```
Include people who match          →  funciona como O (amplía)
   Interests: Solar energy
   Interests: Solar panel

and must also match               →  funciona como Y (reduce)
   Interests: Renovation (construction)
   Interests: Home improvement (home & garden)
```

El segundo bloque se crea con el botón **"Define further"** / *"and must also match"*.
**Cómo verificar que se está usando la caja correcta:** si el estimado **sube** al agregar algo,
está en la caja equivocada. Debe bajar.

`Renovation` + `Home improvement` es el mejor proxy disponible de "dueño de casa": Meta eliminó
la segmentación directa por propiedad de vivienda hace años.

**Resultado medido:** de **1,800,000–2,100,000** bajó a **598,800–704,400** (−66%).

No apretar más. Con $22/día se generan ~2,000–2,500 impresiones diarias; sobre 600k Meta tiene
espacio para concentrarse en quien responde. Bajar a 150k sube la frecuencia, cansa a la
audiencia y encarece la conversación.

**Ubicaciones: manuales. Exactamente 6.**

| Facebook | Instagram |
|---|---|
| Feed | Feed |
| Stories | Stories |
| Reels | Reels |

Desmarcado todo lo demás:

- **Audience Network** — plataforma completa fuera
- **Messenger**, **Threads**
- **WhatsApp Status** — vive escondido dentro del grupo *"Stories, Status, Reels"*. Cuando queda
  bien, ese grupo muestra un **guion (—)**, no un check lleno
- **In-stream ads for reels** — corta el Reel de otra persona; clic accidental al saltarlo
- **Search results** — nadie busca placas solares en el buscador de Facebook
- **Facebook Notifications** — el peor: tu anuncio en la campanita, junto a "Juan comentó tu
  foto". Máximo de clics accidentales
- **Facebook Marketplace** — contexto mental de ganga y regateo, choca con una compra de $20,000
- **Facebook / Instagram profile feed**, **right column**, **Business Explore**,
  **Instagram Explore home**

Dejar **DESMARCADA** la casilla *"Allow limited spending to excluded placements"*. Cuando queda
bien, el botón *"Manage excluded placements"* sale en gris — no hay gasto limitado que
administrar.

**Brand safety and suitability:** dejar en *Moderate* (por defecto). Solo afecta in-stream y
Audience Network, que ya no se usan; apretarlo a *Limited* encarece el CPM sin proteger nada.

**Advertiser y Payer (selected locations):** campos **obligatorios**. Si en la pantalla de
Review dicen *"Please add"*, **Meta no deja publicar**. Poner el nombre legal de la empresa que
paga, tal como aparece en el método de pago de la cuenta.

**Targeting expansion:** quedó en **Yes**. En objetivos de mensajería Meta no siempre permite
apagarlo. No pelear con eso: se compensa con el copy y con las 3 preguntas de WhatsApp.

**Guardar la audiencia** como `PR | Duenos solar | 30+`. Al duplicar un conjunto, la
segmentación detallada se pierde y hay que rehacerla a mano.

### 3.3 Anuncios

| Campo | Valor |
|---|---|
| Ad setup | Create ad |
| Format | Single image or video |
| Identity | Página *Lumina PR Solar Solution* + IG `@luminapr_` |
| Call to action | **Send WhatsApp message** |
| **Multi-advertiser ads** | **DESMARCADO** |
| **Advantage+ creative / Enhancements** | **APAGADO** |
| **Advantage+ creative image generation (Meta AI)** | **APAGADO / media generada eliminada** |
| **Optimize text per person** | **APAGADO** |
| **Embedded overlay** | Apagado si la interfaz lo permite |
| Description | **vacío** |

**Multi-advertiser ads** merece explicación: tu anuncio se muestra en una cuadrícula junto a
anuncios de otros anunciantes. Con ~100 anuncios activos de WindMar en el mismo mercado, hay
probabilidad real de que tu anuncio aparezca al lado del de WindMar, con su Tesla Powerwall y su
"desde $125/mes" en la misma pantalla. Es pagar por poner a tu competidor frente a tu prospecto.
Además advierte que el creativo *"may be resized or cropped"*, lo que deshace el trabajo de
apagar Advantage+ creative.

**Tamaños de imagen:**

| Ubicación | Tamaño |
|---|---|
| Feed (FB + IG) | 1080 × 1350 (4:5) |
| Stories y Reels | 1080 × 1920 (9:16) |

Con Advantage+ creative apagado, Meta ya **no** recorta automáticamente. Si solo se sube la 4:5,
Stories la muestra con barras negras. Subir las dos versiones usando **"Edit per placement"**.

**Una sola variante de texto por anuncio.** No usar las 5 opciones de *Primary text* ni de
*Headline*: con 4 ángulos y $22/día, 20 combinaciones no juntan datos suficientes para concluir
nada. Ignorar el aviso *"Not optimized"*.

---

## 4. Los 4 anuncios

### Decisión de fondo: no se menciona precio

WindMar anuncia **10 paneles + batería Tesla Powerwall 3 desde $125/mes**, con $0 pronto,
garantía de 25 años, bonos de $1,000 al instalar y $500 por referido, y sus vendedores dicen
literalmente *"te mejoro la oferta de la competencia"*.

Anunciar "desde $150/mes" nos pone a perder una comparación que el prospecto va a hacer, porque
los vendedores de WindMar están en el mismo feed. Además la cuota real está en duda: la tabla
del repo asume 7.95% pero la propuesta comercial dice *"desde 4.95% mediante cooperativa local"*,
lo que bajaría la entrada a ~$118/mes — **por debajo de WindMar**. Anunciar $150 es anunciar un
precio probablemente peor que el real: el peor de los dos mundos.

**Hasta confirmar la tasa, ningún anuncio ni flyer lleva cifra de cuota.** Se compite por la
oferta de la inspección gratis y por el dolor del apagón. Es también lo que hace la landing del
líder, que no menciona precio ni una vez.

> **Flyers heredados:** el flyer *"¿Cuánto más vas a DEPENDER de LUMA?"* traía la viñeta
> **"Desde $150/mes"**. Sustituirla por **"Garantías hasta 25 años"** — dato verificable de la
> propuesta de OpenSolar, ya publicado en la landing, y que ataca donde WindMar es débil: sus
> anuncios dicen 25 años con letra chiquita de *"aplican restricciones"*.

---

### Anuncio 1 — Apagones *(el más fuerte)*

**Nombre:** `01 | Apagones`

**Titular:** `Cuando LUMA se va, tu casa sigue encendida`
*Alternativa más corta, 35 caracteres, no se trunca en Reels/Stories:*
`Tu casa encendida aunque LUMA falle`

```
🔌 ¿Cuántas veces este año te quedaste sin luz?

No es la nevera dañada. Es el nene sin abanico a las 2 de la
mañana, la insulina en la nevera, el trabajo desde casa parado.

Y estamos en plena temporada de huracanes.

Un especialista de Lumina va a tu casa, revisa tu consumo real
y tu techo, y te dice exactamente qué necesitas para no volver
a quedarte a oscuras.

✅ Inspección gratis, en tu casa
✅ Menos de una hora
✅ Sin compromiso de compra

Si eres dueño(a) de tu casa en PR, escríbeme y coordinamos.
```

**Creativo recomendado:** flyer *"¿Cuánto más vas a DEPENDER de LUMA?"* (sin el $150/mes) o foto
real de instalación. El flyer pregunta y el titular responde.

---

### Anuncio 2 — Qué te instalan de verdad

**Nombre:** `02 | Equipos`

**Titular:** `Te decimos marca por marca qué lleva tu sistema`

```
En solar casi todos dicen "equipos de alta calidad".
Nosotros te decimos exactamente cuáles.

☀️ Paneles Canadian Solar de 640W
⚙️ Inversor Sol-Ark con respaldo automático
🔋 Batería Pytes de litio-ferrofosfato (LFP)
🔧 Estructura UNIRAC con anclajes Hilti
🛡️ Garantías de fabricante de hasta 25 años

Y nos encargamos de todo el papeleo con LUMA: certificación,
medición neta, interconexión y permisos.

Agenda tu inspección gratis y te lo entregamos por escrito,
sin letra chiquita.
```

---

### Anuncio 3 — La inspección como servicio

**Nombre:** `03 | Inspeccion`

**Titular:** `Inspección energética gratis en tu casa`

```
La mayoría de la gente no sabe cuánto consume su casa
realmente. Y sin eso no puede decidir nada sobre solar.

Por eso la inspección es gratis:

📋 Revisamos tus facturas y tu consumo real
🏠 Evaluamos tu techo y tus condiciones eléctricas
🔋 Te decimos qué respaldo necesitas para los apagones
💬 Te explicamos las opciones, sin presión

Si te sirve, seguimos. Si no, te quedas con el diagnóstico
de tu hogar sin haber pagado nada.

Escríbeme y coordinamos el día.
```

---

### Anuncio 4 — Calificador directo

**Nombre:** `04 | Calificador`

**Titular:** `Si tu factura de luz pasa de $300, esto te conviene`

```
Seamos honestos: el solar no le conviene a todo el mundo.

Si pagas $120 de luz, probablemente no vale la pena.
Si pagas más de $300, la cuenta cambia por completo.

Un especialista va a tu casa, mide tu consumo real y te dice
sin vueltas si te conviene o no.

✅ Gratis y sin compromiso
✅ En menos de una hora
✅ Con números de tu caso, no promedios

Mándame tu factura aproximada y coordinamos.
```

> El 04 parece contraproducente — rechaza clientes en un anuncio pagado. Hace dos cosas: filtra
> al que nunca iba a comprar, y le da credibilidad al que paga $400, porque demuestra que no le
> vendes a cualquiera. Es el ángulo más interesante de medir.

---

## 5. Plantillas de conversación y atribución

Los clics a WhatsApp **no llevan UTMs**. La primera línea del chat es la única atribución que
existe. **Una plantilla por anuncio**, con nombre reconocible — no dejar el que Meta genera
solo (`Start conversations 07/27/26`), porque con cuatro plantillas con la misma fecha es
imposible distinguirlas en el desplegable.

En la sección **Conversations** del anuncio, usar **"Create template"** y elegir la opción simple
de conversación. **Nunca** la plantilla recomendada con IA: trae un **formulario dentro de
WhatsApp** pidiendo nombre y email (*"Welcome! Please fill out the form below to sign up!"*).
Eso repite el error de la landing —pedir datos antes de conversar— y además **impide que se
envíe el mensaje prellenado**, con lo que se pierde toda la atribución.

Si el editor ofrece **preguntas frecuentes** o **botones de respuesta rápida**, dejarlos vacíos.
Cada botón es una excusa para tocar en vez de escribir.

### Mensaje de bienvenida (idéntico en las 4 plantillas)

```
¡Hola! Gracias por escribir a Lumina PR ☀️

Para coordinar tu inspección gratis necesito 3 datos:

1) ¿Cuánto pagas de luz al mes (aproximado)?
2) ¿La casa es propia?
3) ¿En qué pueblo está?

Con eso coordinamos el día y la hora que te convenga.
```

> Números en texto simple `1)` `2)` `3)`, **no emojis**. Los emojis 1️⃣2️⃣3️⃣ se renderizan como
> cuadritos vacíos en la vista previa de Meta y en Android viejo. El primer mensaje al prospecto
> no puede verse roto. El ☀️ sí renderiza bien.

### Mensajes prellenados — versión corta con emoji

**Corregido el 30/07/2026.** La primera versión eran frases de ~92 caracteres del tipo
*"Hola, soy dueño(a) de casa en PR y quiero la inspección gratis para el respaldo en apagones."*
Eran largas para tener atribución legible, y fue el intercambio equivocado: la persona toca el
anuncio con curiosidad, se abre WhatsApp y se encuentra un párrafo ya escrito **declarando** que
es dueña de casa y que quiere una inspección. Se siente como firmar algo y muchos cierran la app.

La atribución se traslada a un **emoji**, que ocupa un carácter y se distingue igual:

| Plantilla | Pre-filled message |
|---|---|
| `Apagones` | `Hola, quiero la inspección gratis ⚡` |
| `Equipos` | `Hola, quiero la inspección gratis 🔋` |
| `Inspeccion` | `Hola, quiero la inspección gratis 🏠` |
| `Calificador` | `Hola, quiero la inspección gratis 💡` |
| `Sin call center` | `Hola, quiero la inspección gratis 🔧` |
| `Conversacion` | `Hola, quiero la inspección gratis 💬` |

35 caracteres en vez de 92, con la misma capacidad de atribución.

### Tabla para Natana

| Emoji en el primer mensaje | Vino del anuncio |
|---|---|
| ⚡ | 01 Apagones |
| 🔧 | 02 Sin call center |
| 💬 | 03 Conversación |
| 🔋 | Equipos |
| 🏠 | Inspección |
| 💡 | Calificador |

Llevar la cuenta a mano una semana basta para saber qué ángulo trae gente que agenda.

---

## 5.1 ⚠️ Meta cuenta más conversaciones de las que llegan

**Descubierto el 30/07/2026.** Meta reportaba **6 conversaciones iniciadas** y a Natana solo le
habían entrado **2 mensajes**.

**No es un fallo de configuración.** Meta cuenta cuando se **abre** el chat, no cuando se envía el
mensaje: la persona toca el anuncio, WhatsApp abre con el texto prellenado, y no le da a enviar.

La brecha es conocida en el canal. Un análisis de campañas click-to-WhatsApp encontró que
alrededor del **8.5%** de los clics en el botón terminan en conversación real
([Pete Bowen](https://pete-bowen.com/how-many-whatsapp-clicks-turn-into-leads)), y las
plataformas de gestión de WhatsApp documentan la diferencia como esperada
([DoubleTick](https://learn.doubletick.io/why-do-i-see-a-difference-between-meta-ad-clicks-and-chats-initiated-on-doubletick)).
Nuestra proporción de 2 sobre 6 (**33%**) está bastante por encima de esa referencia.

**Consecuencia para la medición: el número de Meta no sirve como métrica de negocio.**

| | Meta dice | Realidad |
|---|---|---|
| Conversaciones | 6 | **2** |
| Costo por conversación | $11.08 | **$33.25** |

**Usar siempre el conteo de Natana como denominador real.** Y antes de culpar a la
configuración, revisar: carpeta de archivados en WhatsApp Business, y si el número está vinculado
a alguna otra plataforma o a WhatsApp Web en otro equipo.

Palancas para cerrar la brecha, por orden de impacto:

1. **Mensaje prellenado corto** (arriba). Es la más grande y es gratis
2. **Creativo que muestre la conversación** antes del clic: la gente no envía porque no sabe qué
   le va a caer encima (ver `creativos/anuncios-nativos.html`, concepto B)

---

## 6. WhatsApp Business

Configurar también el mensaje de bienvenida en la app, además del de la plantilla del anuncio:

**Ajustes → Herramientas para la empresa → Mensaje de bienvenida → activar**

Usar el mismo texto de la sección 5.

> **Redundancia deliberada:** el mensaje de la app **solo se dispara con gente que nunca ha
> escrito antes**. Si Natana ya chateó con esa persona por cualquier motivo, no aparece. El de la
> plantilla del anuncio sí se muestra siempre que la persona llegue desde el anuncio. Por eso las
> 3 preguntas deben estar también en la respuesta manual de Natana.

### Respuestas para objeciones frecuentes

| Objeción | Respuesta |
|---|---|
| "¿Cuánto cuesta?" | Depende del consumo. En la inspección medimos tu caso real y te damos la cuota exacta. Hay financiamiento sin pago inicial |
| "Soy inquilino" | No aplica: hace falta ser dueño de la estructura |
| "¿Me van a presionar?" | La inspección es gratis y sin compromiso. Si no te sirve, te quedas con el diagnóstico |
| "¿Y los incentivos del gobierno?" | ⚠️ **No prometer nada.** El programa de PR está cerrado y el crédito federal expiró el 31/12/2025. Decir que se revisa si hay algo vigente al momento de instalar |
| "WindMar me ofrece Tesla" | Nuestros equipos son Canadian Solar, inversor Sol-Ark y batería Pytes LFP, con garantías de hasta 25 años. Te entregamos el alcance completo por escrito |

---

## 7. Imágenes y video

Por orden de efectividad:

1. **Foto real de una instalación de Lumina** en un techo de PR
2. **Video vertical (9:16) de 15–30 s** grabado con celular: Natana hablando a cámara frente a
   una instalación. WindMar usa video en la mayoría de sus anuncios activos
3. Los flyers, revisados según la sección 4

Criterios para elegir foto:

- **Que se vea que es Puerto Rico** — techo de cemento, vegetación local, el barrio. El prospecto
  tiene que reconocer su propia casa
- **Que se vea gente trabajando.** Una instalación vacía vende producto; alguien instalándola
  vende empresa que existe
- **Sin editar de más.** Sin filtros, marcos ni texto encima

Reparto sugerido:

| Anuncio | Creativo |
|---|---|
| 01 Apagones | Casa con paneles, de tarde. O el flyer de "DEPENDER de LUMA" corregido |
| 02 Equipos | Primer plano del inversor Sol-Ark o la batería instalada |
| 03 Inspección | Alguien del equipo trabajando en el techo |
| 04 Calificador | La instalación terminada más presentable |

**No usar imágenes generadas con IA.** En una compra de $20,000+ de una marca desconocida, una
imagen que se ve artificial destruye la credibilidad que intentamos construir. Esto incluye la
función *Advantage+ creative image generation* de Meta, que hay que apagar y cuya media generada
hay que eliminar con el 🗑️.

---

## 8. Qué medir y cuándo decidir

Revisar a los **7 días**, sin tocar nada antes:

| Métrica | Objetivo |
|---|---|
| Costo por conversación iniciada | $3–8 |
| Conversaciones que responden las 3 preguntas | >40% |
| Calificadas (dueño + factura >$250) | >25% |
| Costo por prospecto calificado | <$30 |

**Reglas de decisión:**

- Si el costo por conversación es bueno pero nadie califica → el problema es la segmentación o
  el ángulo del anuncio
- Si nadie escribe → el problema es el creativo, no el canal
- Si escriben y califican → subir presupuesto gradualmente, no de golpe

**No concluir nada con poco gasto.** A $3–8 por conversación, con $3 gastados lo esperado es
entre 0 y 1 mensaje. Cero mensajes con $3 no es una señal, es ruido. Antes de juzgar hay que
dejar correr al menos 3 días completos con anuncios bien configurados.

### Resultados reales de los primeros días

| Fecha | Conv. (Meta) | Costo/conv. (Meta) | Gastado | Impresiones |
|---|---|---|---|---|
| 28/07 | 2 | $22.96 | $45.91 | 2,877 |
| 30/07 | 6 | $11.08 | $66.50 | 4,280 |

El costo por conversación bajó **52% en dos días**: es la señal de que Meta empezó a salir de la
fase de aprendizaje. Pero el número real es peor, porque de esas 6 solo 2 llegaron a Natana
(sección 5.1): **$33.25 por conversación real**.

**La comparación que justifica todo el cambio de estrategia:**

| | Campaña vieja (Leads) | Campaña nueva (WhatsApp) |
|---|---|---|
| Gastado | $184.97 | $66.50 |
| Impresiones | 50,493 | 4,280 |
| CPM | **$3.66** | **$15.54** |
| Resultados reales | **0** | **2 conversaciones** |

La campaña vieja compraba impresiones **4 veces más baratas** y no producía nada: 50,493 personas
vieron el anuncio y ninguna escribió. Ese CPM bajo venía de Audience Network y Estados de
WhatsApp. **Costo por resultado de la campaña vieja: infinito.** No importa qué tan barato sea el
CPM si el resultado es cero.

### Cómo escalar, y cuándo no

**No subir presupuesto y no duplicar el conjunto** mientras el costo real por conversación siga
arriba de $15.

Duplicar el conjunto para probar creativos es un error con este volumen: Meta necesita ~50
conversaciones semanales **por conjunto**, y con ~14 semanales repartirlas en dos deja a los dos
atascados en aprendizaje de forma permanente. **Los creativos nuevos van dentro del conjunto que
ya existe**, donde Meta los rota y concentra el presupuesto en el que funciona. Duplicar el
conjunto solo tiene sentido para probar **otra audiencia**.

Cuando el costo real esté entre $8 y $15 y más del 25% califique: subir **20–30% cada 3–4 días**,
nunca el doble de golpe, porque un salto grande reinicia el aprendizaje.

---

## 9. Trampas de Meta que ya nos costaron dinero

Documentadas para no repetirlas. Las marcadas con ⭐ se descubrieron en el montaje del 27–28 de
julio de 2026.

1. **El evento de conversión no se puede cambiar** en un conjunto ya publicado. Hay que duplicar
2. **El objetivo de rendimiento se bloquea** si el reparto de presupuesto del 20% está activo.
   Se detecta porque el campo sale en gris
3. **Al duplicar se pierde la segmentación detallada.** Hay que rehacerla
4. **Al duplicar, Meta premarca "recomendaciones"** (Advantage+ creative, formularios
   instantáneos) que hay que desmarcar **cada vez**
5. **Meta insiste en reactivar todas las ubicaciones** con el botón "Apply now" y la tarjeta
   *"You can lower costs by 9% by selecting more destinations"*. Ese botón **reactiva
   Advantage+ Placements y deshace toda la configuración manual de un clic**. Ignorar siempre
6. **La casilla "gasto limitado en ubicaciones excluidas"** gasta ~5% en lo que excluiste
7. **Advantage+ audience no se puede desactivar** en algunos objetivos: trata los intereses como
   sugerencia. Solo respeta al 100% ubicación, edad y exclusiones. **Por eso el creativo y las 3
   preguntas de WhatsApp son la segmentación real.** Aun así los intereses sirven como semilla de
   arranque: sin ellos Meta empieza desde 1.8M al azar y gasta el presupuesto aprendiendo
8. **La pestaña "Overview" del Administrador de eventos tiene retraso** de horas. Para verificar
   en tiempo real usar "Test events"
9. **Meta filtra eventos de navegadores automatizados.** Las pruebas hay que hacerlas desde un
   teléfono real
10. ⭐ **El traductor de Chrome corrompe campos guardados.** Tradujo el nombre del conjunto
    `PR | Inspección` a `relaciones públicas | Inspección` y **Meta guardó la traducción**. Si
    pasa con un nombre, puede pasar con el texto de un anuncio publicado.
    **Desactivar: clic derecho → Traducir al... → engranaje → "Nunca traducir facebook.com"**
11. ⭐ **"Multi-advertiser ads" viene marcado.** Muestra tu anuncio en cuadrícula junto a otros
    anunciantes —incluido WindMar— y advierte que el creativo puede ser recortado
12. ⭐ **"Advantage+ creative image generation" genera imágenes con Meta AI** y las rota sin
    avisar. Apagarla **y borrar la media generada** con el 🗑️
13. ⭐ **"Optimize text per person" reescribe tu texto** por persona. Imposible medir qué ángulo
    funcionó. Apagar
14. ⭐ **La plantilla de conversación "recomendada" con IA es un formulario**, no una
    conversación. Pide nombre y email dentro de WhatsApp y bloquea el mensaje prellenado
15. ⭐ **Los campos "Advertiser" y "Payer" son obligatorios.** Con *"Please add"* en Review, Meta
    no deja publicar
16. ⭐ **WhatsApp Status está escondido** dentro del grupo *"Stories, Status, Reels"*. Marcar el
    grupo completo lo incluye de paquete
17. ⭐ **El radio de ubicación solo existe para *City***, no para *Region* / *Municipality*
18. ⭐ **La cuenta reporta en Pacific Time**, PR está 3 horas adelante. 8 AM de PR = 5 AM Pacific
19. ⭐ **La "Puntuación de la campaña" mide obediencia a Meta, no resultados.** Bajó de 100 a 80
    aplicando decisiones correctas. Que baje es buena señal

### ⭐ Errores de captura de texto que ya nos pasaron

Costaron horas y $3 de gasto con anuncios vacíos.

**El copy terminó en el campo `Description`.** Description **casi nunca se muestra** en Feed,
Stories ni Reels. El anuncio corrió con Primary text y Headline vacíos: la gente vio una imagen
sin oferta y sin llamada a la acción.

| Campo | Qué va | Se muestra |
|---|---|---|
| **Primary text** | El texto largo del anuncio | ✅ Sí, arriba de la imagen |
| **Headline** | Una línea corta, obligatoria en mensajería | ✅ Sí, debajo de la imagen |
| **Description** | Nada | ❌ Casi nunca |

**El texto "se borraba solo" al pegarlo.** Causa: espacios de variante vacíos.
Con *"Primary text (1 of 5)"* o *"Headline 1 of 5"* y algún espacio vacío, Meta muestra
*"Enter unique text or remove this option to publish"* (error **#2016052**), **bloquea la
validación del bloque completo y revierte lo que escribes**.

**Orden que sí funciona:**

1. Eliminar **todas** las opciones extra de Headline y Primary text (X o 🗑️ al pasar el cursor).
   Dejar **una sola** de cada uno
2. Vaciar **Description** por completo
3. Esperar a que abajo diga **"All edits saved"**
4. Escribir el **Headline** a mano
5. Esperar a que guarde otra vez
6. Pegar el **Primary text** con `Cmd + Shift + V` (pegar sin formato). Si sigue fallando, pasar
   el texto por la app **Notas** con *Formato → Convertir a texto simple*
7. Verificar en la vista previa que el texto aparezca sobre la imagen con *"...See more"*
8. **Publish** — el badge **"Unpublished edits"** significa que los cambios están en borrador y
   **no están al aire**

**No aceptar el mismo texto en dos campos.** Meta lo rechaza como duplicado: hay que vaciar
Description **antes** de pegar en Primary text.

---

## 10. Pendientes que siguen abiertos

1. **¿Tasa 4.95% o 7.95%?** A 4.95% la entrada queda en ~$118/mes. **Ojo: WindMar ya anuncia
   desde $100/mes**, así que ni a 4.95% ganamos la comparación de precio
2. **¿15kW cuesta $45,000 o $52,897?** El repo y la cotización real difieren un 13%
3. **¿Cuál es el crédito mínimo que aprueba Lumina?** WindMar exige **700+ de empírica** y techo
   de cemento. Si Lumina aprueba menos, ahí hay un mercado que el líder rechaza activamente, y
   un titular que se escribe solo: *"¿Te dijeron que no cualificabas para solar?"*
4. **Prueba social:** testimonios reales con nombre y pueblo, fotos de instalaciones, licencia
5. **Zona de servicio real:** ¿solo metro y este, o también Ponce, Mayagüez, Arecibo? Las
   ubicaciones actuales asumen metro y este
6. **Auditar los flyers restantes** (*"¿CÓMO BAJAR TU FACTURA DE LUZ?"*, *"La mejor INVERSIÓN"*,
   *"Tu factura sube"*): confirmar que ninguno mencione los $15,000 de PR, el 30% federal ni
   cuota mensual
7. **Cargar los anuncios 02 y 03** con los creativos nativos, y cambiar el prellenado del 01 a la
   versión corta con emoji
8. **¿Natana autoriza el uso de su foto?** Sin eso, el concepto A va firmado como *Lumina PR* en
   plural, no en primera persona

---

## 11. Inteligencia competitiva — Biblioteca de Anuncios, 30/07/2026

Consultada en la [Biblioteca de Anuncios de Meta](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=PR&q=windmar&search_type=keyword_unordered),
que es pública y no requiere cuenta.

### Los anuncios que más duran no son de la marca

Los que llevan meses activos son de **vendedores individuales**: *"Jonathan Torres By Windmar
Home"*, *"Marleen Ramos by Windmar Home"*, *"Alejandro Tu Solución Solar"*. Todos con la misma
estructura y saliendo a `API.WHATSAPP.COM`:

```
🚨 [pregunta con dolor local concreto] 🚨

[por qué duele, en términos de familia y día a día]

✅ [qué incluye]
✅ [qué incluye]
✅ Financiamiento disponible

📲 Escríbame hoy para una orientación sin compromiso.

Jonathan Torres
Líder de Ventas
787-444-2395
```

**Nombre. Cargo. Teléfono. "Escríbame".** Los creativos pulidos y con diseño de marca son los
corporativos; los que generan conversaciones son los de personas.

Esto coincide con la investigación de creativos: el contenido estilo creador o cliente rinde
mejor que el producido en estudio porque **se integra al feed en vez de interrumpirlo**
([Chatterbuzz](https://www.chatterbuzzmedia.com/blog/ugc-ads-that-convert/)), y con Advantage+
manejando la segmentación, **el creativo es lo que decide si convierte**
([Flighted](https://www.flighted.co/blog/7-meta-ads-creative-strategies-that-work)).

### Datos duros del líder

- **Ya anuncian desde $100/mes**, no $125: *"Paga por placas, no por cuentos. ☀️ Con Windmar Home
  paga por tus placas empezando desde $100/mes"*
- **Prueba social como arma principal:** 40,000 hogares, 21 años, 275 brigadas, 1,100 técnicos,
  instalador Tesla #1 del mundo con 20,000 Powerwall, 70,000 placas de producción propia
- **Comparación agresiva:** *"¿Ya tienes una cotización solar? Tráela al ring — la comparamos con
  la nuestra... o ganas más ahorro, o confirmas que ya tenías la mejor oferta 🥊"*
- **Usan video largo:** hasta 1:19 en anuncios que van a WhatsApp

### El líder está pivotando al agua

**La mayoría de sus anuncios activos son de cisternas (*Windmar Water*), no de solar.** Tanques
EcoWater de 150 galones e instalaciones presurizadas **desde $58/mes**, con el ángulo de las
interrupciones del servicio de agua.

Puede significar que el mercado solar de PR se está saturando, o que el dolor del agua convierte
mejor ahora mismo. Vale la pena tenerlo en el radar: es el mismo modelo de "puerta de entrada
barata" que ya les funcionó con solar.

### Qué implica para Lumina

En volumen, historia y prueba social **no se les gana en nada**. La única ventaja reclamable hoy
sin inventar datos: ellos tienen call center y 275 brigadas; nosotros una persona que contesta.
De ahí sale el concepto *"Aquí no hay call center"*.

---

## 12. Producción de creativos sin diseñador

Los creativos se producen con dos archivos HTML del repo, sin Photoshop y sin saber diseño:

| Archivo | Contenido |
|---|---|
| `creativos/anuncios-nativos.html` | **A** · La persona (foto + «Aquí no hay call center») · **B** · La conversación (maqueta del chat de WhatsApp) |
| `creativos/anuncios-meta.html` | Creativos de marca: Equipos, Inspección, Calificador |

**Cómo se usan:**

1. Abrir con `https://htmlpreview.github.io/?<url del archivo en GitHub>`
2. **Los textos se editan haciendo clic encima y escribiendo.** Los logos SVG están protegidos
3. La foto se carga con el botón amarillo; se queda en el navegador, no sube a ningún servidor
4. **Activar el botón verde «modo exportar (1080 px)»**
5. Clic derecho → Inspeccionar → seleccionar la línea del `<div class="art ...">` → clic derecho →
   **Capture node screenshot**

> **Trampa 1:** en pantalla las piezas están reducidas al 30% con `transform: scale(0.3)`. Chrome
> captura el nodo **como se ve**, incluyendo la transformación del padre, así que sin el modo
> exportar el PNG sale a **324×405** y borroso. Verificar siempre que el archivo diga 1080×1350 o
> 1080×1920.
>
> Al verificar esto en código, medir con `getBoundingClientRect`, **no** con
> `offsetWidth`/`offsetHeight`: los segundos reportan 1080 aunque la pieza se renderice al 30%.
>
> **Trampa 2:** cualquier elemento con `position: fixed` que quede sobre la pieza **sale dentro de
> la captura**. Por eso la barra de aviso del modo exportar va en flujo normal.

**Reglas de contenido en todo creativo:** sin cuota mensual, sin el incentivo de $15,000 de PR,
sin el crédito federal del 30%. La única cifra permitida es el **$300** del calificador, que es el
umbral de factura del cliente y no un precio nuestro.

**Nada de personas generadas con IA.** Presentar una persona inventada como quien contesta el
WhatsApp es fabricar una identidad en un anuncio pagado, y mata precisamente el argumento del
concepto A. Gemini sirve para **revelar** una foto real (exposición, balance de blancos,
degradado), nunca para inventar la escena ni para dibujar el texto: falla con las tildes.

**El nombre del creativo tiene que ser de quien realmente contesta.** Si dice Natana, contesta
Natana. Si no hay autorización de imagen, se firma *Lumina PR* y el texto va en plural.
