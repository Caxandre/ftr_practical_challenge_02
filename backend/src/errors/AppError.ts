import { GraphQLError } from "graphql";

export type AppErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "CATEGORY_HAS_TRANSACTIONS";

export class AppError extends GraphQLError {
  constructor(message: string, code: AppErrorCode, extra?: Record<string, unknown>) {
    super(message, {
      extensions: {
        code,
        ...extra,
      },
    });
  }
}

export const Unauthenticated = (message = "Não autenticado") =>
  new AppError(message, "UNAUTHENTICATED");

export const Forbidden = (message = "Você não tem permissão para acessar este recurso") =>
  new AppError(message, "FORBIDDEN");

export const NotFound = (message = "Recurso não encontrado") =>
  new AppError(message, "NOT_FOUND");

export const ValidationError = (message: string) =>
  new AppError(message, "VALIDATION_ERROR");

export const CategoryHasTransactions = (
  message = "Categoria possui transações vinculadas e não pode ser excluída"
) => new AppError(message, "CATEGORY_HAS_TRANSACTIONS");
