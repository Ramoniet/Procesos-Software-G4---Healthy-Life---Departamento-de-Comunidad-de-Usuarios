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
```

## HU-06 — Definir un reto colectivo como administrador

- Solo el **administrador de la comunidad** puede crear retos desde su pestaña **Retos**. El permiso se comprueba en la interfaz y en `createChallenge()`, usando `community.adminId`.
- Se mantienen nombre (3–80 caracteres), descripción (10–300), catálogo de actividades y meta entera de **1 a 500 sesiones**. Cada entrenamiento compatible suma una sesión; no se suman kilómetros ni minutos.
- La **fecha límite es obligatoria** en retos nuevos: debe ser una fecha real y posterior al día actual según el calendario local. Los errores se muestran en el formulario.
- El reto se publica en estado `active`, guarda la fecha en formato `YYYY-MM-DD` y muestra esa fecha en su tarjeta. El creador queda inscrito automáticamente.
- Los retos antiguos sin fecha siguen siendo compatibles. Se conservan las claves de `localStorage`, la inscripción y el cálculo de progreso de HU-07.
- La fecha se valida al crear; no se implementa cierre automático ni filtrado del progreso por vencimiento.
- Criterios, pruebas ejecutadas y revisión manual pendiente: [`docs/HU-06-pruebas.md`](docs/HU-06-pruebas.md).

Verificaciones (después de `npm ci`):

```bash
npm run build
npm run lint
TZ=Europe/Madrid node --test scripts/test-hu06.mjs
```

Las pruebas usan el ejecutor de Node y TypeScript ya incluido en el proyecto, sin dependencias adicionales. Ejecutan el código real con hooks y almacenamiento simulados; la revisión visual y la recarga en un navegador se comprueban por separado.

## HU-07 — Retos dentro de las comunidades (CHLS-59 / CHLS-60)

- Entra en **Comunidades → Ver detalles → Retos** para ver los retos de una comunidad.
- Solo el **administrador de esa comunidad** puede crear retos; sus **miembros** pueden inscribirse.
- **Crear reto colectivo** permite dar nombre, descripción, actividad, meta (número de sesiones) y fecha límite futura.
- El creador queda inscrito automáticamente. Los demás miembros pueden pulsar **Unirme al reto** una sola vez.
- El progreso aumenta con entrenamientos compatibles, realizados después de la inscripción y sin duplicar IDs.
- Los datos se guardan **en el navegador con `localStorage`**, no en una base de datos compartida.
- El simulador de entrenamientos dentro de la pestaña facilita probar el cálculo mientras se integra el módulo real de Rutinas.
- La vista global `/retos` se mantiene para explorar; la creación ocurre dentro de cada comunidad.
- Instrucciones de inscripción y progreso: [`docs/HU-07-pruebas.md`](docs/HU-07-pruebas.md). Para crear retos, consultar los requisitos y pasos actualizados de [`HU-06`](docs/HU-06-pruebas.md).
- **Pendiente de acordar con el equipo:** unidad de progreso definitiva, autenticación e integración API/backend.
