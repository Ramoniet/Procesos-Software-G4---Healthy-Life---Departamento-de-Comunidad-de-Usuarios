import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';
import { test } from 'node:test';
import ts from 'typescript';

// Ejecuta el código real con estado de hooks y localStorage simulados.
// Comprueba lógica y árboles de elementos; no sustituye una prueba en navegador.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fixedNow = new Date(2026, 10, 2, 12).getTime();
const validDetails = {
  title: 'Reto de carreras', description: 'Completar carreras entre todos',
  activityTypes: ['running'], target: 5, deadline: '2026-11-03',
};
const compiled = new Map();

function harness() {
  const modules = new Map();
  const states = new Map();
  const storage = new Map();
  let hooks;
  let cursor;
  let effects;
  class FixedDate extends Date {
    constructor(...args) { super(...(args.length ? args : [fixedNow])); }
    static now() { return fixedNow; }
  }
  const react = {
    createContext(value) {
      const context = { value };
      context.Provider = { context };
      return context;
    },
    useContext: (context) => context.value,
    useState(initial) {
      const slots = hooks;
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
      return [slots[index], (next) => {
        slots[index] = typeof next === 'function' ? next(slots[index]) : next;
      }];
    },
    useEffect: (effect) => effects.push(effect),
  };
  const jsx = (type, props) => ({ type, props });
  function load(filename) {
    if (modules.has(filename)) return modules.get(filename).exports;
    const module = { exports: {} };
    modules.set(filename, module);
    if (filename.endsWith('.json')) {
      module.exports = JSON.parse(readFileSync(filename, 'utf8'));
      return module.exports;
    }
    if (!compiled.has(filename)) {
      compiled.set(filename, ts.transpileModule(readFileSync(filename, 'utf8'), {
        fileName: filename,
        compilerOptions: {
          module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2023,
          jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
        },
      }).outputText);
    }
    const require = (specifier) => {
      if (specifier === 'react') return react;
      if (specifier === 'react/jsx-runtime') return { jsx, jsxs: jsx };
      if (specifier === 'react-router-dom') return { Link: 'a' };
      assert.ok(specifier.startsWith('.'), `Import no previsto: ${specifier}`);
      return load(resolve(dirname(filename), specifier));
    };
    new Script(`(function(require, module, exports) { ${compiled.get(filename)}\n})`, {
      filename,
    }).runInNewContext({
      Date: FixedDate,
      window: { localStorage: {
        getItem: (key) => storage.get(key) ?? null,
        setItem: (key, value) => storage.set(key, value),
      } },
    })(require, module, module.exports);
    return module.exports;
  }
  function render(path, name, props = {}) {
    const key = `${path}:${name}`;
    if (!states.has(key)) states.set(key, []);
    hooks = states.get(key);
    cursor = 0;
    effects = [];
    const tree = load(resolve(root, path))[name](props);
    if (tree?.type?.context) tree.type.context.value = tree.props.value;
    effects.forEach((effect) => effect());
    return tree;
  }
  const api = () => render('src/app/AppContext.tsx', 'AppProvider').props.value;
  api();
  return {
    api, render, storage,
    load: (path) => load(resolve(root, path)),
    as(userId) { api().switchUser(userId); return api(); },
  };
}

function elements(tree, predicate) {
  if (Array.isArray(tree)) return tree.flatMap((item) => elements(item, predicate));
  if (!tree || typeof tree !== 'object') return [];
  return [...(predicate(tree) ? [tree] : []), ...elements(tree.props?.children, predicate)];
}

test('El administrador local crea un reto activo, con fecha e inscripción automática', () => {
  const h = harness();
  assert.equal(h.api().currentUser.role, 'admin'); // El permiso depende de adminId.
  assert.equal(h.api().createChallenge('c1', { ...validDetails, title: '  Reto de carreras  ' }), true);
  const { challenges, challengeParticipations } = h.api();
  const challenge = challenges[0];
  assert.equal(challenge.title, validDetails.title);
  assert.equal(challenge.status, 'active');
  assert.equal(challenge.deadline, validDetails.deadline);
  assert.equal(challenge.communityId, 'c1');
  assert.equal(challengeParticipations.filter((p) => p.challengeId === challenge.id && p.userId === 'u1').length, 1);
  const persisted = JSON.parse(h.storage.get('healthy-life:hu07:challenges:v1'));
  assert.equal(persisted[0].deadline, validDetails.deadline);
});

test('La llamada directa rechaza miembros, administradores ajenos y no miembros sin efectos', () => {
  const h = harness();
  for (const [user, community] of [['u3', 'c2'], ['u2', 'c1'], ['u1', 'c2'], ['u4', 'c1'], ['u1', 'inexistente']]) {
    const before = h.as(user);
    assert.equal(before.createChallenge(community, validDetails), false);
    const after = h.api();
    assert.equal(after.challenges.length, before.challenges.length);
    assert.equal(after.challengeParticipations.length, before.challengeParticipations.length);
  }
  assert.equal(h.as('u4').createChallenge('c1', null), false); // Permisos antes de leer detalles.
});

test('La lógica rechaza fechas vacías, inválidas, inexistentes, pasadas y de hoy', () => {
  const h = harness();
  for (const deadline of ['', undefined, null, 'incorrecta', '2026-11-02', '2026-11-01', '2026-11-31', '2027-02-29', '2026-13-01', '2026-11-00', '0000-12-01', '2026-11-03\n', '2026-11-03T12:00:00Z']) {
    assert.equal(h.api().createChallenge('c1', { ...validDetails, deadline }), false, String(deadline));
  }
  assert.equal(h.api().challenges.length, 3);
});

test('Fechas reales, años bisiestos, medianoche local y cambio de año', () => {
  const { isFutureChallengeDeadline, getMinChallengeDeadline } = harness().load('src/utils/challengeDeadline.ts');
  for (const now of [new Date(2026, 10, 2, 0, 5), new Date(2026, 10, 2, 23, 55)]) {
    assert.equal(isFutureChallengeDeadline('2026-11-02', now), false);
    assert.equal(isFutureChallengeDeadline('2026-11-03', now), true);
    assert.equal(getMinChallengeDeadline(now), '2026-11-03');
  }
  assert.equal(isFutureChallengeDeadline('2028-02-29', new Date(2028, 1, 28)), true);
  assert.equal(isFutureChallengeDeadline('2027-02-29', new Date(2027, 1, 28)), false);
  assert.equal(getMinChallengeDeadline(new Date(2026, 11, 31, 23, 55)), '2027-01-01');
});

test('Se conservan las validaciones de meta, textos y catálogo', () => {
  const h = harness();
  for (const target of [0, -1, 1.5, 501, NaN, Infinity]) {
    assert.equal(h.api().createChallenge('c1', { ...validDetails, target }), false);
  }
  for (const details of [
    { title: 'ab' }, { title: 'a'.repeat(81) },
    { description: 'corta' }, { description: 'a'.repeat(301) },
    { activityTypes: [] }, { activityTypes: ['swimming'] }, { activityTypes: ['running', 'walking'] },
  ]) assert.equal(h.api().createChallenge('c1', { ...validDetails, ...details }), false);
  for (const target of [1, 500]) assert.equal(h.api().createChallenge('c1', { ...validDetails, target }), true);
  for (const activity of ['running', 'cycling', 'walking', 'strength']) {
    assert.equal(h.api().createChallenge('c1', { ...validDetails, activityTypes: [activity] }), true);
  }
});

test('HU-07 conserva inscripción única, sincronización idempotente y progreso por sesiones', () => {
  const h = harness();
  const { getCountedTrainings } = h.load('src/utils/challengeProgress.ts');
  h.api().createChallenge('c1', validDetails);
  const challenge = h.api().challenges[0];
  h.as('u2').joinChallenge(challenge.id);
  h.api().joinChallenge(challenge.id);
  assert.equal(h.api().challengeParticipations.filter((p) => p.challengeId === challenge.id).length, 2);
  h.as('u3').joinChallenge(challenge.id); // No pertenece a c1.
  assert.equal(h.api().challengeParticipations.filter((p) => p.challengeId === challenge.id).length, 2);
  const training = { id: 'hu06-training', userId: 'u1', activityType: 'running', activityDate: new Date(fixedNow + 1000).toISOString(), durationMinutes: 30 };
  h.api().syncTraining(training);
  h.api().syncTraining(training);
  assert.equal(h.api().trainings.filter((t) => t.id === training.id).length, 1);
  h.api().syncTraining({ ...training, id: 'antes', activityDate: new Date(fixedNow - 1000).toISOString() });
  h.api().syncTraining({ ...training, id: 'incompatible', activityType: 'walking' });
  h.api().syncTraining({ ...training, id: 'sin-inscripcion', userId: 'u4' });
  h.as('u2').registerTraining({ activityType: 'running', activityDate: training.activityDate, durationMinutes: 45 });
  const state = h.api();
  assert.equal(getCountedTrainings(challenge, state.challengeParticipations, state.trainings).length, 2);
});

test('Los retos antiguos sin fecha siguen admitiendo inscripción y calculando progreso', () => {
  const h = harness();
  const { getCountedTrainings } = h.load('src/utils/challengeProgress.ts');
  const state = h.api();
  const legacy = state.challenges.find((c) => c.id === 'ch1');
  assert.equal(legacy.deadline, undefined);
  assert.equal(getCountedTrainings(legacy, state.challengeParticipations, state.trainings).length, 1);
  h.as('u3').joinChallenge('ch1');
  assert.ok(h.api().challengeParticipations.some((p) => p.challengeId === 'ch1' && p.userId === 'u3'));
  h.as('u1').joinChallenge('ch3'); // Finalizado.
  assert.equal(h.api().challengeParticipations.some((p) => p.challengeId === 'ch3' && p.userId === 'u1'), false);
});

test('La interfaz ofrece creación solo al administrador y conserva el simulador para miembros', () => {
  const h = harness();
  const render = () => h.render('src/components/CommunityChallenges.tsx', 'CommunityChallenges', { communityId: 'c1' });
  const createButtons = (tree) => elements(tree, (e) => e.type === 'button' && e.props.children === '+ Crear reto colectivo');
  const adminTree = render();
  assert.equal(createButtons(adminTree).length, 1);
  createButtons(adminTree)[0].props.onClick();
  assert.equal(elements(render(), (e) => e.type?.name === 'CreateChallengeForm').length, 1);
  h.as('u2');
  const memberTree = render();
  assert.equal(createButtons(memberTree).length, 0);
  assert.equal(elements(memberTree, (e) => e.type?.name === 'CreateChallengeForm').length, 0);
  assert.equal(elements(memberTree, (e) => e.type?.name === 'TrainingSimulator').length, 1);
});

test('El formulario muestra errores y envía la fecha al crear', () => {
  const h = harness();
  const received = [];
  let closed = false;
  const props = { onCreate: (details) => { received.push(details); return true; }, onClose: () => { closed = true; } };
  const render = () => h.render('src/components/CreateChallengeForm.tsx', 'CreateChallengeForm', props);
  const field = (predicate) => elements(render(), predicate)[0];
  const set = (predicate, value) => field(predicate).props.onChange({ target: { value } });
  set((e) => e.type === 'input' && !e.props.type, validDetails.title);
  set((e) => e.type === 'textarea', validDetails.description);
  const submit = () => field((e) => e.type === 'form').props.onSubmit({ preventDefault() {} });
  const error = () => field((e) => e.props?.role === 'alert')?.props.children;
  assert.equal(field((e) => e.props?.type === 'date').props.required, true);
  assert.equal(field((e) => e.props?.type === 'date').props.min, '2026-11-03');
  submit();
  assert.match(error(), /Selecciona una fecha límite/);
  for (const deadline of ['2026-11-02', '2026-11-01', '2026-11-31']) {
    set((e) => e.props?.type === 'date', deadline);
    submit();
    assert.match(error(), /fecha válida posterior a hoy/);
  }
  set((e) => e.props?.type === 'date', validDetails.deadline);
  set((e) => e.props?.type === 'number', '0');
  submit();
  assert.match(error(), /número entero entre 1 y 500/);
  assert.equal(received.length, 0);
  set((e) => e.props?.type === 'number', '5');
  submit();
  assert.equal(received.length, 1);
  assert.equal(received[0].deadline, validDetails.deadline);
  assert.equal(closed, true);
  props.onCreate = () => false;
  submit();
  assert.match(error(), /administrador de esta comunidad/);
});

test('Las tarjetas muestran la fecha solo cuando existe', () => {
  const h = harness();
  const render = (challenge) => h.render('src/components/ChallengeCard.tsx', 'ChallengeCard', { challenge });
  const legacy = h.api().challenges[0];
  assert.equal(elements(render(legacy), (e) => e.type === 'time').length, 0);
  const times = elements(render({ ...legacy, deadline: validDetails.deadline }), (e) => e.type === 'time');
  assert.equal(times.length, 1);
  assert.equal(times[0].props.dateTime, validDetails.deadline);
  assert.equal(times[0].props.children, '3/11/2026');
});
