import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius } from '../../theme';
import { formatStudentDate, getUpcomingTasks } from '../../data/studentHomeMock';
import type { StudentTask } from '../../types/student';

export function StudentTaskPreview({ tasks }: { tasks: readonly StudentTask[] }) {
  if (tasks.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Nenhuma tarefa por aqui</Text>
        <Text style={styles.detail}>Suas próximas atividades aparecerão nesta seção.</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {getUpcomingTasks(tasks).map((task) => {
        const completed = task.status === 'completed';
        const status = completed ? 'Concluída' : 'Pendente';
        return (
          <View key={task.id} style={styles.card}>
            <View style={styles.row}>
              <Ionicons
                name={completed ? 'checkmark-circle-outline' : 'time-outline'}
                color={completed ? colors.violet : colors.primary}
                size={22}
                accessible={false}
              />
              <View style={styles.content}>
                <Text style={styles.title}>{task.title}</Text>
                <Text style={styles.detail}>{task.subject}</Text>
              </View>
            </View>
            <View style={styles.metadata}>
              <Text style={styles.deadline}>Exemplo: {formatStudentDate(task.dueAt)}</Text>
              <Text style={[styles.status, completed && styles.completed]}>{status}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  card: {
    padding: 16, gap: 12, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  content: { flex: 1, gap: 4 },
  title: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 21, color: colors.text },
  detail: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 20, color: colors.textMuted },
  metadata: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  deadline: { flexGrow: 1, fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, color: colors.textMuted },
  status: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 18, color: colors.primary },
  completed: { color: colors.violet },
});
