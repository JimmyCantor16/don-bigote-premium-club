# Don Bigote Premium Club

Corte, barba y spa facial en un ambiente reservado, con cerveza artesanal de cortesía. Hazte socio y asegura tu silla cada mes en El Poblado.

## Qué tiene la página

- Servicios con precio
- Planes
- Horarios
- Cómo funciona
- Opiniones de clientes
- Preguntas frecuentes
- Contacto (WhatsApp, teléfono, correo, mapa)

## El formulario de contacto

Funciona de verdad: cada mensaje se guarda en el servidor de la página
(`POST /api/contacto`, base SQLite en `data/contacto.db`).

Para leerlos, define la variable de entorno `CLAVE_ADMIN` en tu servidor y pide:

```
curl -H "X-Clave-Admin: TU_CLAVE" https://tu-pagina/api/mensajes
```

Si el envío falla, la página ofrece WhatsApp o correo con el mensaje ya escrito.

## Antes de publicarla

Revisa el número de WhatsApp, el teléfono, el correo y la dirección: son los
que el visitante va a usar para escribirte. Están en `index.html`.

Hecha con Meta-Agente: HTML/CSS/JS sin dependencias externas, con la librería
gráfica DIXEL dentro del proyecto (carpeta `vendor/`).
