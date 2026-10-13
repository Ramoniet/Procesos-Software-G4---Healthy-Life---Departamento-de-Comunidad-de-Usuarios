# Healthy Life — Comunidad de Usuarios

Proyecto desarrollado para la asignatura **Procesos de Software** de la Universidad Rey Juan Carlos.

## Equipo 4 — Comunidad de Usuarios

El módulo de Comunidad de Usuarios forma parte de la plataforma **Healthy Life** y tiene como objetivo aumentar la motivación y la interacción social entre los usuarios mediante comunidades, retos colectivos, logros y un feed de actividad.

## Funcionalidades del Sprint 1

Durante el Sprint 1 se han trabajado las siguientes historias de usuario:

- **HU-01:** Crear comunidad temática.
- **HU-03:** Solicitar unirse a una comunidad.
- **HU-04:** Aceptar o rechazar solicitudes de acceso.
- **HU-05:** Abandonar una comunidad.
- **HU-12:** Visualizar publicaciones de la comunidad.
- **HU-13:** Publicar logros propios en el feed.

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Docker
- Docker Compose

## Estructura principal del proyecto

- `src/components`: componentes reutilizables de la interfaz.
- `src/pages`: pantallas principales de la aplicación.
- `src/app`: estado global y lógica compartida.
- `src/data`: datos simulados utilizados durante el Sprint 1.
- `src/types`: tipos y modelos del dominio.
- `src/api`: espacio destinado a la integración con servicios externos.
- `src/hooks`: hooks reutilizables de React.

## Mocks de interoperabilidad

Estos JSON son mocks de interoperabilidad para Sprint 1. Sirven para acordar
formatos de intercambio entre módulos mientras el proyecto utiliza datos
simulados.

Equipos relacionados:

- Equipo 1 – Login / Usuarios
- Equipo 2 – Hábitos
- Equipo 5 – Rutinas

Notas:

- Los identificadores se manejan como strings.
- Las fechas usan formato ISO 8601.
- `id_user` y `token` se utilizarán cuando sea necesario identificar al usuario
  autenticado.

## Ejecución en local

### Requisitos

- Node.js
- npm

### Instalación

```bash
npm install
npm run dev