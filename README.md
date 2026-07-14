# Lumina Campaign Studio

Panel interno de marketing de **LuminaPR Solar Solutions** (Grupo Atabaya) para montar y operar la campana de Meta Ads.

Construido con React + Vite + TypeScript. Colores de marca: navy `#0A2342` y oro `#C9A84C`.

## Secciones

| Seccion | Que hace |
|---|---|
| **Dashboard** | Presupuesto (Fase Validacion Mes 1, $2,000 · 40/35/25), KPIs objetivo, 5 pilares del mensaje y funnel de 6 pasos. |
| **Biblioteca de Anuncios** | 12 creativos listos para pegar en Meta Ads Manager (titular, texto principal, descripcion, CTA), filtrables por etapa del funnel y por pilar, con boton de copiar. Variantes A/B por pilar. |
| **Calculadora de Ahorro** | Estima el sistema recomendado, la cuota mensual y el ahorro segun la factura del cliente, usando la tabla de financiamiento. |
| **Landing de Captacion** | Pagina de destino del anuncio con formulario de leads (nombre, telefono, municipio, tipo de vivienda, factura, interes en bateria/financiamiento). Guarda leads y los exporta a CSV. |
| **Brand Kit** | Paleta, tagline, posicionamiento vs competencia, regla de oro (cuota, no precio total), tabla de financiamiento, banco de CTAs y pilares de contenido organico. |

## Desarrollo

```bash
npm install
npm run dev      # servidor local en http://localhost:5173
npm run build    # build de produccion en /dist
npm run preview  # previsualiza el build
```

## Despliegue (gratis)

El proyecto es una SPA estatica; se puede desplegar en segundos:

- **Vercel / Netlify**: conecta el repo, framework preset "Vite", comando `npm run build`, carpeta de salida `dist`.
- **GitHub Pages**: sube `/dist` (el `base` ya esta configurado como `./` en `vite.config.ts`).

## Notas de produccion

- **Leads**: en esta version los leads se guardan en el navegador (localStorage) y se exportan a CSV. Para produccion, conecta el envio del formulario a tu CRM o a un webhook (p. ej. una funcion serverless, Google Sheets o el CRM del equipo).
- **Pixel de Meta**: agrega el pixel y el evento `Lead` en el envio del formulario de la landing para medir conversiones.
- La calculadora es orientativa; las cifras finales se confirman en la evaluacion solar gratuita.
