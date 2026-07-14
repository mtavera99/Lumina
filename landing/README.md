# Landing de captación — solar.luminapr.net

Landing independiente y optimizada para la campaña de Meta de Lumina PR. Reutiliza el **mismo widget de captura de leads de OpenSolar** que ya usa luminapr.net, así los leads siguen entrando a OpenSolar (y de ahí a HubSpot) exactamente igual que hoy. Incluye el **píxel de Meta** para medir conversiones.

Archivos:
- `index.html` — la landing.
- `gracias.html` — página de agradecimiento que dispara el evento `Lead` del píxel.

---

## Paso 1 — Poner tu ID de píxel de Meta

En `index.html` y en `gracias.html`, reemplaza `TU_PIXEL_ID` por el ID real de tu píxel.
- Lo encuentras en Meta → **Administrador de eventos** → tu origen de datos (píxel).
- Si aún no tienes píxel, créalo ahí (es gratis). Aparece un número tipo `1234567890`.

## Paso 2 — Desplegar en Netlify (opción más simple, gratis)

**Opción rápida (arrastrar y soltar):**
1. Entra a https://app.netlify.com/drop
2. Arrastra la carpeta `landing/` completa.
3. Netlify publica una URL temporal (ej. `random-name.netlify.app`). Ya está en línea.

**Opción con Git (se actualiza sola):**
1. En Netlify → *Add new site* → *Import from Git* → elige el repo `Lumina`.
2. **Base directory / Publish directory:** `landing`
3. Build command: *(déjalo vacío, es HTML estático)*.
4. Deploy.

> Vercel también sirve: *New Project* → repo `Lumina` → **Root Directory = landing** → Framework: *Other* → Deploy.

## Paso 3 — Conectar el subdominio solar.luminapr.net (GoDaddy)

1. En Netlify: *Domain settings* → *Add a domain* → escribe `solar.luminapr.net`. Netlify te mostrará el valor de destino (algo como `tu-sitio.netlify.app`).
2. En **GoDaddy** → *Mis productos* → dominio `luminapr.net` → **DNS** → *Añadir registro*:
   - **Tipo:** CNAME
   - **Nombre:** `solar`
   - **Valor:** el destino que te dio Netlify (ej. `tu-sitio.netlify.app`)
   - **TTL:** 1 hora (por defecto)
3. Guarda. En 15–30 min (a veces más) `solar.luminapr.net` mostrará la landing con HTTPS automático.

> Importante: solo añades un registro **CNAME para el subdominio `solar`**. NO tocas el dominio principal `luminapr.net` ni el correo — tu web actual sigue igual.

## Paso 4 (recomendado) — Que el evento `Lead` cuente solo conversiones reales

Para medir bien en Meta, lo ideal es que tras enviar el formulario el usuario llegue a `gracias.html`:
1. En **OpenSolar**, en la configuración del *Lead Capture Widget*, busca la opción de **URL de redirección / página de agradecimiento** tras el envío.
2. Ponla en: `https://solar.luminapr.net/gracias.html`
3. Así, cada lead completado abre esa página y dispara `fbq('track','Lead')` una sola vez por conversión real.

> Si el widget no permite redirección, el píxel igual registra el tráfico (`PageView`) y podrás optimizar por tráfico/clics; avísame y vemos una alternativa (p. ej. Conversions API vía HubSpot).

## Paso 5 — Usar la URL en tu anuncio de Meta

Pon como destino del anuncio: `https://solar.luminapr.net/`

---

### Notas
- La integración con OpenSolar/HubSpot **no se toca**: es el mismo widget (ID `37f4...`).
- Si OpenSolar te entrega un widget nuevo, reemplaza el `src` del `<script id="opensolar_lead_capture">` en `index.html`.
- La landing es estática (HTML puro): carga rápido en móvil, que es donde llega la mayoría del tráfico de Meta.
