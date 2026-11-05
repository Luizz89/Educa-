import type { StudentCourse, StudentHomeData, StudentTask } from '../types/student';

// Exemplos fixos para apresentação, sem sessão, persistência ou chamadas à API.
export const studentHomeMock: StudentHomeData = {
  student: {
    displayName: 'Ana Oliveira',
    bio: 'Um passo de cada vez, aprendendo todos os dias.',
    role: 'aluno',
  },
  tasks: [
    {
      id: 'task-algorithms',
      title: 'Resolver exercícios de lógica',
      subject: 'Lógica de programação',
      dueAt: '2026-11-06T18:00:00-03:00',
      status: 'pending',
    },
    {
      id: 'task-cloud',
      title: 'Revisar os conceitos de nuvem',
      subject: 'Introdução à computação em nuvem',
      dueAt: '2026-11-07T20:00:00-03:00',
      status: 'pending',
    },
    {
      id: 'task-study-plan',
      title: 'Organizar o plano de estudos',
      subject: 'Organização acadêmica',
      dueAt: '2026-11-04T12:00:00-03:00',
      status: 'completed',
    },
  ],
  courses: [
    {
      id: 'course-logic',
      title: 'Lógica de programação',
      description: 'Desenvolva seu raciocínio, um exercício de cada vez.',
      completedLessons: 4,
      totalLessons: 10,
    },
    {
      id: 'course-cloud',
      title: 'Introdução à computação em nuvem',
      description: 'Conheça os fundamentos da nuvem.',
      completedLessons: 1,
      totalLessons: 8,
    },
  ],
  pointAwards: [
    { id: 'award-welcome', points: 20, description: 'Boas-vindas ao Educa+' },
    { id: 'award-lessons', points: 100, description: 'Avanço nas aulas de exemplo' },
    { id: 'award-study-plan', points: 60, description: 'Organização do plano de estudos' },
  ],
  activities: [
    { id: 'activity-plan', kind: 'task', taskId: 'task-study-plan', occurredAt: '2026-11-04T12:00:00-03:00' },
    { id: 'activity-course', kind: 'course', courseId: 'course-logic', occurredAt: '2026-11-04T11:40:00-03:00' },
    { id: 'activity-points', kind: 'points', awardId: 'award-study-plan', occurredAt: '2026-11-04T12:01:00-03:00' },
  ],
};

// Calculados a partir da mesma fonte exibida na tela, inclusive no estado vazio.
export function getStudentHomeSummary(data: StudentHomeData) {
  const completedLessons = data.courses.reduce((sum, course) => sum + course.completedLessons, 0);
  const totalLessons = data.courses.reduce((sum, course) => sum + course.totalLessons, 0);
  return {
    pendingTasks: data.tasks.filter((task) => task.status === 'pending').length,
    completedTasks: data.tasks.filter((task) => task.status === 'completed').length,
    activeCourses: data.courses.filter(
      (course) => course.completedLessons > 0 && course.completedLessons < course.totalLessons,
    ).length,
    points: data.pointAwards.reduce((total, award) => total + award.points, 0),
    completedLessons,
    totalLessons,
    studyProgress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
  };
}

export function getCourseProgress(course: StudentCourse) {
  return course.totalLessons > 0
    ? Math.max(0, Math.min(100, Math.round((course.completedLessons / course.totalLessons) * 100)))
    : 0;
}

export function getUpcomingTasks(tasks: readonly StudentTask[]) {
  return [...tasks].sort((a, b) => {
    const statusOrder = Number(a.status === 'completed') - Number(b.status === 'completed');
    return statusOrder || Date.parse(a.dueAt) - Date.parse(b.dueAt);
  }).slice(0, 3);
}

// Os exemplos usam datas fixas. Não são prazos reais nem rótulos relativos a "hoje".
export function formatStudentDate(date: string, includeTime = true) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: 'short',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } as const : {}),
    timeZone: 'America/Recife',
  }).format(new Date(date));
}

export function getStudentActivityEntries(data: StudentHomeData) {
  return [...data.activities]
    .sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt))
    .flatMap((activity) => {
      let title: string;
      let detail: string;
      if (activity.kind === 'task') {
        const task = data.tasks.find((item) => item.id === activity.taskId && item.status === 'completed');
        if (!task) return [];
        title = 'Tarefa concluída';
        detail = task.title;
      } else if (activity.kind === 'course') {
        const course = data.courses.find((item) => item.id === activity.courseId);
        if (!course) return [];
        title = 'Aprendizado em andamento';
        detail = `${course.title} • ${course.completedLessons} de ${course.totalLessons} aulas`;
      } else {
        const award = data.pointAwards.find((item) => item.id === activity.awardId);
        if (!award) return [];
        title = `+${award.points} pontos conquistados`;
        detail = award.description;
      }
      return [{ id: activity.id, kind: activity.kind, title, detail, date: formatStudentDate(activity.occurredAt) }];
    }).slice(0, 3);
}
