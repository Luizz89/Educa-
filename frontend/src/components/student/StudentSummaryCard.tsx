import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius } from '../../theme';

type Props = {
  icon: ComponentProps<typeof Ionicons>['name'];
  value: number;
  label: string;
};

export function StudentSummaryCard({ icon, value, label }: Props) {
  return (
    <View style={styles.card} accessible accessibilityLabel={`${value} ${label}`}>
      <Ionicons name={icon} size={22} color={colors.primary} accessible={false} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexGrow: 1, flexBasis: 104, minWidth: 104, gap: 8, padding: 12,
    backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border,
  },
  value: { fontFamily: fonts.bold, fontSize: 26, color: colors.text },
  label: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 18, color: colors.textMuted },
});
