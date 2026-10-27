export type AccountRole = 'aluno' | 'professor';

export type Credentials = { email: string; password: string };

export type SignUpData = {
  role: AccountRole;
  name: string;
  email: string;
  password: string;
};

export class InvalidCredentialsError extends Error {}

export interface AuthService {
  signIn(credentials: Credentials): Promise<void>;
  signUp(data: SignUpData): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
}

// Enquanto não existe back-end, cadastro e recuperação de senha são SIMULADOS
// (só esperam um instante e dão sucesso). Quando a API existir, implemente as
// chamadas reais e mude para false.
const SIMULATE_BACKEND = true;
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const authService: AuthService = {
  // O login nunca simula sucesso: sem serviço real, ele falha.
  async signIn() {
    throw new Error('AUTH_NOT_CONFIGURED');
  },

  async signUp() {
    if (SIMULATE_BACKEND) {
      await wait(1200);
      return;
    }
    // TODO: chamada real de cadastro
    throw new Error('AUTH_NOT_CONFIGURED');
  },

  async requestPasswordReset() {
    if (SIMULATE_BACKEND) {
      await wait(1200);
      return;
    }
    // TODO: chamada real de recuperação de senha
    throw new Error('AUTH_NOT_CONFIGURED');
  },
};