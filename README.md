# Nadxheelii Tours

Sitio web de **Nadxheelii Tours** — senderismo, medicina, temazcal y hospedaje en San José del Pacífico, Oaxaca.
Contenido tomado de la página de Facebook: https://www.facebook.com/Nayetours

Sitio estático (HTML + CSS + JS, sin compilación), listo para GitHub Pages.

```
index.html        Página única: inicio, experiencia, servicios, galería, opiniones, eventos, cuidado, contacto
css/styles.css    Estilos
js/main.js        Número de WhatsApp (WHATSAPP_NUMBER), menú móvil, galería y animaciones
images/logo.jpg   Logotipo (también logo-160.jpg y apple-touch-icon.png)
images/galeria/   Fotos de la galería
```

## Pendiente del cliente

1. **Fotos** — sube las fotos (JPG, ~1600px de ancho) a `images/galeria/` con estos nombres.
   Si falta alguna, se muestra una ilustración en su lugar.

   | Archivo | Foto sugerida |
   |---|---|
   | `atardecer.jpg` | Atardecer entre pinos (vertical) |
   | `mar-de-nubes.jpg` | Vista del mar de nubes |
   | `bosque.jpg` | Bosque de pinos |
   | `niebla.jpg` | Rayos de luz en la niebla (horizontal) |
   | `hongo-1.jpg` | Amanita roja |
   | `temazcal.jpg` | El temazcal |
   | `sendero.jpg` | Persona caminando en el sendero (vertical) |
   | `hamacas.jpg` | Espacio con hamacas |
   | `cabana.jpg` | Cabaña con el letrero de hongo iluminado |

2. **Servicios y precios** — los textos de Senderismo, Medicina, Temazcal y Hospedaje (sección `#servicios`) son una propuesta; ajustar descripciones, duración y precios.
3. **Eventos** — actualizar la sección `#eventos` cuando haya nuevas fechas.

## Ver localmente

```bash
python3 -m http.server 8000
```

## Publicar en GitHub Pages

Settings → Pages → Deploy from a branch → rama `main`, carpeta `/ (root)`.
El sitio quedará en https://leticia-blkberry.github.io/nayeli-tours/

## Información pendiente del cliente (para completar la página)

- Precio, duración, tamaño de grupo y qué incluye cada servicio (sección `#servicios` y la pregunta "¿Cuánto cuesta y qué incluye?").
- Punto de encuentro y recomendaciones para llegar (pregunta "¿Dónde nos encontramos y cómo llego?").
- Formas de pago y política de cancelación (se pueden agregar como preguntas nuevas).
- Fotos reales para la galería.
- Próximas fechas de ceremonias/eventos (los actuales son de 2025).
- Más reseñas, y enlaces a Google Maps / TripAdvisor si existen.
- Confirmar si siguen ofreciendo Hospedaje.

## Calendario de disponibilidad (Google Calendar)

La sección **Solicita tu fecha** (`#reservar`) **no hace reservaciones**: el formulario solo arma un
mensaje de WhatsApp marcado como solicitud, y la fecha se confirma únicamente cuando el negocio responde.
El calendario es solo de consulta para que el visitante vea qué horarios están ocupados.

Para mostrarlo:

1. En Google Calendar (computadora), crea un calendario aparte, por ejemplo "Disponibilidad Nadxheelii",
   y anota ahí los horarios ocupados.
2. Configuración del calendario → **Permisos de acceso** → activa **Hacer público** y elige
   **Ver solo libre/ocupado (ocultar detalles)**. Así nadie ve nombres ni datos de clientes.
3. En **Integrar el calendario**, copia el **ID del calendario** (termina en `@group.calendar.google.com`).
4. Pégalo en `js/main.js` en `const GOOGLE_CALENDAR = "";` y publica.

No uses las "Páginas de reserva / Agenda de citas" de Google: esas sí permiten reservar directamente.

