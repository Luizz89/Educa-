import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { getStudentActivityEntries } from '../../data/studentHomeMock';
import { colors, fonts, radius } from '../../theme';
import type { StudentHomeData } from '../../types/student';

export function StudentActivityPreview({ data }: { data: StudentHomeData }) {
  const entries = getStudentActivityEntries(data);
  return (
    <View style={styles.card}>
      <Text style={styles.title} accessibilityRole="header">Histórico de atividades</Text>
      <Text style={styles.caption}>Registros de exemplo desta demonstração</Text>
      {entries.length === 0 ? <Text style={styles.detail}>Suas atividades aparecerão aqui.</Text> : entries.map((entry, index) => (
        <View key={entry.id} style={[styles.row, index > 0 && styles.separator]}>
          <View style={styles.icon}>
            <Ionicons name={entry.kind === 'task' ? 'checkmark-circle-outline' : entry.kind === 'course' ? 'book-outline' : 'trophy-outline'} size={20} color={colors.primary} accessible={false} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.entryTitle}>{entry.title}</Text>
            <Text style={styles.detail}>{entry.detail}</Text>
            <Text style={styles.date}>{entry.date}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 20, gap: 8 },
  title: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 25, color: colors.text },
  caption: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, color: colors.textMuted, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 12 },
  separator: { borderTopWidth: 1, borderTopColor: colors.border },
  icon: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, backgroundColor: `${colors.primary}0D` },
  flex: { flex: 1, gap: 4 },
  entryTitle: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 20, color: colors.text },
  detail: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 19, color: colors.textMuted },
  date: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 17, color: colors.textMuted },
});
