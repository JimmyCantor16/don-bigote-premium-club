# Especificación y plan

## Qué se construye
Landing page de lujo para «Don Bigote Premium Club», barbería en El Poblado, Medellín, que presenta servicios (corte, barba, spa facial, cerveza artesanal de cortesía) y vende tres membresías mensuales (Esencial, Caballero, Ejecutivo) con reserva directa por WhatsApp +57 300 555 0101.

## Pantallas que verás
- Inicio (hero exclusivo con llamado a reservar por WhatsApp y beneficio principal de la membresía)
- Membresías (tarjetas comparativas de Esencial, Caballero y Ejecutivo con precio mensual, beneficios y botón 'Quiero esta membresía' que abre WhatsApp)
- Servicios (corte, barba, spa facial y cerveza artesanal de cortesía con descripción, duración y precio)
- Experiencia / Galería (fotos del local, ambiente y trabajos, con estado de carga y mensaje amable si una imagen falla)
- Testimonios de socios (opiniones creíbles de miembros del club)
- Preguntas frecuentes (acordeón accesible sobre membresías, cancelación, reservas y cerveza)
- Ubicación y horario (mapa o dirección en El Poblado, horario lunes a sábado 9:00-21:00, indicador 'Abierto ahora / Cerrado' calculado según la hora de Medellín)
- Reserva (formulario corto de nombre, servicio y fecha/hora preferida que arma un mensaje prellenado de WhatsApp, con validaciones y mensajes de error claros)
- Pie de página (contacto, redes, WhatsApp y aviso legal)
- Estado de error / página no encontrada (mensaje elegante con botón para volver al inicio)

## Datos del sistema
- Membresía (nombre, precio mensual, beneficios, cantidad de cortes/servicios incluidos, destacada sí/no)
- Servicio (nombre, descripción, duración, precio, categoría: corte, barba, spa facial, cortesía)
- Testimonio (nombre del socio, membresía, comentario, calificación)
- PreguntaFrecuente (pregunta, respuesta)
- Horario (día, hora de apertura, hora de cierre)
- Sede (nombre, dirección, barrio, ciudad, teléfono WhatsApp)
- SolicitudReserva (nombre, servicio o membresía de interés, fecha y hora preferida, mensaje armado para WhatsApp)
- ImagenGaleria (título, descripción alternativa, ruta de imagen)

## API del backend
- GET /api/memberships
- GET /api/services
- GET /api/testimonials
- GET /api/faqs
- GET /api/schedule
- GET /api/location
- GET /api/gallery
- POST /api/booking-requests

## Para considerarlo funcional, debes VER
- Al abrir la página se ve de inmediato un hero oscuro y elegante (negro, dorado y tonos cálidos) con el nombre «Don Bigote Premium Club», una frase que transmite exclusividad y un botón visible 'Reservar por WhatsApp'
- Se ven tres tarjetas de membresía (Esencial, Caballero, Ejecutivo) con precios mensuales en pesos colombianos, listas de beneficios y la del medio (Caballero) resaltada como 'Más elegida'
- Al pulsar cualquier botón de reserva o membresía se abre WhatsApp con el número +57 300 555 0101 y un mensaje prellenado que menciona la membresía o el servicio elegido
- La sección de servicios muestra una cuadrícula con corte, barba, spa facial y cerveza artesanal de cortesía, cada uno con descripción, duración y precio o etiqueta 'Cortesía'
- Se ve el horario 'Lunes a sábado, 9:00 a 21:00' junto a un indicador de color que dice 'Abierto ahora' o 'Cerrado — abrimos mañana a las 9:00' según la hora real, y los domingos se muestra como cerrado
- Hay una sección de testimonios con al menos 4 opiniones de socios con nombre, membresía y estrellas
- Hay una galería con al menos 6 imágenes del ambiente de la barbería, con efecto sutil al pasar el cursor y un marcador de posición elegante mientras cargan
- Las preguntas frecuentes se despliegan y pliegan como acordeón, con al menos 6 preguntas y se pueden usar con teclado
- El formulario de reserva muestra errores claros en rojo suave si faltan datos (por ejemplo 'Cuéntanos tu nombre') y, al enviarlo bien, muestra un mensaje de confirmación y abre WhatsApp
- Si los datos no cargan, en lugar de una pantalla vacía se ve un mensaje cuidado con botón 'Reintentar' y, mientras tanto, contenido de ejemplo realista

## Stack
Frontend en React con Vite y CSS moderno (variables, grid, responsive mobile-first) con tipografías elegantes serif+sans, y un backend ligero en Node.js con Express que sirve los datos de ejemplo desd
