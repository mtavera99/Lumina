# Campaña de WhatsApp — guía de montaje paso a paso

Guía completa para lanzar la campaña. Basada en el análisis de la Biblioteca de Anuncios de
Meta (~100 anuncios activos de WindMar en Puerto Rico), en la propuesta comercial real de
Lumina, y en los datos de la campaña anterior.

**Actualizado:** 26 de julio de 2026

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
- [ ] **Configurar el mensaje de bienvenida** en WhatsApp Business (sección 5)
- [ ] **Definir horario de atención** y qué se responde fuera de él
- [ ] **Confirmar que el equipo NO menciona** los $15,000 del incentivo de PR ni el 30% federal:
      ambos programas están inactivos (ver `lumina-contexto.md`, sección 1.1)
- [ ] **Tener listas 2–3 fotos reales** de instalaciones de Lumina, o grabar un video vertical

---

## 3. Configuración en Ads Manager

### 3.1 Campaña

| Campo | Valor |
|---|---|
| Nombre | `LUMINA \| WhatsApp \| Inspección` |
| Objetivo | **Interacción** (si no aparece, *Clientes potenciales*) |
| Advantage+ campaña | **Apagado** |
| Presupuesto | a nivel de **conjunto**, no de campaña |
| Reparto de presupuesto entre conjuntos | **Desactivado** |

> **Trampa conocida:** si dejas activo el reparto de presupuesto, Meta **bloquea el objetivo de
> rendimiento** y no lo podrás cambiar después sin duplicar el conjunto. Ya nos pasó.

### 3.2 Conjunto de anuncios

| Campo | Valor |
|---|---|
| Nombre | `PR \| Propietarios 30-65 \| WhatsApp` |
| Ubicación de conversión | **Apps de mensajes → WhatsApp** |
| Número | 939-375-5858 |
| Optimización | **Conversaciones iniciadas** |
| Presupuesto | **$20–25/día** |
| Edad | **30 – 65** |

**Geografía:** Bayamón, Caguas, Guaynabo +25mi, Humacao +25mi, San Juan.
Desmarcar *"Reach more people likely to respond"* — muestra anuncios a gente **interesada** en
esos pueblos aunque no viva en Puerto Rico.

**Segmentación detallada:**

- Intereses: `Solar energy`, `Solar panel`
- Pulsar **"Define further"** (crea condición **Y**, no **O**) y añadir: `Home Ownership Scheme`,
  `Home improvement`

> Añadir intereses en la caja principal **amplía** la audiencia. Solo *"Define further"* la
> reduce. Si el número sube al añadir algo, estás en la caja equivocada.

Objetivo de tamaño: **280,000 – 350,000**.

**Ubicaciones: manuales.** Incluir Facebook Feed, Instagram Feed, Reels y Stories.

Excluir:

- **Audience Network** — histórico de clics accidentales a $0.20 con cero conversión
- **Estados de WhatsApp** — al activarlo el CPC cayó de $0.69 a $0.30, el patrón del inventario
  de baja intención. Meta incluso amplió la audiencia sola para esa ubicación

Dejar **desmarcada** la casilla *"Permitir gasto limitado en ubicaciones excluidas"*. Verificar
que quede en `Allowed with limited spend: 0`.

### 3.3 Anuncios

Crear los 4 de la sección 4. Al duplicar cualquier cosa, **desmarcar todas las
"recomendaciones"** que Meta premarca:

- *Advantage+ creative* — recorta y altera las imágenes. Para una marca que vende confianza en
  una compra de $20,000+, dañino
- *Formularios instantáneos* — cambia el destino y rompe el flujo a WhatsApp

---

## 4. Los 4 anuncios

### Decisión de fondo: no se menciona precio

WindMar anuncia **10 paneles + batería Tesla Powerwall 3 desde $125/mes**, con $0 pronto,
garantía de 25 años, bonos de $1,000 al instalar y $500 por referido, y sus vendedores dicen
literalmente *"te mejoro la oferta de la competencia"*.

Anunciar "desde $150/mes" nos pone a perder una comparación que el prospecto va a hacer, porque
los vendedores de WindMar están en el mismo feed. Además la cuota real está en duda: la tabla
del repo asume 7.95% pero la propuesta comercial dice *"desde 4.95% mediante cooperativa local"*,
lo que bajaría la entrada a ~$118/mes.

**Hasta confirmar la tasa, ningún anuncio lleva cifra de cuota.** Se compite por la oferta de la
inspección gratis y por el dolor del apagón, no por precio. Es también lo que hace la landing
del líder, que no menciona precio ni una vez.

---

### Anuncio 1 — Apagones *(el más fuerte)*

**Titular:** Cuando LUMA se va, tu casa sigue encendida

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

**Mensaje prellenado:**
```
Hola, soy dueño(a) de casa en PR y quiero la inspección gratis para el respaldo en apagones.
```

---

### Anuncio 2 — Qué te instalan de verdad

**Titular:** Te decimos marca por marca qué lleva tu sistema

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

**Mensaje prellenado:**
```
Hola, quiero la inspección gratis y ver qué equipos me recomiendan.
```

---

### Anuncio 3 — La inspección como servicio

**Titular:** Inspección energética gratis en tu casa

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

**Mensaje prellenado:**
```
Hola, quiero agendar la inspección energética gratis de mi casa.
```

---

### Anuncio 4 — Calificador directo

**Titular:** Si tu factura de luz pasa de $300, esto te conviene

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

**Mensaje prellenado:**
```
Hola, pago más de $300 de luz al mes y quiero la inspección gratis.
```

---

## 5. Truco de atribución

Los clics a WhatsApp **no llevan UTMs** a la conversación. Solución: cada anuncio usa un mensaje
prellenado distinto y reconocible. La primera línea del chat identifica el anuncio de origen.

| Primera línea del mensaje | Anuncio |
|---|---|
| "...respaldo en apagones" | 1 — Apagones |
| "...ver qué equipos me recomiendan" | 2 — Equipos |
| "...inspección energética gratis de mi casa" | 3 — Servicio |
| "...pago más de $300..." | 4 — Calificador |

Llevar la cuenta a mano una semana basta para saber qué ángulo funciona.

---

## 6. WhatsApp Business

### Mensaje de bienvenida

Califica de entrada y filtra curiosos sin gastar tiempo del equipo:

```
¡Hola! Gracias por escribir a Lumina PR ☀️

Para coordinar tu inspección gratis necesito 3 datos:

1️⃣ ¿Cuánto pagas de luz al mes (aproximado)?
2️⃣ ¿La casa es propia?
3️⃣ ¿En qué pueblo está?

Con eso coordinamos el día y la hora que te convenga.
```

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
3. Los flyers actuales, como último recurso

**No usar imágenes generadas con IA.** En una compra de $20,000+ de una marca desconocida, una
imagen que se ve artificial destruye la credibilidad que intentamos construir.

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

---

## 9. Trampas de Meta que ya nos costaron dinero

Documentadas para no repetirlas:

1. **El evento de conversión no se puede cambiar** en un conjunto ya publicado. Hay que duplicar
2. **El objetivo de rendimiento se bloquea** si el reparto de presupuesto está activo
3. **Al duplicar se pierde la segmentación detallada.** Hay que rehacerla
4. **Al duplicar, Meta premarca "recomendaciones"** (Advantage+ creative, formularios
   instantáneos) que hay que desmarcar
5. **Meta insiste en reactivar todas las ubicaciones** con el botón "Apply now". Ignorar siempre
6. **La casilla "gasto limitado en ubicaciones excluidas"** gasta ~5% en lo que excluiste
7. **Advantage+ audience no se puede desactivar** en algunos objetivos: trata los intereses como
   sugerencia. Solo respeta al 100% ubicación, edad y género. **Por eso el creativo es la
   segmentación real**
8. **La pestaña "Overview" del Administrador de eventos tiene retraso** de horas. Para verificar
   en tiempo real usar "Test events"
9. **Meta filtra eventos de navegadores automatizados.** Las pruebas hay que hacerlas desde un
   teléfono real

---

## 10. Pendientes que siguen abiertos

1. **¿Tasa 4.95% o 7.95%?** A 4.95% la entrada queda en ~$118/mes, **por debajo de los $125 de
   WindMar**. Cambia por completo si podemos competir por precio
2. **¿15kW cuesta $45,000 o $52,897?** El repo y la cotización real difieren un 13%
3. **¿Cuál es el crédito mínimo que aprueba Lumina?** WindMar exige **700+ de empírica** y techo
   de cemento. Si Lumina aprueba menos, ahí hay un mercado que el líder rechaza activamente, y
   un titular que se escribe solo: *"¿Te dijeron que no cualificabas para solar?"*
4. **Prueba social:** testimonios reales con nombre y pueblo, fotos de instalaciones, licencia
