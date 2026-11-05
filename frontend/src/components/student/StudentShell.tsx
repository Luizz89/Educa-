import { useRef, useState, type ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, ScrollView, type ScrollViewInstance, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { AuthStackParamList, StudentStackParamList } from '../../navigation/types';
import { colors, fonts, radius } from '../../theme';
import type { StudentArea } from '../../types/student';
import { Button } from '../Button';
import { Logo } from '../Logo';
import { StudentBottomNav } from './StudentBottomNav';
import { StudentModal } from './StudentModal';
import { studentAreaLabels } from './StudentQuickAccess';

type Actions = { selectArea: (area: StudentArea) => void; showAbout: () => void; logout: () => void };
type Props = { active: 'home' | 'profile'; children: (actions: Actions) => ReactNode };

export function StudentShell({ active, children }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<StudentStackParamList>>();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const [notice, setNotice] = useState<'about' | 'tasks' | 'courses' | 'community' | 'gamification'>();

  function selectArea(area: StudentArea) {
    if (area === active) return;
    if (area === 'home') {
      navigation.popTo('StudentHome');
    } else if (area === 'profile') {
      navigation.navigate('StudentProfile');
    } else {
      setNotice(area);
    }
  }

  function logout() {
    // Desmonta o navegador do aluno e seu estado em memória.
    navigation.getParent<NativeStackNavigationProp<AuthStackParamList>>()?.reset({
      index: 0, routes: [{ name: 'Login' }],
    });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.headerSurface}>
        <View style={styles.header}>
          <View style={styles.brand}>
            <Logo size={32} />
            <Text style={styles.brandTitle}>Educa+</Text>
          </View>
          <Text style={styles.area}>{active === 'home' ? 'Início' : 'Perfil'}</Text>
          <Pressable onPress={logout} accessibilityRole="button" accessibilityLabel="Voltar ao login" style={styles.exit}>
            <Ionicons name="log-out-outline" size={22} color={colors.primary} accessible={false} />
          </Pressable>
        </View>
      </View>

      <ScrollView ref={scrollRef} style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <View style={styles.demoRow}>
            <View style={styles.demoBadge}>
              <Ionicons name="flask-outline" size={13} color={colors.primary} accessible={false} />
              <Text style={styles.demoLabel}>Demonstração</Text>
            </View>
            <Text style={styles.exampleLabel}>Área do aluno • dados de exemplo</Text>
          </View>
          {children({ selectArea, showAbout: () => setNotice('about'), logout })}
        </View>
      </ScrollView>
      <StudentBottomNav active={active} onSelect={(area) => {
        if (area === active) scrollRef.current?.scrollTo({ y: 0, animated: true });
        else selectArea(area);
      }} />

      <StudentModal
        visible={notice !== undefined}
        title={notice === 'about' ? 'Sobre o Educa+' : 'Funcionalidade em desenvolvimento'}
        onClose={() => setNotice(undefined)}
      >
        <Text style={styles.modalText}>
          {notice === 'about'
            ? 'O Educa+ é um projeto acadêmico que reúne organização dos estudos, cursos e incentivo ao aprendizado.\n\nEsta versão demonstra a Home e o Perfil do aluno. Os dados são fictícios, a edição fica apenas em memória e não há autenticação real ou gravação no banco.'
            : `${notice ? studentAreaLabels[notice] : ''} fará parte de uma próxima entrega.\n\nNesta etapa você pode explorar o Início e editar o Perfil demonstrativo.`}
        </Text>
        <Button title="Entendi" onPress={() => setNotice(undefined)} />
      </StudentModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  headerSurface: { borderBottomWidth: 1, borderBottomColor: colors.border },
  header: { width: '100%', maxWidth: 1040, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingHorizontal: 20, minHeight: 72 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.primary },
  area: { fontFamily: fonts.semibold, fontSize: 13, color: colors.text },
  exit: { width: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32 },
  content: { width: '100%', maxWidth: 1000, alignSelf: 'center', gap: 24 },
  demoRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  demoBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 5, paddingHorizontal: 8, backgroundColor: colors.surface, borderRadius: radius.md },
  demoLabel: { fontFamily: fonts.semibold, fontSize: 10, color: colors.primary },
  exampleLabel: { fontFamily: fonts.regular, fontSize: 10, lineHeight: 16, color: colors.text },
  modalText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 22, color: colors.textMuted },
});
