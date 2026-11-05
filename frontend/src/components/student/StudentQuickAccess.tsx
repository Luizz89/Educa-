import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { colors, fonts, radius } from '../../theme';
import type { StudentArea } from '../../types/student';

type AreaOption = {
  id: StudentArea;
  title: string;
  description: string;
  icon: ComponentProps<typeof Ionicons>['name'];
};

const areas: readonly AreaOption[] = [
  { id: 'tasks', title: 'Tarefas', description: 'Organize sua rotina', icon: 'checkbox-outline' },
  { id: 'courses', title: 'Cursos', description: 'Continue aprendendo', icon: 'book-outline' },
  { id: 'community', title: 'Comunidade', description: 'Aprenda em conjunto', icon: 'people-outline' },
  { id: 'profile', title: 'Perfil', description: 'Seu espaço de aluno', icon: 'person-outline' },
];

export const studentAreaLabels: Record<StudentArea, string> = {
  home: 'Início', tasks: 'Tarefas', courses: 'Cursos',
  gamification: 'Gamificação', community: 'Comunidade', profile: 'Perfil',
};

export function StudentQuickAccess({ onSelect }: { onSelect: (area: StudentArea) => void }) {
  const { width, fontScale } = useWindowDimensions();
  const singleColumn = width < 300 || fontScale > 1.3;

  return (
    <View style={styles.grid}>
      {areas.map((area) => (
        <Pressable
          key={area.id}
          onPress={() => onSelect(area.id)}
          accessibilityRole="button"
          accessibilityLabel={area.id === 'profile' ? 'Ver meu perfil' : `Atalho para ${area.title}, em desenvolvimento`}
          style={({ pressed }) => [
            styles.card, singleColumn && styles.singleColumn,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.topLine}>
            <Ionicons name={area.icon} size={24} color={colors.primary} accessible={false} />
            <Text style={styles.tag}>{area.id === 'profile' ? 'Conheça seu espaço' : 'Em breve'}</Text>
          </View>
          <Text style={styles.title}>{area.title}</Text>
          <Text style={styles.description}>{area.description}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    flexGrow: 1, flexBasis: '22%', minWidth: 120, minHeight: 112,
    padding: 16, gap: 8, backgroundColor: colors.surface,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border,
  },
  singleColumn: { flexBasis: '100%' },
  pressed: { opacity: 0.8 },
  topLine: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  tag: { fontFamily: fonts.medium, fontSize: 10, lineHeight: 16, color: colors.primary },
  title: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 22, color: colors.text },
  description: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, color: colors.textMuted },
});
