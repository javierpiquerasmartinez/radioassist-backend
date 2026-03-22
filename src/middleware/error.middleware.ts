import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  status?: number;
  code?: string;
}

export function errorMiddleware(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = err.status ?? 500;
  const message = status === 500 ? 'Internal server error' : err.message;

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({
    error: message,
    ...(err.code && { code: err.code }),
  });
}
