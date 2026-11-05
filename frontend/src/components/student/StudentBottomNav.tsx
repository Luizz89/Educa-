import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, radius } from '../../theme';
import type { StudentArea } from '../../types/student';

type Item = { id: StudentArea; title: string; icon: ComponentProps<typeof Ionicons>['name'] };
const items: readonly Item[] = [
  { id: 'home', title: 'Início', icon: 'home-outline' },
  { id: 'tasks', title: 'Tarefas', icon: 'checkbox-outline' },
  { id: 'courses', title: 'Cursos', icon: 'book-outline' },
  { id: 'community', title: 'Comunidade', icon: 'people-outline' },
  { id: 'profile', title: 'Perfil', icon: 'person-outline' },
];

export function StudentBottomNav({ active, onSelect }: {
  active: 'home' | 'profile'; onSelect: (area: StudentArea) => void;
}) {
  const { width } = useWindowDimensions();
  return (
    <SafeAreaView edges={['bottom']} style={styles.safe}>
      <View style={styles.bar}>
        {items.map((item) => {
          const selected = active === item.id;
          const future = item.id !== 'home' && item.id !== 'profile';
          return (
            <Pressable
              key={item.id}
              onPress={() => onSelect(item.id)}
              accessibilityRole="button"
              accessibilityLabel={selected ? `${item.title}, selecionado` : future ? `${item.title}, em desenvolvimento` : `Abrir ${item.title}`}
              accessibilityState={{ selected }}
              style={({ pressed }) => [styles.item, selected && styles.active, pressed && styles.pressed]}
            >
              <Ionicons name={item.icon} size={22} color={selected ? colors.primary : colors.textMuted} accessible={false} />
              <Text style={[styles.label, width < 360 && styles.smallLabel, selected && styles.activeLabel]}>{item.title}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  bar: { width: '100%', maxWidth: 680, alignSelf: 'center', flexDirection: 'row', gap: 2, paddingHorizontal: 4, paddingVertical: 6 },
  item: { flex: 1, minWidth: 0, minHeight: 58, alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 8, paddingHorizontal: 2, borderRadius: radius.md },
  active: { backgroundColor: `${colors.primary}0D` },
  pressed: { opacity: 0.7 },
  label: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 16, textAlign: 'center', color: colors.textMuted },
  smallLabel: { fontSize: 10 },
  activeLabel: { fontFamily: fonts.semibold, color: colors.primary },
});
