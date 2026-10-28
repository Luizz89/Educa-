import { AppError, type FieldErrors } from "../errors/AppError";
import type { ForgotPasswordInput, LoginInput, RegisterInput } from "../types/auth";

// Mesmas regras (e mensagens) que o app já usa em frontend/src/utils/validation.ts.
// O app valida para dar resposta rápida ao usuário; o backend valida de novo
// porque o app pode ser burlado e nunca devemos confiar no que chega.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLES = ["aluno", "professor"] as const;

const asObject = (body: unknown): Record<string, unknown> =>
  typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};

const asString = (value: unknown): string => (typeof value === "string" ? value : "");

function checkEmail(raw: unknown, fields: FieldErrors): string {
  const email = asString(raw).trim();
  if (!email) fields.email = "Informe seu e-mail.";
  else if (!EMAIL_REGEX.test(email)) fields.email = "Digite um e-mail válido.";
  // E-mail é guardado em minúsculas para "Maria@x.com" e "maria@x.com" serem o mesmo.
  return email.toLowerCase();
}

function throwIfInvalid(fields: FieldErrors): void {
  if (Object.keys(fields).length > 0) {
    throw new AppError(400, "VALIDATION_ERROR", "Dados inválidos.", fields);
  }
}

export function validateRegister(body: unknown): RegisterInput {
  const data = asObject(body);
  const fields: FieldErrors = {};

  const role = data.role;
  if (typeof role !== "string" || !(ROLES as readonly string[]).includes(role)) {
    fields.role = "Escolha o tipo de conta: aluno ou professor.";
  }

  const name = asString(data.name).trim();
  if (!name) fields.name = "Informe seu nome.";

  const email = checkEmail(data.email, fields);

  const password = asString(data.password);
  if (!password) fields.password = "Crie uma senha.";
  else if (password.length < 8) fields.password = "A senha deve ter pelo menos 8 caracteres.";

  throwIfInvalid(fields);
  return { role: role as RegisterInput["role"], name, email, password };
}

export function validateLogin(body: unknown): LoginInput {
  const data = asObject(body);
  const fields: FieldErrors = {};

  const email = checkEmail(data.email, fields);

  const password = asString(data.password);
  if (!password) fields.password = "Informe sua senha.";

  throwIfInvalid(fields);
  return { email, password };
}

export function validateForgotPassword(body: unknown): ForgotPasswordInput {
  const data = asObject(body);
  const fields: FieldErrors = {};

  const email = checkEmail(data.email, fields);

  throwIfInvalid(fields);
  return { email };
}
