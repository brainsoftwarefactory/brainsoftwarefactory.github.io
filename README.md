<p align="center">
  <img src="assets/img/brain-logo.png" alt="Brain" width="72">
</p>

<h1 align="center">Brain</h1>

<p align="center"><strong>Agentes de IA a medida.</strong></p>

<p align="center">
Agentes que atienden a tus clientes por WhatsApp y en tu web, y automatizan
las tareas de tu operación — 24/7, sobre infraestructura dedicada.
</p>

<p align="center">
  <a href="https://brain.com.ar"><img src="https://img.shields.io/badge/sitio-live-0098FF?style=flat-square" alt="Live"></a>
  <img src="https://img.shields.io/badge/build-sin_frameworks-225DC6?style=flat-square" alt="Build">
  <img src="https://img.shields.io/badge/licencia-privado-2B2B2B?style=flat-square" alt="Licencia">
</p>

---

## Sitio

Landing de una sola página más las páginas legales que lee Meta (privacidad y
eliminación de datos), sin dependencias de
frameworks. HTML + CSS + JS vanilla con separación de responsabilidades y
tipografía web. El chat es el widget oficial de Chatwoot
(`chatwoot.brain.com.ar`, inbox «Sitio web») y el formulario envía a n8n
(`webhook.brain.com.ar/webhook/contacto-web`), que crea la conversación en el
inbox «Formulario web» de Chatwoot. Todo corre en la VPS de producción.

## Estructura

```
brainsoftwarefactory.github.io/
├── index.html                 # Landing (solo estructura)
├── privacidad.html            # Política de privacidad (la lee Meta)
├── eliminacion-de-datos.html  # Cómo pedir la eliminación de datos (la lee Meta)
├── assets/
│   ├── css/
│   │   └── main.css           # Design system + estilos de ambas páginas
│   ├── js/
│   │   ├── app.js             # Menú, celulares animados, scroll de casos, filtros, reveals
│   │   ├── stories.js         # Conversaciones de ejemplo de los celulares
│   │   └── contact-form.js    # Envío del formulario (webhook n8n → Chatwoot)
│   ├── fonts/                 # Plus Jakarta Sans y Spline Sans Mono (OFL)
│   └── img/
│       ├── brain-logo-horizontal-claro.png  # Logo primario
│       ├── brain-isotipo-512.png            # Favicon
│       ├── brain-logo.png                   # Imagen social
│       └── canales/                         # Íconos de canales
├── docs/                      # Documentación interna — EXCLUIDA del deploy
└── .github/                   # Deploy automático
```

## Identidad

Tema claro primario de la marca 1.1 (`marca/tokens.json` del repositorio brain):
fondo crema, logo original negro, bloques planos en los azules del isotipo y
títulos grandes. Rediseño de DEVOPS-427, con ManyChat como referencia de estilo.

| Token | Valor | Uso |
|-------|-------|-----|
| Crema | `#F5F1E8` | Fondo base |
| Azul brillante | `#0098FF` | Bandas de color, acentos |
| Azul real | `#225DC6` | Tarjetas destacadas, botones secundarios |
| Grafito | `#2B2B2B` / `#04070D` | Texto, botones principales |
| Tipografía | Plus Jakarta Sans 800 (títulos) · Spline Sans Mono (etiquetas y botones) | Servidas desde `assets/fonts/` (OFL) |

Los íconos de canales de terceros (`assets/img/canales/`) salen de Simple Icons
(CC0), el mismo paquete que usa la maqueta de Platform; los genéricos son propios.

## Contenido

- **Sin precios ni planes publicados.** La conversión pasa por el diagnóstico.
- «Platform» es un nombre interno: la web no lo usa. Tampoco menciona Flow.
- Sin clientes nombrados: las conversaciones de ejemplo (`assets/js/stories.js`)
  son de negocios ficticios.
- Canales que se muestran: WhatsApp, Instagram, Messenger, TikTok, Telegram,
  correo, chat web, SMS, teléfono, videollamada y API.

## Desarrollo

Sitio estático: serví la carpeta con cualquier servidor HTTP
(`python3 -m http.server`) o abrí `index.html` en el navegador.

## Deploy

- **Push a `main`** → rsync a la VPS de producción (brain.com.ar).
- **Push a `develop`** → GitHub Pages (preview).

Ambos workflows excluyen `docs/` y `README.md` del artefacto publicado:
la documentación interna no llega al servidor.

---

<p align="center">© 2026 Brain · Buenos Aires, Argentina · <a href="mailto:ventas@brain.com.ar">ventas@brain.com.ar</a> · <a href="https://wa.me/5491170651142">+54 9 11 7065-1142</a></p>
