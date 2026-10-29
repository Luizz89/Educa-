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

//export const register: RequestHandler = (req, _res) => {
// validateRegister(req.body);
 // throw notImplemented("O cadastro");
//};

const ROLE_TO_DB = {
  aluno: "STUDENT",
  professor: "TEACHER",
} as const;

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { role, name, email, password } = validateRegister(req.body);

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.trim().toLowerCase(),
        passwordHash,
        role: ROLE_TO_DB[role],
      },
      select: { id: true, name: true, email: true, role: true },
    });

    res.status(201).json(user);
  } catch (err) {
    if ((err as { code?: string })?.code === "P2002") {
      next(
        new AppError(409, "EMAIL_ALREADY_EXISTS", "Este e-mail já está cadastrado.", {
          email: "Este e-mail já está cadastrado.",
        }),
      );
      return;
    }
    next(err);
  }
};

export const login: RequestHandler = (req, _res) => {
  validateLogin(req.body);
  throw notImplemented("O login");
};

export const forgotPassword: RequestHandler = (req, _res) => {
  validateForgotPassword(req.body);
  throw notImplemented("A recuperação de senha");
};

import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";