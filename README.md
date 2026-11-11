# Nadxheelii Tours

Sitio web de **Nadxheelii Tours** — senderismo y exploración consciente de hongos mágicos en San José del Pacífico, Oaxaca.
Contenido tomado de la página de Facebook: https://www.facebook.com/Nayetours

Sitio estático (HTML + CSS + JS, sin compilación), listo para GitHub Pages.

```
index.html        Página única: inicio, experiencia, tours, galería, opiniones, eventos, cuidado, contacto
css/styles.css    Estilos
js/main.js        Configuración de WhatsApp, menú móvil, galería y animaciones
images/galeria/   Fotos de la galería
```

## Pendiente del cliente

1. **Número de WhatsApp** — en `js/main.js`, llena `WHATSAPP_NUMBER` (solo dígitos con código de país, ej. `5219511234567`).
   Mientras esté vacío, todos los botones de WhatsApp abren Messenger (`m.me/Nayetours`).
2. **Fotos** — sube las fotos (JPG, ~1600px de ancho) a `images/galeria/` con estos nombres.
   Si falta alguna, se muestra una ilustración en su lugar.

   | Archivo | Foto sugerida |
   |---|---|
   | `atardecer.jpg` | Atardecer entre pinos (vertical) |
   | `mar-de-nubes.jpg` | Vista del mar de nubes |
   | `bosque.jpg` | Bosque de pinos |
   | `niebla.jpg` | Rayos de luz en la niebla (horizontal) |
   | `hongo-1.jpg`, `hongo-2.jpg` | Amanitas rojas |
   | `sendero.jpg` | Persona caminando en el sendero (vertical) |
   | `hamacas.jpg` | Espacio con hamacas |
   | `cabana.jpg` | Cabaña con el letrero de hongo iluminado |

3. **Logo** — el sitio usa un ícono de hongo provisional; se puede cambiar por el logo real en `index.html` (`.brand-mark`).
4. **Tours y precios** — los tres tours en la sección `#tours` son una propuesta basada en la página de Facebook; ajustar nombres, duración y precios.
5. **Eventos** — actualizar la sección `#eventos` cuando haya nuevas fechas.

## Ver localmente

```bash
python3 -m http.server 8000
```

## Publicar en GitHub Pages

Settings → Pages → Deploy from a branch → rama principal, carpeta `/ (root)`.
