import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { TextField } from '../components/TextField';
import type { AuthStackParamList } from '../navigation/types';
import { authService, InvalidCredentialsError } from '../services/authService';
import { colors, fonts, radius } from '../theme';
import { validateEmail, validatePassword } from '../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  async function handleLogin() {
    if (loading) return; // evita envio duplicado

    const next = { email: validateEmail(email), password: validatePassword(password) };
    setErrors(next);
    setFormError(undefined);
    if (next.email || next.password) return;

    setLoading(true);
    try {
      await authService.signIn({ email: email.trim(), password });
      // TODO: navegar para o Dashboard quando a navegação logada existir
    } catch (e) {
      setFormError(
        e instanceof InvalidCredentialsError
          ? 'E-mail ou senha incorretos.'
          : 'Não foi possível entrar agora. Tente novamente em instantes.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Logo />
            <Text style={styles.title} accessibilityRole="header">Bem-vindo ao Educa+</Text>
            <Text style={styles.subtitle}>Seu assistente pessoal de estudos</Text>

            <View style={styles.card}>
              <TextField
                label="E-mail"
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
              <TextField
                ref={passwordRef}
                label="Senha"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                isPassword
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />

              {!!formError && (
                <View style={styles.formError} accessibilityRole="alert" accessibilityLiveRegion="assertive">
                  <Text style={styles.formErrorText}>{formError}</Text>
                </View>
              )}

              <Button title="Entrar" onPress={handleLogin} loading={loading} />
            </View>

            <Pressable
              onPress={() => navigation.navigate('ForgotPassword')}
              accessibilityRole="link"
              accessibilityLabel="Esqueceu a senha?"
              style={styles.forgot}
            >
              <Text style={styles.forgotText}>Esqueceu a senha?</Text>
            </Pressable>

            <Text style={styles.noAccount}>Ainda não possui conta?</Text>
            <View style={styles.full}>
              <Button title="Criar conta" variant="secondary" onPress={() => navigation.navigate('SignUp')} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  // maxWidth mantém o formulário num "cartão" em tablets, sem esticar tudo
  container: { width: '100%', maxWidth: 420, alignSelf: 'center', alignItems: 'center' },
  title: { fontFamily: fonts.bold, fontSize: 24, color: colors.text, marginTop: 16, textAlign: 'center' },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, marginTop: 4, marginBottom: 24, textAlign: 'center' },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 20,
    shadowColor: '#1F2033',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  formError: { backgroundColor: colors.errorBg, borderRadius: 8, padding: 10, marginBottom: 12 },
  formErrorText: { fontFamily: fonts.medium, fontSize: 13, color: colors.error },
  forgot: { minHeight: 44, justifyContent: 'center', marginTop: 8 },
  forgotText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.primary },
  noAccount: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, marginBottom: 8 },
  full: { width: '100%' },
});