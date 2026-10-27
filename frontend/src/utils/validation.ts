const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (v: string): string | undefined => {
  if (!v.trim()) return 'Informe seu e-mail.';
  if (!EMAIL_REGEX.test(v.trim())) return 'Digite um e-mail válido.';
  return undefined;
};

export const validatePassword = (v: string): string | undefined => {
  if (!v) return 'Informe sua senha.';
  return undefined;
};

export const validateName = (v: string): string | undefined => {
  if (!v.trim()) return 'Informe seu nome.';
  return undefined;
};

export const validateNewPassword = (v: string): string | undefined => {
  if (!v) return 'Crie uma senha.';
  if (v.length < 8) return 'A senha deve ter pelo menos 8 caracteres.';
  return undefined;
};

export const validateConfirmPassword = (v: string, original: string): string | undefined => {
  if (!v) return 'Confirme sua senha.';
  if (v !== original) return 'As senhas não coincidem.';
  return undefined;
};