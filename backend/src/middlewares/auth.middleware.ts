import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";

export type AuthRole = "STUDENT" | "TEACHER";

declare module "express-serve-static-core" {
  interface Request {
    auth?: { userId: string; role: AuthRole };
  }
}

export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    next(new AppError(401, "UNAUTHORIZED", "Token não informado."));
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    next(new Error("JWT_SECRET não definida."));
    return;
  }

  try {
    const payload = jwt.verify(header.slice(7), secret);

    if (
      typeof payload === "string" ||
      !payload.sub ||
      (payload.role !== "STUDENT" && payload.role !== "TEACHER")
    ) {
      throw new Error("Payload inválido.");
    }

    req.auth = { userId: payload.sub, role: payload.role };
    next();
  } catch {
    next(new AppError(401, "INVALID_TOKEN", "Token inválido ou expirado."));
  }
};

export const requireRole =
  (...roles: AuthRole[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      next(new AppError(403, "FORBIDDEN", "Sem permissão para acessar este recurso."));
      return;
    }
    next();
  };