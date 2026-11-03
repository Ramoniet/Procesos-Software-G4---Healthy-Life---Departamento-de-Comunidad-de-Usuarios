# HU-06 — Definir un nuevo reto colectivo (Admin)

## Criterio de aceptación y reglas

Dado un administrador de una comunidad, cuando selecciona una actividad del catálogo, introduce una meta entera positiva válida y una fecha real posterior al día actual, se publica un reto en estado `active`.

- El administrador se identifica por `community.adminId`, no por el rol global del usuario. Se conserva la comprobación de pertenencia a la comunidad.
- Nombre: 3–80 caracteres después de quitar espacios exteriores. Descripción: 10–300.
- Catálogo: Carrera (`running`), Ciclismo (`cycling`), Caminata (`walking`) y Fuerza (`strength`); una actividad por nuevo reto.
- Métrica: sesiones compatibles. Meta entera de 1 a 500, manteniendo los límites existentes.
- Fecha: obligatoria en nuevas creaciones, formato `YYYY-MM-DD`, día real estrictamente posterior a hoy en el calendario local. Hoy se rechaza incluso antes de medianoche.
- El creador queda inscrito automáticamente. La fecha se guarda y se muestra en la tarjeta.
- Los retos antiguos sin fecha siguen funcionando. No se cambian claves de almacenamiento ni se eliminan datos anteriores.
- No se añade cierre automático por vencimiento ni se cambia el cálculo del progreso de HU-07.

## Preparación y defecto previo

- Rama de trabajo: `feature/HU-06-crear-reto-admin`.
- Base tras `git fetch origin` y actualización por fast-forward: `20ca56fc4ea04335eb910561acd3347c1f6b39b6`.
- `npm ci`: completado, sin añadir dependencias ni modificar el lockfile.
- Antes de implementar, `npm run build` falló con `TS1005: '}' expected` en `AppContext.tsx`; lint también detectó el cierre ausente.
- Se añadió únicamente el cierre de `registerTraining` antes del bloque HU-20. Después, la compilación pasó. Las funciones de amistad conservan su contenido.

## Pruebas automatizadas ejecutadas

El repositorio no tenía un script de pruebas configurado. Se añade `scripts/test-hu06.mjs`, ejecutable con el runner nativo de Node y la dependencia TypeScript existente. No se modifica `package.json` ni se instala un framework.

El script transpila y ejecuta los módulos reales. Simula el estado de los hooks, el contexto y `localStorage`, y examina los elementos generados por los componentes. Las llamadas a `createChallenge`, `joinChallenge`, `syncTraining`, `registerTraining` y el cálculo de progreso ejecutan sus implementaciones reales. Los eventos de formulario se invocan de forma programática.

**Límite:** estos resultados no verifican el DOM real, el ciclo de React en el navegador, el selector nativo de fechas, la apariencia ni la persistencia tras una recarga real. Esas comprobaciones siguen pendientes.

Las pruebas fijan el reloj en el **2 de noviembre de 2026 a las 12:00 locales** para que los resultados sean reproducibles. La aplicación usa la fecha real en ejecución.

| Caso | Comprobación verificable | Resultado |
|---|---|---|
| 1. Administrador local | `u1` crea en `c1` aunque su rol global sea `user`; retorno `true`, título normalizado, estado `active`, fecha guardada e inscripción única del creador. El almacenamiento simulado contiene la fecha. | Pasa |
| 2. Llamadas directas sin permisos | `u3` en `c2` (miembro normal), `u2` en `c1` (miembro y administrador de otra comunidad), `u1` en `c2`, `u4` en `c1` y comunidad inexistente: retorno `false`, sin nuevos retos ni participaciones. | Pasa |
| 3. Fechas rechazadas | Vacía, ausente, `null`, texto incorrecto, hoy, ayer, `2026-11-31`, `2027-02-29`, mes 13, día 0, año 0, salto de línea final y fecha con hora: rechazo desde la lógica. | Pasa |
| 4. Calendario local | Mañana aceptado; hoy rechazado a las 00:05 y 23:55; bisiesto válido aceptado e inválido rechazado; fecha mínima correcta al cambiar de año. | Pasa |
| 5. Validaciones conservadas | Metas 0, negativa, decimal, 501, `NaN` e infinito rechazadas; 1 y 500 aceptadas. Textos fuera de longitud y actividades vacías, múltiples o fuera del catálogo rechazados. Las cuatro actividades válidas se aceptan. | Pasa |
| 6. Regresión HU-07 | Inscripción única; no miembro rechazado; sincronizar dos veces un mismo ID no duplica; entrenamientos anteriores a la inscripción, incompatibles o de no inscritos no suman. Una sesión de cada participante produce progreso 2. | Pasa |
| 7. Retos antiguos | `ch1` sin fecha conserva progreso inicial de una sesión y admite inscripción de un miembro. El reto finalizado `ch3` rechaza inscripción. | Pasa |
| 8. Permisos de interfaz | El árbol de elementos ofrece botón y formulario al administrador; al cambiar a un miembro oculta ambos y conserva el simulador. | Pasa |
| 9. Formulario | Campo de fecha obligatorio con mínimo mañana; errores claros por fecha vacía, inválida, pasada o de hoy y meta inválida. Una entrada válida envía la fecha y cierra el formulario; rechazo de negocio muestra mensaje de permisos/fecha. | Pasa |
| 10. Tarjetas | La tarjeta antigua no genera fecha; una tarjeta con fecha genera `time` con `dateTime="2026-11-03"` y texto local `3/11/2026`. | Pasa |

Comandos ejecutados desde la raíz:

```bash
TZ=Europe/Madrid node --test scripts/test-hu06.mjs
TZ=America/Los_Angeles node --test scripts/test-hu06.mjs
TZ=Asia/Tokyo node --test scripts/test-hu06.mjs
```

Resultado: **10 pruebas aprobadas, 0 fallos en cada zona** (30 ejecuciones de casos). Las zonas a ambos lados de UTC ayudan a detectar desplazamientos de día.

## Compilación y lint finales

| Comando | Resultado |
|---|---|
| `npm run build` | Código 0; TypeScript y Vite completan la compilación. |
| `npm run lint` | Código 0; sin errores y con cuatro advertencias previas. |
| `git diff --check` | Sin errores de espacios. |

Advertencias conservadas: `react/set-state-in-effect` en `CommunityList.tsx`, `react/purity` en `Footer.tsx` y `react/only-export-components` en `ChallengeCard.tsx` y `AppContext.tsx`. También aparecieron después de corregir únicamente el cierre sintáctico, antes de implementar HU-06. No se han realizado correcciones ajenas a la historia.

## Comprobaciones manuales pendientes

El navegador de pruebas no estaba disponible en esta sesión. No se han ejecutado los pasos siguientes ni se afirma una validación visual o de extremo a extremo.

Desde VS Code, abrir la carpeta del proyecto y comprobar que la rama activa es `feature/HU-06-crear-reto-admin`. Abrir **Terminal → Nuevo terminal** y ejecutar:

```bash
npm run dev
```

Abrir en el navegador la URL que muestre Vite mediante Ctrl/Cmd + clic. Usar la misma URL y sesión de navegador durante todos los pasos, incluida la recarga; no borrar las claves de almacenamiento de otros trabajos.

Para M7, abrir las herramientas de desarrollo del navegador y activar la emulación de dispositivo. Probar, por ejemplo, 375 × 480 y 667 × 375 píxeles, también mostrando un error de validación. El diálogo limita su altura a `calc(100dvh - 2rem)` y permite desplazamiento vertical interior. Comprobar que se alcanzan todos los campos y los botones de cancelar y crear. Este ajuste está implementado, pero la comprobación visual continúa pendiente.

| Paso | Acción | Resultado esperado | Estado |
|---|---|---|---|
| M1 | Con Daniel (`u1`), abrir `c1` → Retos → Crear reto. Introducir nombre `Reto HU-06`, descripción `Completar cinco carreras entre todos`, Carrera, meta 5 y mañana según el calendario local. | Aparece activo, 0/5 sesiones, fecha elegida y botón «Ya participas». | Pendiente |
| M2 | Intentar enviar con fecha vacía, de hoy o pasada; probar metas 0, 1.5 y 501. | Mensaje claro y ningún reto nuevo. Las fechas inexistentes pueden ser descartadas por el propio control nativo; su rechazo de negocio ya está automatizado. | Pendiente |
| M3 | Cambiar a Ramón (`u2`) dentro de `c1`, y a Laura (`u3`) dentro de `c2`. | No aparece creación en ninguno de los dos casos. Ramón administra `c2`, pero no `c1`. | Pendiente |
| M4 | Recargar después de M1. | Se conserva el reto, la fecha y la participación del creador con las claves actuales de `localStorage`. | Pendiente |
| M5 | En el reto de M1, inscribir a Ramón y repetir el intento. Registrar Carrera con Daniel y Ramón; registrar también Caminata. | Inscripción única; las dos carreras suman dos sesiones colectivas y Caminata no suma. | Pendiente |
| M6 | Revisar retos antiguos y, si ya existen en este navegador, datos guardados antes de HU-06. | Se muestran sin fecha y conservan participaciones y progreso. | Pendiente |
| M7 | Revisar escritorio y móvil, selector de fecha, mensajes y cambio de usuario con el formulario abierto. | Campos accesibles y legibles, diseño coherente y formulario oculto al perder permisos. | Pendiente |

`docs/HU-07-pruebas.md` se conserva sin cambios. Su procedimiento de creación es anterior a la fecha obligatoria; para creación y permisos vigentes se utiliza este documento. Sus escenarios de inscripción y progreso siguen siendo aplicables.
