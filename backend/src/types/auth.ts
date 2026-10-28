export type AccountRole = "aluno" | "professor";

export type RegisterInput = {
  role: AccountRole;
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type ForgotPasswordInput = {
  email: string;
};
