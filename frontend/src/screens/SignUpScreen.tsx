import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../components/Button';
import { RoleSelector } from '../components/RoleSelector';
import { TextField } from '../components/TextField';
import type { AuthStackParamList } from '../navigation/types';
import { authService, type AccountRole } from '../services/authService';
import { colors, fonts } from '../theme';
import {
  validateConfirmPassword, validateEmail, validateName, validateNewPassword,
} from '../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

const TOTAL_STEPS = 2;

type Errors = {
  role?: string;
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
};

export function SignUpScreen({ navigation }: Props) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<AccountRole>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const emailRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  // Validação por etapa
  function validateStep(): boolean {
    const next: Errors =
      step === 1
        ? {
            role: role ? undefined : 'Escolha como você vai usar o Educa+.',
            name: validateName(name),
            email: validateEmail(email),
          }
        : {
            password: validateNewPassword(password),
            confirm: validateConfirmPassword(confirm, password),
          };
    setErrors(next);
    return Object.values(next).every((e) => !e);
  }

  async function handleNext() {
    if (loading) return;
    setFormError(undefined);
    if (!validateStep()) return;

    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      await authService.signUp({
        role: role!,
        name: name.trim(),
        email: email.trim(),
        password,
      });
      setDone(true);
    } catch {
      setFormError('Não foi possível criar a conta agora. Tente novamente em instantes.');
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    if (loading) return;
    setErrors({});
    setFormError(undefined);
    if (step === 1) navigation.goBack();
    else setStep(step - 1);
  }

  if (done) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.doneWrapper}>
          <View style={styles.container}>
            <Ionicons name="checkmark-circle" size={64} color={colors.success} style={styles.center} />
            <Text style={[styles.title, styles.centerText]} accessibilityRole="header">
              Conta criada!
            </Text>
            <Text style={[styles.subtitle, styles.centerText]}>
              Bem-vindo(a) ao Educa+, {name.trim().split(' ')[0]}. Entre com seu e-mail e senha para começar.
            </Text>
            <Button title="Ir para o login" onPress={() => navigation.navigate('Login')} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Text style={styles.title} accessibilityRole="header">Criar conta</Text>
            <Text style={styles.subtitle}>Configure seu perfil em {TOTAL_STEPS} etapas.</Text>

            <View
              style={styles.track}
              accessibilityRole="progressbar"
              accessibilityValue={{ min: 1, max: TOTAL_STEPS, now: step }}
            >
              <View style={[styles.fill, { width: `${(step / TOTAL_STEPS) * 100}%` }]} />
            </View>
            <Text style={styles.stepText}>{step} de {TOTAL_STEPS}</Text>

            {step === 1 && (
              <>
                <RoleSelector
                  value={role}
                  error={errors.role}
                  onChange={(r) => {
                    setRole(r);
                    setErrors((e) => ({ ...e, role: undefined }));
                  }}
                />
                <TextField
                  label="Nome"
                  placeholder="Seu nome"
                  value={name}
                  onChangeText={setName}
                  error={errors.name}
                  autoComplete="name"
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
                <TextField
                  ref={emailRef}
                  label="E-mail"
                  placeholder="seu@email.com"
                  value={email}
                  onChangeText={setEmail}
                  error={errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                />
              </>
            )}

            {step === 2 && (
              <>
                <Text style={styles.hint}>Crie uma senha com pelo menos 8 caracteres.</Text>
                <TextField
                  label="Senha"
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  error={errors.password}
                  isPassword
                  autoCapitalize="none"
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="next"
                  onSubmitEditing={() => confirmRef.current?.focus()}
                />
                <TextField
                  ref={confirmRef}
                  label="Confirmar senha"
                  placeholder="••••••••"
                  value={confirm}
                  onChangeText={setConfirm}
                  error={errors.confirm}
                  isPassword
                  autoCapitalize="none"
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="done"
                  onSubmitEditing={handleNext}
                />
              </>
            )}

            {!!formError && (
              <View style={styles.formError} accessibilityRole="alert" accessibilityLiveRegion="assertive">
                <Text style={styles.formErrorText}>{formError}</Text>
              </View>
            )}

            <View style={styles.actions}>
              <View style={{ flex: 1 }}>
                <Button title="Voltar" variant="secondary" onPress={handleBack} disabled={loading} />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  title={step === TOTAL_STEPS ? 'Criar conta' : 'Próximo'}
                  onPress={handleNext}
                  loading={loading}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, padding: 24 },
  doneWrapper: { flex: 1, justifyContent: 'center', padding: 24 },
  container: { width: '100%', maxWidth: 420, alignSelf: 'center' },
  center: { alignSelf: 'center' },
  centerText: { textAlign: 'center' },
  title: { fontFamily: fonts.bold, fontSize: 24, color: colors.text },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, marginTop: 4, marginBottom: 16 },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.primary },
  stepText: { fontFamily: fonts.medium, fontSize: 12, color: colors.primary, marginTop: 6, marginBottom: 20 },
  hint: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, marginBottom: 16 },
  formError: { backgroundColor: colors.errorBg, borderRadius: 8, padding: 10, marginBottom: 12 },
  formErrorText: { fontFamily: fonts.medium, fontSize: 13, color: colors.error },
  actions: { flexDirection: 'row', gap: 12, marginTop: 8 },
});