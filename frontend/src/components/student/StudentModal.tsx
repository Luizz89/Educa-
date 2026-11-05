import type { ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, radius } from '../../theme';

type Props = { visible: boolean; title: string; onClose: () => void; children: ReactNode };

export function StudentModal({ visible, title, onClose, children }: Props) {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <SafeAreaView style={styles.backdrop}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={styles.card} accessibilityViewIsModal aria-modal>
              <View style={styles.header}>
                <Text style={styles.title} accessibilityRole="header">{title}</Text>
                <Pressable accessibilityRole="button" accessibilityLabel="Fechar janela" onPress={onClose} style={styles.close}>
                  <Ionicons name="close-outline" size={24} color={colors.textMuted} accessible={false} />
                </Pressable>
              </View>
              {children}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: { flex: 1, backgroundColor: `${colors.text}99` },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 480, alignSelf: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: 24, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flex: 1, fontFamily: fonts.bold, fontSize: 20, lineHeight: 28, color: colors.text },
  close: { minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center' },
});
