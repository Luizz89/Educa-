import type { ErrorRequestHandler, RequestHandler } from "express";
import { AppError } from "../errors/AppError";

// Rota que não existe -> 404 no formato padrão (em vez do HTML padrão do Express).
export const notFoundHandler: RequestHandler = (_req, _res, next) => {
  next(new AppError(404, "NOT_FOUND", "Rota não encontrada."));
};

// Todo erro da API passa por aqui e sai no formato:
// { "error": { "code": "...", "message": "...", "fields"?: { campo: "mensagem" } } }
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.fields ? { fields: err.fields } : {}),
      },
    });
    return;
  }

  // JSON malformado no corpo da requisição (erro do express.json()).
  if (err?.type === "entity.parse.failed") {
    res.status(400).json({
      error: { code: "INVALID_JSON", message: "O corpo da requisição não é um JSON válido." },
    });
    return;
  }

  // Qualquer outra coisa é um erro inesperado: registramos no terminal e
  // devolvemos uma mensagem genérica (sem vazar detalhes internos).
  console.error(err);
  res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Erro interno do servidor." },
  });
};
