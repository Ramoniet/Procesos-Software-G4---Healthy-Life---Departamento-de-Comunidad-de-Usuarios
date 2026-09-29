# Procesos-Software-G4
# Healthy-Life-Departamento-de-Comunidad-de-Usuarios

Módulo de interacción social y gamificación de la plataforma **Healthy Life**, desarrollado por el **Equipo 4** dentro de la asignatura *Procesos de Software* (3º Grado en Ingeniería del Software, URJC).

Healthy Life es una plataforma integrada de salud y bienestar construida entre todos los equipos de la clase. Cada equipo es propietario de un subsistema que se comunica con los demás a través de interfaces acordadas. Este repositorio contiene el subsistema de **comunidad de usuarios**, responsable de potenciar la retención mediante mecánicas colaborativas y sociales.

## Estado del proyecto

🚧 **Sprint 1 — Fundación del equipo y arranque del proyecto** (en curso)

| Sprint | Periodo | Estado |
|---|---|---|
| Sprint 1 | hasta 13/10 | En curso |
| Sprint 2 | — | Pendiente |
| Sprint 3 | — | Pendiente |

## Funcionalidades del módulo

- Creación, administración y unión a grupos comunitarios.
- Orquestador de retos colectivos con barras de progreso comunes.
- Sistema para compartir hitos, marcas personales y medallas.
- Feed de actividad e interacciones básicas entre usuarios.

## Alcance del Sprint 1

En este primer sprint se ha priorizado dejar cerrado el arranque del proyecto y un primer incremento funcional real, siguiendo las historias de usuario más sencillas y autocontenidas del Sprint Backlog.

**Historias de usuario implementadas en este sprint:**

- [ ] HU-XX — *(completar: título de la primera historia implementada)*
- [ ] HU-XX — *(completar: título de la segunda historia implementada, si aplica)*

> Detalle completo del backlog, criterios de aceptación y estimaciones en el tablero de Jira del equipo.

## Equipo

| Nombre | Rol en el Sprint 1 | Fortalezas |
|---|---|---|
| Jorge | Product Owner | Liderazgo, Python, resolutivo |
| Ramón | Equipo de desarrollo | Trabajo en equipo, creativo, organizado |
| Raúl | Equipo de desarrollo | Colaborativo, trabajador, responsable |
| Héctor | Equipo de desarrollo | Desarrollo web, trabajo en equipo, gestión |
| Daniel | Equipo de desarrollo | Manejo de IA, responsable, creativo |
| Javier | Scrum Master | Profesional, proactivo, experimentado |
| Lucille | Equipo de desarrollo | Eficaz, ciberseguridad, redes |


## Arquitectura y flujo

El diagrama de estructura y flujo de la aplicación (pantallas, servicios, base de datos e integraciones) está disponible en el tablero de Miro del equipo.

Resumen de componentes previstos:

- **Frontend:** interfaz de usuario para grupos, retos, hitos y feed.
- **Backend / API:** lógica de negocio y exposición de endpoints.
- **Base de datos:** persistencia de grupos, retos, hitos y actividad.
- **Integraciones externas:** interfaces con los módulos de otros equipos (E1 Gestión de usuarios, E2 Seguimiento de hábitos, E5 Rutinas, etc.), según los formatos acordados en la fase de interoperabilidad.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Backend | *(completar)* |
| Frontend | *(completar)* |
| Base de datos | *(completar)* |
| Contenedores | Docker |
| Gestión del proyecto | Jira |
| Diseño y dinámicas de equipo | Miro |

## Puesta en marcha

### Requisitos previos

- Docker y Docker Compose instalados.
- *(completar: versión de Node/Python/etc. si aplica)*

### Instalación y arranque

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd <nombre-del-repo>

# Levantar el entorno con Docker
docker compose up --build
```

La aplicación quedará disponible en `http://localhost:<puerto>` *(completar puerto)*.

### Variables de entorno

Copiar el archivo de ejemplo y completar los valores necesarios (nunca subir credenciales reales al repositorio):

```bash
cp .env.example .env
```

## Flujo de trabajo del equipo

- **Ramas:** `main` (estable) y una rama por historia de usuario o tarea (`feature/HU-XX-descripcion`).
- **Pull requests:** obligatorios para fusionar a `main`. Requieren revisión de, al menos, otro miembro del equipo antes de mergear.
- **Definition of Done** (aplica a todas las historias):
  - Código revisado mediante pull request por otro miembro del equipo.
  - Documentación (README/API) actualizada si la historia lo requiere.
  - Criterios de aceptación verificados por el delegado de Product Owner.
  - Sin secretos ni credenciales en el código fuente ni en el historial de commits.
  - *(a partir del Sprint 2: pruebas escritas y en verde en el pipeline de CI)*


## Enlaces del proyecto

- Tablero de Jira: (https://grupo4-practica1-software.atlassian.net/jira/software/projects/CHLS/summary?atlOrigin=eyJpIjoiMDAzODU0ZjFlOGY3NGQ3Y2IyMDMyNWRmNjAwMmQyNmMiLCJwIjoiaiJ9)
- Tablero de Miro (https://miro.com/welcomeonboard/U2pWek9IdVJxNFpHWCtwNG95MzE3VWhRdWJhVEVNQlZobkY2SDByM0g5NmlvcDFyN1haaVdKT2xrSUxoNWx4RTVJU1pTbHBHQ2dyQmRLUjVoR29EdVVCY0ZVUjREbmMwNENLc2plblFqT2lPOW5tSjJNRWo0SzNlYlh2b1hBZzVnbHpza3F6REdEcmNpNEFOMmJXWXBBPT0hdjE=?share_link_id=248626970100)

## Licencia

Proyecto académico desarrollado en el contexto de la asignatura Procesos de Software (URJC). Uso educativo.
