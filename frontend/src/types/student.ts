export type StudentArea = 'home' | 'tasks' | 'courses' | 'gamification' | 'community' | 'profile';

export type StudentProfile = {
  displayName: string;
  bio: string;
  role: 'aluno';
};

export type StudentTask = {
  id: string;
  title: string;
  subject: string;
  dueAt: string;
  status: 'pending' | 'completed';
};

export type StudentCourse = {
  id: string;
  title: string;
  description: string;
  completedLessons: number;
  totalLessons: number;
};

export type StudentHomeData = {
  student: StudentProfile;
  tasks: readonly StudentTask[];
  courses: readonly StudentCourse[];
  pointAwards: readonly { id: string; points: number; description: string }[];
  activities: readonly StudentActivity[];
};

export type StudentActivity = {
  id: string;
  occurredAt: string;
} & (
  | { kind: 'task'; taskId: string }
  | { kind: 'course'; courseId: string }
  | { kind: 'points'; awardId: string }
);
