const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Exercita os módulos reais de lógica sem precisar de emulador ou framework extra.
global.__DEV__ = true;
function createLoader() {
  const cache = new Map();
  function load(file) {
    const absolute = path.resolve(__dirname, '..', file);
    if (cache.has(absolute)) return cache.get(absolute).exports;
    const module = { exports: {} };
    cache.set(absolute, module);
    const source = fs.readFileSync(absolute, 'utf8');
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
    const localRequire = name => name.startsWith('.')
      ? load(path.relative(path.resolve(__dirname, '..'), path.resolve(path.dirname(absolute), name + '.ts')))
      : require(name);
    new Function('exports', 'require', 'module', code)(module.exports, localRequire, module);
    return module.exports;
  }
  return load;
}
const load = createLoader();
const { studentHomeMock, getStudentHomeSummary, getCourseProgress, getUpcomingTasks, getStudentActivityEntries, formatStudentDate } = load('src/data/studentHomeMock.ts');
const { validateStudentProfile, getStudentInitials } = load('src/utils/studentProfile.ts');
const { signInDemo, demoCredentials } = load('src/services/demoAuthService.ts');
const { authService, InvalidCredentialsError } = load('src/services/authService.ts');

test('Home e Perfil partem dos mesmos totais, sem contadores independentes', () => {
  assert.deepEqual(getStudentHomeSummary(studentHomeMock), {
    pendingTasks: 2, completedTasks: 1, activeCourses: 2, points: 180,
    completedLessons: 5, totalLessons: 18, studyProgress: 28,
  });
});

test('Massa vazia produz indicadores zerados e histórico vazio', () => {
  const empty = { ...studentHomeMock, tasks: [], courses: [], pointAwards: [], activities: [] };
  assert.ok(Object.values(getStudentHomeSummary(empty)).every(value => value === 0));
  assert.deepEqual(getStudentActivityEntries(empty), []);
  assert.deepEqual(getUpcomingTasks([]), []);
});

test('Tarefas pendentes são priorizadas por data real, inclusive na virada do ano', () => {
  const prototype = studentHomeMock.tasks[0];
  const tasks = [
    { ...prototype, id: 'later', dueAt: '2027-01-02T18:00:00-03:00' },
    { ...prototype, id: 'done', status: 'completed', dueAt: '2026-11-01T18:00:00-03:00' },
    { ...prototype, id: 'first', dueAt: '2026-12-30T18:00:00-03:00' },
    { ...prototype, id: 'second', dueAt: '2027-01-01T18:00:00-03:00' },
  ];
  const before = JSON.stringify(tasks);
  assert.deepEqual(getUpcomingTasks(tasks).map(task => task.id), ['first', 'second', 'later']);
  assert.equal(JSON.stringify(tasks), before);
});

test('Cursos não iniciados ou concluídos deixam de contar como em andamento', () => {
  const courses = studentHomeMock.courses.map((course, index) => ({ ...course, completedLessons: index ? 0 : course.totalLessons }));
  assert.equal(getStudentHomeSummary({ ...studentHomeMock, courses }).activeCourses, 0);
});

test('Barras de progresso evitam NaN, negativos e valores acima de 100%', () => {
  const course = studentHomeMock.courses[0];
  assert.equal(getCourseProgress(course), 40);
  assert.equal(getCourseProgress({ ...course, totalLessons: 0, completedLessons: 0 }), 0);
  assert.equal(getCourseProgress({ ...course, completedLessons: -2 }), 0);
  assert.equal(getCourseProgress({ ...course, completedLessons: 20 }), 100);
});

test('Histórico deriva títulos e valores das tarefas, cursos e pontuação', () => {
  const changed = {
    ...studentHomeMock,
    courses: studentHomeMock.courses.map(course => ({ ...course, completedLessons: 6 })),
    pointAwards: studentHomeMock.pointAwards.map(award => ({ ...award, points: 15 })),
  };
  const entries = getStudentActivityEntries(changed);
  assert.equal(entries.length, 3);
  assert.ok(entries.some(entry => entry.title === '+15 pontos conquistados'));
  assert.ok(entries.some(entry => entry.detail.includes('6 de 10 aulas')));
  assert.ok(entries.some(entry => entry.detail === 'Organizar o plano de estudos'));
});

test('Datas de exemplo usam português e o fuso informado no dado', () => {
  const value = formatStudentDate('2026-11-06T18:00:00-03:00');
  assert.match(value, /06/); assert.match(value, /nov/); assert.match(value, /18:00/);
});

test('Edição valida nome obrigatório e limites sem exigir descrição opcional', () => {
  assert.ok(validateStudentProfile('   ', '').displayName);
  assert.ok(validateStudentProfile('A', '').displayName);
  assert.ok(validateStudentProfile('A'.repeat(61), '').displayName);
  assert.ok(validateStudentProfile('Ana', 'x'.repeat(161)).bio);
  assert.deepEqual(validateStudentProfile(' Ana Oliveira ', ''), { displayName: undefined, bio: undefined });
  assert.equal(getStudentInitials('  Ana  Oliveira '), 'AO');
});

test('Login demonstrativo aceita somente as credenciais publicadas', async () => {
  await signInDemo({ email: ' ALUNO@EDUCAMAIS.EXAMPLE ', password: demoCredentials.password });
  await assert.rejects(signInDemo({ email: demoCredentials.email, password: 'senha-errada' }), InvalidCredentialsError);
  await assert.rejects(signInDemo({ email: 'outro@example.com', password: demoCredentials.password }), InvalidCredentialsError);
});

test('Credenciais demonstrativas não autenticam no serviço real', async () => {
  await assert.rejects(authService.signIn(demoCredentials), /AUTH_NOT_CONFIGURED/);
});

test('Produção não expõe credenciais e recusa qualquer acesso demonstrativo', async () => {
  global.__DEV__ = false;
  try {
    const production = createLoader()('src/services/demoAuthService.ts');
    assert.equal(production.demoCredentials, undefined);
    await assert.rejects(production.signInDemo(demoCredentials), /DEMO_UNAVAILABLE/);
    await assert.rejects(signInDemo(demoCredentials), /DEMO_UNAVAILABLE/);
  } finally { global.__DEV__ = true; }
});
