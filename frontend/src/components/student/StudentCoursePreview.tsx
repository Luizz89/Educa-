import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../Button';
import { colors, fonts, radius } from '../../theme';
import type { StudentCourse } from '../../types/student';
import { getCourseProgress } from '../../data/studentHomeMock';

type Props = { course?: StudentCourse; onContinue: () => void };

export function StudentCoursePreview({ course, onContinue }: Props) {
  if (!course) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Nenhum curso em andamento</Text>
        <Text style={styles.description}>Quando você começar um curso, poderá acompanhá-lo aqui.</Text>
      </View>
    );
  }

  const progress = getCourseProgress(course);

  return (
    <View style={styles.card}>
      <View style={styles.courseIcon}>
        <Ionicons name="book-outline" size={24} color={colors.primary} accessible={false} />
        <Text style={styles.courseTag}>CURSO EM ANDAMENTO</Text>
      </View>
      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.description}>{course.description}</Text>
      <View style={styles.progressLabels}>
        <Text style={styles.lessons}>{course.completedLessons} de {course.totalLessons} aulas</Text>
        <Text style={styles.percentage}>{progress}% concluído</Text>
      </View>
      <View
        style={styles.track}
        accessibilityRole="progressbar"
        accessibilityLabel={`Progresso em ${course.title}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-valuetext={`${progress}% concluído`}
      >
        <View style={[styles.fill, { width: `${progress}%` }]} />
      </View>
      <Button title="Continuar estudando" accessibilityLabel={`Continuar estudando: ${course.title}`} onPress={onContinue} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20, gap: 12, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg,
  },
  title: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 24, color: colors.text },
  courseIcon: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  courseTag: { fontFamily: fonts.semibold, fontSize: 10, lineHeight: 16, letterSpacing: 0.6, color: colors.primary },
  description: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.textMuted },
  progressLabels: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  lessons: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  percentage: { fontFamily: fonts.semibold, fontSize: 12, color: colors.primary },
  track: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
});
