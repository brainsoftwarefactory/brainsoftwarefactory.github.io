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

Landing de una sola página más la política de privacidad, sin dependencias de
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
├── assets/
│   ├── css/
│   │   └── main.css           # Design system + estilos de ambas páginas
│   ├── js/
│   │   ├── app.js             # Menú mobile + reveals on-scroll
│   │   └── contact-form.js    # Envío del formulario (webhook n8n → Chatwoot)
│   └── img/
│       ├── brain-logo.png     # Logo / favicon / imagen social
│       └── clients/           # Logos de clientes (tinta clara, fondo oscuro)
├── docs/                      # Documentación interna — EXCLUIDA del deploy
└── .github/                   # Deploy automático
```

## Identidad

Los colores de marca salen del logo, muestreados píxel por píxel.

| Token | Valor | Uso |
|-------|-------|-----|
| Fondo | `#0A0C12` | Base near-black |
| Azul brillante | `#0098FF` | Acción primaria, acentos, cifras |
| Azul royal | `#225DC6` | Profundidad, halos |
| Carbón | `#2B2B2B` | Del logo |
| Texto | `#F1F4FA` / `#9AA5B7` | Contrastes AA verificados |
| Tipografía | Plus Jakarta Sans · Spline Sans Mono | |

Sin violeta y sin gradientes de texto: no existen en la marca.

## Contenido

- **Sin precios ni planes publicados.** La conversión pasa por el diagnóstico.
- La sección de clientes arranca con Botulinic y tiene lugares reservados
  para los próximos logos (`assets/img/clients/`, tinta clara `#E9EEF7`).
- Canales que se comunican: WhatsApp y web. No se menciona Instagram.

## Desarrollo

Sitio estático: serví la carpeta con cualquier servidor HTTP
(`python3 -m http.server`) o abrí `index.html` en el navegador.

## Deploy

- **Push a `main`** → rsync a la VPS de producción (brain.com.ar).
- **Push a `develop`** → GitHub Pages (preview).

Ambos workflows excluyen `docs/` y `README.md` del artefacto publicado:
la documentación interna no llega al servidor.

---

<p align="center">© 2026 Brain · Buenos Aires, Argentina · <a href="mailto:ventas@brain.com.ar">ventas@brain.com.ar</a> · <a href="https://wa.me/541160507276">+54 11 6050-7276</a></p>
