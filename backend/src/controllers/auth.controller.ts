import type { RequestHandler } from "express";
import { AppError } from "../errors/AppError";
import {
  validateForgotPassword,
  validateLogin,
  validateRegister,
} from "../validation/auth.validation";

// PROVISÓRIO: os dados são validados, mas ainda não existe banco para gravar ou
// consultar usuários. Por isso, depois de validar, respondemos 501 (não
// implementado) em vez de fingir que o cadastro/login funcionou.
// Quando o esquema do PostgreSQL estiver pronto, o lugar do "throw" abaixo
// passa a chamar a camada de serviço, que usa o banco.
const notImplemented = (what: string) =>
  new AppError(501, "NOT_IMPLEMENTED", `${what} ainda não está disponível: depende do banco de dados.`);

export const register: RequestHandler = (req, _res) => {
  validateRegister(req.body);
  throw notImplemented("O cadastro");
};

export const login: RequestHandler = (req, _res) => {
  validateLogin(req.body);
  throw notImplemented("O login");
};

export const forgotPassword: RequestHandler = (req, _res) => {
  validateForgotPassword(req.body);
  throw notImplemented("A recuperação de senha");
};
