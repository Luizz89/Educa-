import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius } from '../../theme';
import type { getStudentHomeSummary } from '../../data/studentHomeMock';

type Props = { summary: ReturnType<typeof getStudentHomeSummary>; onAchievements: () => void };

export function StudentProgressCard({ summary, onAchievements }: Props) {
  return (
    <LinearGradient colors={[colors.primary, colors.violet]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.flex}>
          <Text style={styles.eyebrow}>SEUS PONTOS</Text>
          <Text style={styles.points}>{summary.points} <Text style={styles.pointsUnit}>pts</Text></Text>
        </View>
        <View style={styles.icon}><Ionicons name="trophy-outline" size={30} color={colors.surface} accessible={false} /></View>
      </View>
      <Text style={styles.message}>Cada passo conta. Continue aprendendo!</Text>
      <View style={styles.progressLabels}>
        <Text style={styles.progressText}>{summary.completedLessons} de {summary.totalLessons} aulas concluídas</Text>
        <Text style={styles.progressText}>{summary.studyProgress}%</Text>
      </View>
      <View style={styles.track} accessibilityRole="progressbar" accessibilityLabel="Progresso geral de estudo" aria-valuemin={0} aria-valuemax={100} aria-valuenow={summary.studyProgress} aria-valuetext={`${summary.completedLessons} de ${summary.totalLessons} aulas concluídas`}>
        <View style={[styles.fill, { width: `${summary.studyProgress}%` }]} />
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Ver conquistas, em desenvolvimento" onPress={onAchievements} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
        <Text style={styles.actionText}>Ver conquistas</Text>
        <Ionicons name="arrow-forward-outline" size={16} color={colors.surface} accessible={false} />
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: 24, gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flex: { flex: 1 },
  eyebrow: { fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 1.2, color: colors.surface },
  points: { fontFamily: fonts.bold, fontSize: 38, lineHeight: 50, color: colors.surface, marginTop: 2 },
  pointsUnit: { fontFamily: fonts.medium, fontSize: 23 },
  icon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: `${colors.surface}1A` },
  message: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.surface },
  progressLabels: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8, marginTop: 4 },
  progressText: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 18, color: colors.surface },
  track: { height: 6, borderRadius: 3, overflow: 'hidden', backgroundColor: `${colors.surface}40` },
  fill: { height: '100%', borderRadius: 3, backgroundColor: colors.surface },
  action: { minHeight: 44, alignSelf: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, backgroundColor: `${colors.text}26`, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 10, marginTop: 2 },
  actionText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.surface },
  pressed: { opacity: 0.8 },
});
