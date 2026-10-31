# HU-07 — Cómo probar retos dentro de comunidades

## Abrir la funcionalidad

1. Arranca `docker compose up -d --build dev` y visita http://localhost:5173/ .
2. Pulsa **Ver detalles** en **Vida Saludable y Nutrición** (`c1`).
3. En la página de esa comunidad, abre la pestaña **Retos**. Ahí aparecen los retos de esa comunidad (no los de otras).
4. El usuario inicial es **Daniel Marcos (`u1`)**, administrador y miembro de `c1`. Puedes crear retos aquí.

## Crear un reto colectivo

1. Pulsa **+ Crear reto colectivo**.
2. Introduce, por ejemplo: título `Reto 5 carreras`, descripción `Completar cinco carreras en equipo`, actividad **Carrera**, meta **5**.
3. Pulsa **Crear reto**. El reto debe mostrarse en la pestaña, inicialmente con progreso **0/5** y con el botón **Ya participas**: el creador queda inscrito automáticamente.
4. Recarga la página: el reto debe mantenerse en el navegador (almacenamiento `localStorage`).

## CHLS-59 — Unirse y evitar duplicados

1. En el selector de usuario `DEV`, cambia a **Ramón García (`u2`)**. Ramón también es miembro de `c1`.
2. En la tarjeta `Reto 5 carreras`, pulsa **Unirme al reto**.
3. El botón pasa a **Ya participas** y el contador debe pasar a **2 participantes**.
4. Cambia a **Laura Pérez (`u3`)**, que NO pertenece a `c1`: podrá ver los retos, pero no crearlos ni inscribirse. Debe solicitar acceso a la comunidad y ser aceptada por su administrador.

## CHLS-60 — Entrenamientos compatibles

1. Cambia de nuevo a **Daniel (`u1`)**, que participa en `Reto 5 carreras`.
2. En **Probar entrenamientos (simulador)**, registra **Carrera**, 30 minutos. El reto debe pasar de **0/5** a **1/5**.
3. Registra **Caminata**, 30 minutos. El progreso debe permanecer en **1/5**.
4. Cambia a Ramón (inscrito), registra **Carrera**, 45 minutos. El progreso colectivo debe pasar a **2/5**.
5. Un entrenamiento sincronizado dos veces con el mismo `id` solo cuenta una vez (`syncTraining` evita duplicados).
6. El reto de fuerza **Finalizado** en `c1` no permite inscripciones.

## Limitaciones conscientes del prototipo

- Los retos, inscripciones y entrenamientos se guardan en `localStorage` **solo en este navegador**, incluso al recargar. No son datos compartidos con otros dispositivos o usuarios reales.
- Cada entrenamiento compatible y posterior a la inscripción suma **una sesión**. No se suman minutos ni kilómetros.
- El simulador NO es el módulo real de Entrenamientos: hace falta integrar su API y una base de datos en un sprint posterior.
- Para resetear los datos de HU-07, abre las herramientas del navegador > Application / Almacenamiento local > `http://localhost:5173` y elimina exclusivamente las claves que empiezan por `healthy-life:hu07:`.
