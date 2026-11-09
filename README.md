# Healthy Life — Comunidad de Usuarios

Proyecto desarrollado para la asignatura **Procesos de Software** de la Universidad Rey Juan Carlos.

## Equipo 4 — Comunidad de Usuarios

El módulo de Comunidad de Usuarios forma parte de la plataforma **Healthy Life**. Su objetivo es fomentar la motivación y la interacción entre los usuarios mediante comunidades temáticas, retos colectivos, publicaciones, logros y relaciones de amistad.

El proyecto se ha desarrollado siguiendo la metodología Scrum, organizando el trabajo en sprints y utilizando Jira, GitHub y Miro para la planificación, el desarrollo y la documentación.

## Funcionalidades del Sprint 1

Durante el Sprint 1 se completaron **6 historias de usuario, con un total de 31 puntos de historia**:

- **HU-01:** Crear comunidad temática.
- **HU-03:** Solicitar unirse a una comunidad.
- **HU-04:** Aceptar o rechazar solicitudes de acceso.
- **HU-05:** Abandonar una comunidad.
- **HU-12:** Visualizar publicaciones de la comunidad.
- **HU-13:** Publicar logros propios en el feed.

Estas funcionalidades establecieron la base para gestionar las comunidades y permitir las primeras interacciones entre sus miembros.

## Funcionalidades del Sprint 2

Durante el Sprint 2 se completaron las **7 historias de usuario comprometidas, con un total de 36 puntos de historia**:

- **HU-02:** Buscar y filtrar comunidades.
- **HU-06:** Definir un nuevo reto colectivo como administrador.
- **HU-07:** Unirse a un reto colectivo activo.
- **HU-08:** Visualizar el progreso compartido del reto.
- **HU-14:** Comentar publicaciones de otros miembros.
- **HU-17:** Enviar solicitudes de conexión a otros usuarios.
- **HU-20:** Aceptar o rechazar solicitudes de amistad.

Este sprint amplía las funcionalidades del módulo incorporando la búsqueda de comunidades, la participación en retos colectivos, el seguimiento del progreso, los comentarios y las relaciones entre usuarios.

### Resultados del Sprint 2

- **7 historias de usuario completadas.**
- **36 de 36 puntos de historia realizados.**
- Integración de las funcionalidades mediante ramas y Pull Requests en GitHub.
- Actualización del Product Backlog y del seguimiento del trabajo en Jira.
- Documentación de los procesos funcionales, dependencias entre equipos, métricas y retrospectiva en Miro.

## Gestión de retos colectivos — HU-06, HU-07 y HU-08

Los retos colectivos permiten a los miembros de una comunidad participar en objetivos comunes relacionados con distintas actividades.

### HU-06 — Crear un reto colectivo

La creación de retos está reservada al administrador de cada comunidad.

- El permiso se comprueba utilizando `community.adminId`, tanto en la interfaz como en la función `createChallenge()`.
- Cada reto incluye un nombre, una descripción, una actividad, una meta y una fecha límite.
- El nombre debe tener entre 3 y 80 caracteres y la descripción entre 10 y 300.
- La meta debe ser un número entero de entre 1 y 500 sesiones.
- La fecha límite es obligatoria y debe ser posterior al día actual.
- Los nuevos retos se publican en estado `active`.
- El administrador que crea el reto queda inscrito automáticamente.
- Se mantiene la compatibilidad con retos antiguos que no tienen fecha límite.

Cada entrenamiento compatible suma una sesión al progreso. No se utilizan kilómetros ni minutos como unidad de medida.

La fecha se valida al crear el reto, pero no se ha implementado el cierre automático cuando vence el plazo.

Documentación de pruebas: [HU-06 — Pruebas y validaciones](docs/HU-06-pruebas.md).

### HU-07 — Unirse a un reto colectivo

Los miembros de una comunidad pueden consultar los retos activos e inscribirse en ellos.

El acceso se realiza desde **Comunidades → Ver detalles → Retos**.

- Los administradores pueden crear retos dentro de sus comunidades.
- Los miembros pueden inscribirse en un reto activo.
- Cada usuario solo puede inscribirse una vez en el mismo reto.
- La participación queda registrada para calcular el progreso individual y colectivo.
- Los entrenamientos compatibles realizados después de la inscripción contribuyen al progreso.
- Se evita contabilizar varias veces un mismo entrenamiento.

La aplicación dispone de un simulador de entrenamientos para comprobar el funcionamiento de los retos mientras se completa la integración con el módulo de Rutinas.

Documentación de pruebas: [HU-07 — Inscripción y progreso](docs/HU-07-pruebas.md).

### HU-08 — Visualizar el progreso compartido

Los participantes pueden consultar el progreso acumulado de un reto y compararlo con el objetivo establecido.

La funcionalidad utiliza los datos de participación y los entrenamientos compatibles registrados para mostrar el avance del reto.

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
- `src/data`: datos simulados utilizados por la aplicación.
- `src/types`: tipos y modelos del dominio.
- `src/api`: espacio destinado a la integración con servicios externos.
- `src/hooks`: hooks reutilizables de React.
- `src/utils`: funciones auxiliares.
- `docs`: documentación técnica y pruebas de las historias de usuario.
- `scripts`: scripts de comprobación y pruebas.

## Integración con otros equipos

El módulo de Comunidad de Usuarios necesita intercambiar información con otros módulos de Healthy Life.

Los equipos con los que se han identificado dependencias son:

- **Equipo 1 — Identidad y Usuarios:** identificadores de usuario, información de perfil y roles.
- **Equipo 2 — Hábitos y Actividad:** información sobre actividades realizadas por los usuarios.
- **Equipo 5 — Rutinas y Entrenamientos:** entrenamientos completados que pueden contribuir al progreso de los retos.

Los formatos de intercambio se han documentado mediante contratos de integración basados en JSON.

Actualmente, la aplicación utiliza datos simulados y almacenamiento local para desarrollar y comprobar las funcionalidades sin depender de que todos los servicios externos estén disponibles.

### Datos simulados y almacenamiento

Los datos de prueba permiten simular comunidades, usuarios, publicaciones, retos y entrenamientos.

Se utilizan las siguientes convenciones:

- Los identificadores se manejan como cadenas de texto.
- Las fechas utilizan el formato ISO 8601 cuando corresponde.
- Los campos `id_user` y `token` están previstos para identificar al usuario autenticado cuando sea necesario.
- Parte del estado de la aplicación se conserva en `localStorage`.

El almacenamiento local permite mantener los datos en el navegador, pero no sustituye a una base de datos compartida entre usuarios o dispositivos.

## Ejecución en local

### Requisitos

- Node.js
- npm

### Instalación y ejecución

Clonar el repositorio e instalar las dependencias:

```bash
npm install
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

La terminal mostrará la dirección local desde la que se puede acceder a la aplicación.

### Comprobaciones del proyecto

Compilar la aplicación:

```bash
npm run build
```

Ejecutar el análisis estático:

```bash
npm run lint
```

### Pruebas de HU-06

Después de instalar las dependencias:

```bash
TZ=Europe/Madrid node --test scripts/test-hu06.mjs
```

Estas pruebas comprueban la lógica de creación de retos utilizando simulaciones de los hooks y del almacenamiento.

Las comprobaciones de interfaz, permisos y persistencia en el navegador se realizan por separado.

## Organización del trabajo

El desarrollo se organiza mediante historias de usuario estimadas en puntos de historia.

Para controlar los cambios en el código se utilizan ramas de Git y Pull Requests, que permiten incorporar las funcionalidades a la rama principal después de su revisión.

Las herramientas de seguimiento son:

- **Jira:** gestión del Product Backlog, sprints, prioridades, asignaciones y métricas.
- **GitHub:** repositorio de código, ramas y Pull Requests.
- **Miro:** roadmap, historias de usuario, diagramas de flujo, dependencias, riesgos y retrospectivas.

### Resultados de los sprints

| Sprint | Historias completadas | Puntos completados |
|---|---:|---:|
| Sprint 1 | 6 | 31 |
| Sprint 2 | 7 | 36 |

## Planificación del Sprint 3

Se ha preparado una planificación inicial del Sprint 3 con **7 historias de usuario y 30 puntos de historia**:

- **HU-09:** Otorgar medalla virtual por marca personal.
- **HU-10:** Visibilidad de medallas en el perfil.
- **HU-11:** Notificación de nueva medalla conseguida.
- **HU-15:** Eliminar publicaciones o comentarios inapropiados.
- **HU-16:** Gestionar y expulsar miembros de la comunidad.
- **HU-18:** Filtrar el feed por actividad de amigos.
- **HU-19:** Eliminar a un usuario de la lista de amigos.

Estas funcionalidades están planificadas, pero no forman parte de los resultados completados en el Sprint 2.

## Enlaces del proyecto

- [Repositorio de GitHub](https://github.com/Ramoniet/Procesos-Software-G4---Healthy-Life---Departamento-de-Comunidad-de-Usuarios)
- [Tablero de Jira](https://grupo4-practica1-software.atlassian.net/jira/software/projects/CHLS/boards/34/backlog)
- [Miro — Departamento de Comunidad de Usuarios](https://miro.com/app/board/uXjVHjhS2g4=/)
