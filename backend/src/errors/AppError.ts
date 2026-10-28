export type FieldErrors = Record<string, string>;

/**
 * Erro "esperado" da API. Qualquer parte do código pode lançar um AppError;
 * o middleware de erros transforma ele na resposta JSON padrão.
 */
export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly fields?: FieldErrors,
  ) {
    super(message);
    this.name = "AppError";
  }
}
