import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { StudentCoursePreview } from '../components/student/StudentCoursePreview';
import { StudentProgressCard } from '../components/student/StudentProgressCard';
import { StudentQuickAccess } from '../components/student/StudentQuickAccess';
import { StudentShell } from '../components/student/StudentShell';
import { StudentSummaryCard } from '../components/student/StudentSummaryCard';
import { StudentTaskPreview } from '../components/student/StudentTaskPreview';
import { getStudentHomeSummary } from '../data/studentHomeMock';
import { useStudentDemo } from '../state/StudentDemoContext';
import { colors, fonts } from '../theme';
import { getStudentInitials } from '../utils/studentProfile';

export function StudentHomeScreen() {
  const { data } = useStudentDemo();
  const { width, fontScale } = useWindowDimensions();
  const wide = width >= 840 && fontScale <= 1.3;
  const summary = getStudentHomeSummary(data);
  const courses = data.courses.filter((course) => course.completedLessons > 0 && course.completedLessons < course.totalLessons);
  const firstName = data.student.displayName.trim().split(/\s+/)[0];

  return (
    <StudentShell active="home">
      {({ selectArea }) => (
        <>
          <View style={styles.greeting}>
            <View style={styles.flex}>
              <Text style={styles.hello}>Olá, {firstName}!</Text>
              <Text style={styles.title} accessibilityRole="header">Vamos estudar?</Text>
              <Text style={styles.subtitle}>Seu próximo passo começa por aqui.</Text>
            </View>
            <Pressable onPress={() => selectArea('profile')} accessibilityRole="button" accessibilityLabel="Abrir perfil do aluno" style={styles.avatar}>
              <Text style={styles.initials}>{getStudentInitials(data.student.displayName)}</Text>
            </Pressable>
          </View>

          <StudentProgressCard summary={summary} onAchievements={() => selectArea('gamification')} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle} accessibilityRole="header">Seu resumo</Text>
            <View style={styles.summary}>
              <StudentSummaryCard icon="checkbox-outline" value={summary.pendingTasks} label="Tarefas pendentes" />
              <StudentSummaryCard icon="book-outline" value={summary.activeCourses} label="Cursos em andamento" />
              <StudentSummaryCard icon="trophy-outline" value={summary.points} label="Pontos conquistados" />
            </View>
          </View>

          <View style={[styles.learning, wide && styles.learningWide]}>
            <View style={[styles.column, wide && styles.wideColumn]}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle} accessibilityRole="header">Próximas tarefas</Text>
                <Pressable onPress={() => selectArea('tasks')} accessibilityRole="button" accessibilityLabel="Ver todas as tarefas" style={styles.sectionAction}>
                  <Text style={styles.link}>Ver todas</Text>
                  <Ionicons name="arrow-forward-outline" size={15} color={colors.primary} accessible={false} />
                </Pressable>
              </View>
              <StudentTaskPreview tasks={data.tasks} />
            </View>
            <View style={[styles.column, wide && styles.wideColumn]}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle} accessibilityRole="header">Cursos em andamento</Text>
                <Pressable onPress={() => selectArea('courses')} accessibilityRole="button" accessibilityLabel="Ver cursos" style={styles.sectionAction}>
                  <Text style={styles.link}>Ver cursos</Text>
                </Pressable>
              </View>
              {courses.length > 0 ? courses.slice(0, 2).map((course) => (
                <StudentCoursePreview key={course.id} course={course} onContinue={() => selectArea('courses')} />
              )) : <StudentCoursePreview onContinue={() => selectArea('courses')} />}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle} accessibilityRole="header">Atalhos do aluno</Text>
            <StudentQuickAccess onSelect={selectArea} />
          </View>
        </>
      )}
    </StudentShell>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  greeting: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  hello: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 22, color: colors.text },
  title: { fontFamily: fonts.bold, fontSize: 28, lineHeight: 38, color: colors.text, marginTop: 2 },
  subtitle: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 20, color: colors.text, marginTop: 4 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: `${colors.primary}12`, alignItems: 'center', justifyContent: 'center' },
  initials: { fontFamily: fonts.bold, fontSize: 18, color: colors.primary },
  section: { gap: 12 },
  sectionTitle: { flexShrink: 1, fontFamily: fonts.semibold, fontSize: 18, lineHeight: 26, color: colors.text },
  summary: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  learning: { gap: 24 },
  learningWide: { flexDirection: 'row', alignItems: 'flex-start' },
  column: { minWidth: 0, gap: 12 },
  wideColumn: { flex: 1 },
  sectionHeader: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  sectionAction: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 4 },
  link: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 18, color: colors.primary },
});
