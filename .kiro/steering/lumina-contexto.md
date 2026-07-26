# Contexto del proyecto Lumina PR Solar

Documento de traspaso. Recoge la arquitectura, el estado de la campaña de Meta, los
problemas encontrados y las reglas que no se deben romper. Escrito para que cualquiera
(persona o agente) pueda retomar sin contexto previo.

**Última actualización:** 25 de julio de 2026

---

## 1. Reglas que NO se deben romper

### 1.1 Prohibido prometer incentivos de gobierno sin verificar vigencia

La landing prometía dos incentivos que **hoy no existen**. Verificado en fuentes oficiales:

| Incentivo | Estado real | Fuente |
|---|---|---|
| Programa Incentivo Solar de PR (30% hasta $15,000) | **CERRADO a nuevas solicitudes** desde su única ronda del 10/08/2023 (6,000 boletos). Además exigía ingresos entre 0% y 200% del AMFI | [incentivosolar.pr.gov](https://incentivosolar.pr.gov/) |
| Crédito federal residencial 30% (Sección 25D) | **EXPIRÓ el 31/12/2025.** No aplica a sistemas puestos en servicio después de esa fecha. Compra en 2026 con efectivo o préstamo = $0 | [IRS](https://www.irs.gov/credits-deductions/residential-clean-energy-credit) |

Prometer esas cifras es publicidad engañosa: expone la marca ante Meta y destruye la
confianza en el momento de la venta (el prospecto llama, descubre que está cerrado, se
siente engañado).

**Regla:** antes de mencionar cualquier programa de incentivo, confirmar su vigencia en la
fuente oficial. Si no se puede confirmar, no se menciona.

Nota: el 30% sobrevive en la Sección 48E (comercial), que aplica a *leases* y PPAs donde la
financiera es dueña del sistema y puede trasladar parte del valor a la cuota. Eso depende
de la estructura de financiamiento concreta de Lumina — hay que confirmarlo con el equipo
antes de comunicarlo.

### 1.2 El evento `Lead` solo se cuenta con envío real

`gracias.html` dispara `Lead` **únicamente** si llega el parámetro `?eid=` que genera el
formulario al enviarse. No reintroducir un respaldo sin `eid` ni un pixel `<noscript>` con
`ev=Lead`: cualquier visita directa a la página (pruebas, rastreadores, enlace compartido)
contaría como conversión y contaminaría la señal con la que Meta optimiza.

El envío es 100% JavaScript, así que toda conversión legítima trae su `eid`.

### 1.3 Nunca reactivar Audience Network

Meta lo recomienda constantemente ("Including all available placements could improve
performance", "Apply now"). **Ignorar siempre.** Con Audience Network activo el CPC bajaba a
$0.20 pero eran clics accidentales: 39% de los clics no llegaban a cargar la página y la
conversión era cero. Sin él, el CPC sube a ~$0.78 y es tráfico real.

También dejar desmarcada la casilla *"Allow limited spending to excluded placements"*, que
gasta ~5% en las ubicaciones excluidas por la puerta de atrás.

### 1.4 Un solo conjunto de anuncios encendido

Dos conjuntos activos = gasto doble y competencia entre sí en la misma subasta.

---

## 2. Arquitectura

### 2.1 Hosting

Todo se sirve desde **GitHub Pages**, sin Netlify. El workflow `.github/workflows/deploy.yml`
ensambla el sitio en cada push a `main`:

- Landing en la **raíz** → `luminapr.net`
- App/dashboard en **`/studio`** → `luminapr.net/studio`
- `CNAME` con el dominio incluido en el artefacto

DNS en GoDaddy, 4 registros A apuntando a GitHub Pages
(`185.199.108–111.153`). Antes apuntaba a Netlify (`75.2.60.5`).

**Por qué se migró:** los deploys de Netlify quedaron pausados por créditos agotados, lo que
dejó el sitio congelado en una versión antigua durante días. GitHub Actions es gratis en repos
públicos y despliega en cada merge.

### 2.2 El formulario no depende de servidor

`landing/index.html` envía los leads **directo a HubSpot desde el navegador** (`fetch` a la
API de formularios) y luego redirige a `gracias.html?eid=<uuid>`. Esto hace la landing 100%
estática y portable.

- Portal HubSpot: `5491692`
- Form ID: `ccfc4878-7dd2-4b34-85f5-ae427106ba13`
- Campos enviados: `firstname`, `email`, `phone`, `tipo_de_vivienda`
- La factura estimada viaja en el `pageUri` del contexto

`netlify/functions/lead.mjs` queda en el repo como respaldo histórico, sin uso.

### 2.3 Estructura de la landing

Hero en dos columnas (escritorio) con la calculadora visible sin scroll. El formulario es el
**paso 2 dentro de la misma tarjeta**: al pulsar el CTA los campos aparecen en el mismo sitio,
sin navegar ni hacer scroll.

En móvil el orden se invierte con `display: contents` en `.hero-copy`: gancho corto →
calculadora → resto del argumento.

**Hay un solo formulario en toda la página.** No añadir un segundo: partiría la medición del
evento `Lead` entre dos formularios.

### 2.4 La calculadora

Lógica portada de `src/data/campaign.ts` (tabla `FINANCING`, términos de 20 años al 7.95%):

| Sistema | Valor | Cuota |
|---|---|---|
| 5kW + batería (8 placas) | $18,000 | $150/mes |
| 10kW + batería (12 placas) | $30,000 | $250/mes |
| 15kW + batería (15 placas) | $45,000 | $369/mes |

Recomienda el sistema más grande cuya cuota deje al menos un 10% de margen frente a la
factura, para que el ahorro mostrado sea real y no quede en cero justo en el límite. Con
facturas bajas el valor mostrado pasa a ser el respaldo, no el ahorro.

Incluye una comparación **alquilar vs poseer** a 20 años: lo que se le paga a LUMA sin quedarse
con nada, frente a pagar el sistema y quedárselo. El total de LUMA usa la tarifa actual **sin
proyectar aumentos**, o sea una estimación conservadora que no infla la comparación.

---

## 3. Medición

Pixel de Meta: **`2484699815368533`** (dataset "Lumina PR - Web").

| Acción del usuario | Evento propio | Evento estándar |
|---|---|---|
| Carga la página | `PageView` | — |
| Mueve el slider (1ª vez) | `CalculadoraUsada` | `ViewContent` |
| Pulsa el CTA / abre el formulario | `FormularioAbierto` | `InitiateCheckout` |
| Envía el formulario | — | `Lead` (con `eventID`) |
| Pulsa un botón de WhatsApp | — | `Contact` |

**Por qué hay duplicados:** los eventos personalizados tardan en indexarse y no aparecen en el
selector de conversiones de Meta, lo que bloquea cambiar la optimización. Los estándar se pueden
seleccionar al instante y Meta tiene mucho más historial de entrenamiento con ellos. Los propios
sirven para diagnóstico; los estándar para que Meta optimice.

Se capturan 12 campos de atribución en el formulario: las 5 UTMs, `fbclid`, `fbc`, `fbp`,
`event_id`, `referrer`, `landing_url` y `factura_estimada`. Se guardan en `sessionStorage`
(primer toque) para sobrevivir entre páginas.

**Ojo con la pestaña "Overview" del Administrador de eventos: tiene retraso** (hasta horas).
Para verificar en tiempo real usar "Test events". Evidencia observada: un `Lead` real tardó
horas en reflejarse en Overview.

---

## 4. Estado de la campaña de Meta

Campaña: **LUMINA | Leads | Validación Mes 1** — objetivo Clientes potenciales, Advantage+ **apagado**.

| Conjunto | Estado | Optimiza por | Gastado |
|---|---|---|---|
| `PR | Propietarios 30-65 | Prospección - VIEW` | Encendido | `ViewContent` | $5.06 |
| `LEAD` (el original) | Apagado | `Website Lead` | $55.80 |

Configuración del conjunto activo:

- Presupuesto: $50/día, sin reparto entre conjuntos
- Ubicaciones **manuales**: Facebook, Instagram, WhatsApp. Audience Network excluido, gasto limitado en 0
- Geografía: Bayamón, Caguas, Guaynabo (+25mi), Humacao (+25mi), San Juan. Excluye Toa Baja (+25mi)
- Segmentación: (`Solar energy` o `Solar panel`) **Y** (`Home Ownership Scheme` o `Home improvement`) → ~285,600–335,900 personas
- 4 anuncios: Independencia, Respaldo-Apagón, Apagones 24/7, Ahorro-Inversión
- Destino: `https://luminapr.net/`

### 4.1 Por qué se optimiza por `ViewContent` y no por `Lead`

Meta necesita ~50 conversiones semanales del evento optimizado para salir de la fase de
aprendizaje. Con un CPL de mercado de $30–100 en solar y $50/día, **nunca se llega a 50 leads
por semana**. Optimizar por `Lead` con cero conversiones históricas dejaba a Meta sin nada que
aprender, entregando a lo más amplio y barato.

`ViewContent` (~8/día ≈ 56/semana) es el único escalón con volumen suficiente. **Es temporal:**
cuando `InitiateCheckout` acumule volumen hay que bajar a ese, y después a `Lead`. Quedarse en
`ViewContent` indefinidamente atrae curiosos que juegan con el slider.

### 4.2 Advantage+ audience está activo y no se puede desactivar

Meta trata la segmentación detallada como *"Your suggestion"* y avisa: *"We'll also show ads
beyond your detailed targeting settings"*. Solo respeta al 100% **ubicación, edad y género**.

**Consecuencia estratégica:** con la expansión activa, **el creativo es la segmentación real**.
Meta decide a quién mostrar el anuncio según quién reacciona a él. Mejorar el copy y la imagen
rinde más que afinar la lista de intereses.

### 4.3 Candados de Meta encontrados

- El **evento de conversión** no se puede cambiar en un conjunto ya publicado → hay que duplicar
- El **objetivo de rendimiento** no se puede cambiar con reparto de presupuesto activo
- Al **duplicar**, Meta premarca "recomendaciones" (Advantage+ creative, formularios instantáneos)
  que hay que **desmarcar**: Advantage+ creative recorta y altera las imágenes, algo dañino para
  una marca que vende confianza
- Duplicar un conjunto **pierde la segmentación detallada**: hay que rehacerla

---

## 5. Resultados y diagnóstico

### 5.1 Números (22–25 de julio de 2026)

| Métrica | Valor | Referencia del mercado |
|---|---|---|
| Gasto total | ~$61 | — |
| Impresiones | 10,187 | — |
| Clics | ~349 | — |
| CTR | 0.92–1.26% | ~2% en solar |
| CPC | $0.76–0.81 | sano tras quitar Audience Network |
| **Leads reales** | **0** | — |

**Confirmado con el equipo de ventas (Natana): cero leads reales.** Los 2 `Lead` que aparecían en
Meta eran pruebas nuestras, detectadas por una inconsistencia imposible: `Lead` (2) era mayor que
`FormularioAbierto` (1), y nadie puede enviar un formulario sin abrirlo.

### 5.2 Por qué no hubo leads

La landing estuvo **técnicamente rota durante casi todo el gasto**:

- Formulario al 84% de profundidad de la página (7,2 pantallas de scroll)
- En móvil (90% del tráfico) la calculadora empezaba a 593px y el CTA a 1281px: **nada visible sin scroll**
- Formulario de 7 campos
- Tráfico basura de Audience Network durante los primeros días
- Optimización por "vistas de página" en vez de conversiones al inicio
- Medición contando conversiones falsas

Todo eso se corrigió el 25 de julio. **Los ~$61 gastados compraron diagnóstico, no leads.**

### 5.3 La evidencia más importante

Un anuncio apuntaba **directo a WhatsApp** — un toque, sin formulario, sin landing — y recibió
**cero mensajes**. Dos rutas de conversión independientes en cero absoluto.

Cuando la ruta de menor fricción posible da cero, el problema no es la mecánica de la página:
es que **el mensaje no genera ganas de contactar**.

---

## 6. Pendientes, por orden de impacto

### 6.1 Prueba social real — el hueco más grande

La landing no tiene **ni un testimonio real, ni una foto de instalación propia, ni número de
licencia, ni garantía visible**. Se pide una decisión de $18,000–$35,000 como marca desconocida,
frente a WindMar (instala 1 de cada 3 paneles de la isla) y Sunrun.

Hace falta del equipo: **3 testimonios con nombre y pueblo, fotos de instalaciones hechas, y el
número de licencia.** No se puede inventar ni generar con IA: sería deshonesto y contraproducente
en un mercado donde la confianza es todo.

### 6.2 Creativos nuevos

El CTR de 0.92% está por debajo del ~2% del mercado. **Importante:** el ángulo de los incentivos
del gobierno, que parecía la mejor palanca, **queda descartado** porque los programas no están
vigentes (sección 1.1).

Ángulos que sí son honestos y disponibles:
- Propiedad: la cuota compra un activo, la factura de LUMA no
- Respaldo con batería en los apagones (dolor real y constante en PR)
- $0 de contado, cuota frecuentemente menor que la factura actual
- Comparación a 20 años: LUMA vs Lumina

### 6.3 Leer el embudo con datos limpios

Primera medición válida de la campaña. Revisar:
`PageView → ViewContent → InitiateCheckout → Lead`

- Si `ViewContent` sube pero `InitiateCheckout` no → la calculadora no convence de dar el paso
- Si `InitiateCheckout` sube pero `Lead` no → el formulario asusta
- Si nada levanta → audiencia o creativo

**Regla de decisión sobre bloquear el resultado de la calculadora:** si de cada 100 usos de
calculadora menos de 8 dejan datos, probar un bloqueo parcial (mostrar la cuota gratis, pedir
datos para el análisis exacto). Si van 10 o más, el modelo abierto funciona.

### 6.4 Dudas abiertas para el equipo

- ¿Toa Baja y Carolina están excluidas a propósito? Son zonas pobladas del área metro
- La edad mínima quedó en 25; se había acordado 30–65
- ¿La estructura de financiamiento es préstamo o lease/PPA? Determina si aplica algo de la
  Sección 48E que se pueda comunicar honestamente

---

## 7. Contexto de mercado (Puerto Rico)

| Dato | Valor |
|---|---|
| Tarifa eléctrica LUMA | ~$0.27/kWh |
| Penetración solar en techos | ~10% (90% del mercado sin tocar) |
| Sistemas que incluyen batería | ~83% |
| Costo de sistema con batería | $18,000–$35,000 |
| CPL en Meta para solar | $30–100 (top performers $25–50) |
| CAC por contrato firmado | $800–1,500 |
| Conversión de landing solar | 3–5% con formulario, 15–25% con calculadora |

Competencia: **WindMar** (dominante, 1 de cada 3 paneles), **Sunrun** (nacional), Máximo Solar,
Pura Energia. Lumina es marca nueva: su CPL será más alto hasta construir reconocimiento.

Implicación: solar es compra de alto valor y decisión lenta. Esperar **menos leads pero de más
valor**, con CPL más alto que en productos baratos, y necesidad de seguimiento rápido.

---

## 8. Cómo verificar cambios en la landing

El entorno permite emular viewport real con `agent-browser`, que es la única forma fiable de
comprobar el comportamiento en móvil (estimar a partir de alturas CSS ya produjo conclusiones
erróneas):

```bash
agent-browser --session m open
agent-browser --session m set viewport 390 844      # iPhone 14
agent-browser --session m open https://luminapr.net/
agent-browser --session m eval '<expresión JS>'
```

Usar `--session <nombre>` distinto por prueba: la emulación de dispositivo se queda pegada entre
comandos y contamina mediciones posteriores.

Viewports de referencia: **390x844** (iPhone 14), **375x667** (iPhone SE, el caso más estrecho y
corto), **1440x900** (escritorio).

Para comprobar que los eventos del pixel se disparan, interceptar `fbq`:

```js
window.__ev=[]; var o=window.fbq;
window.fbq=function(){ window.__ev.push(arguments[1]); if(o) o.apply(null,arguments) };
```

**Meta filtra los eventos de navegadores automatizados**, así que una prueba desde este entorno
confirma que el código dispara, pero **no** que Meta lo registre. Para eso hace falta un teléfono
real.

La landing tiene `cache-control: max-age=600`. Al verificar cambios recién desplegados, usar un
parámetro anti-caché (`?v=nuevo`) o esperar 10 minutos.
