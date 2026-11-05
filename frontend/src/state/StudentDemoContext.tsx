import { createContext, useContext, useState, type ReactNode } from 'react';
import { studentHomeMock } from '../data/studentHomeMock';
import type { StudentHomeData, StudentProfile } from '../types/student';

type DemoContext = {
  data: StudentHomeData;
  updateProfile: (profile: Pick<StudentProfile, 'displayName' | 'bio'>) => void;
};

const StudentDemoContext = createContext<DemoContext | undefined>(undefined);

// Montado apenas dentro da área demonstrativa. Sair desmonta e descarta os dados.
export function StudentDemoProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState(() => ({ ...studentHomeMock.student }));

  return (
    <StudentDemoContext.Provider value={{
      data: { ...studentHomeMock, student },
      updateProfile: (profile) => setStudent((current) => ({ ...current, ...profile })),
    }}>
      {children}
    </StudentDemoContext.Provider>
  );
}

export function useStudentDemo() {
  const context = useContext(StudentDemoContext);
  if (!context) throw new Error('A demonstração do aluno precisa de StudentDemoProvider.');
  return context;
}
