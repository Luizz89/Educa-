import { InvalidCredentialsError, type Credentials } from './authService';

// Credenciais públicas e fictícias, exclusivas da demonstração em desenvolvimento.
export const demoCredentials = __DEV__
  ? { email: 'aluno@educamais.example', password: 'Educa+123' }
  : undefined;

export async function signInDemo(credentials: Credentials): Promise<void> {
  if (!__DEV__ || !demoCredentials) throw new Error('DEMO_UNAVAILABLE');

  await new Promise<void>((resolve) => setTimeout(resolve, 400));
  if (
    credentials.email.trim().toLowerCase() !== demoCredentials.email ||
    credentials.password !== demoCredentials.password
  ) {
    throw new InvalidCredentialsError('Credenciais de demonstração incorretas.');
  }
  // Não há sessão autenticada, token, banco ou armazenamento de senha.
}
