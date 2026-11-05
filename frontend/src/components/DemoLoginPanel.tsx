import { Pressable, StyleSheet, Text, View } from 'react-native';
import { demoCredentials } from '../services/demoAuthService';
import { colors, fonts, radius } from '../theme';

type Props = { demo: boolean; disabled: boolean; onChange: (demo: boolean) => void; onFill: () => void };

export function DemoLoginPanel({ demo, disabled, onChange, onFill }: Props) {
  if (!__DEV__ || !demoCredentials) return null;

  return (
    <View style={styles.panel}>
      <View style={styles.modes} accessibilityRole="radiogroup" accessibilityLabel="Modo de acesso">
        {[{ value: false, title: 'Login real' }, { value: true, title: 'Demonstração' }].map((item) => (
          <Pressable
            key={item.title}
            accessibilityRole="radio"
            accessibilityLabel={item.title}
            accessibilityState={{ checked: demo === item.value, disabled }}
            aria-checked={demo === item.value}
            disabled={disabled}
            onPress={() => onChange(item.value)}
            style={[styles.mode, demo === item.value && styles.selected]}
          >
            <Text style={[styles.modeText, demo === item.value && styles.selectedText]}>{item.title}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.hint}>
        {demo ? 'Teste local do aluno. Use os dados fictícios abaixo:' : 'O login real ainda depende da integração com o serviço de autenticação.'}
      </Text>
      {demo && (
        <>
          <Text selectable style={styles.credentials}>E-mail: {demoCredentials.email}{'\n'}Senha: {demoCredentials.password}</Text>
          <Pressable onPress={onFill} disabled={disabled} accessibilityRole="button" accessibilityLabel="Preencher dados de demonstração" style={styles.fill}>
            <Text style={styles.fillText}>Preencher dados de teste</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { width: '100%', gap: 10, marginBottom: 20 },
  modes: { flexDirection: 'row', padding: 4, gap: 4, borderRadius: radius.md, backgroundColor: colors.background },
  mode: { flex: 1, minHeight: 44, justifyContent: 'center', paddingHorizontal: 8, paddingVertical: 8, borderRadius: 8 },
  selected: { backgroundColor: colors.surface },
  modeText: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 18, textAlign: 'center', color: colors.text },
  selectedText: { fontFamily: fonts.semibold, color: colors.primary },
  hint: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 19, color: colors.textMuted },
  credentials: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 20, color: colors.text },
  fill: { minHeight: 44, justifyContent: 'center' },
  fillText: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 18, color: colors.primary },
});
