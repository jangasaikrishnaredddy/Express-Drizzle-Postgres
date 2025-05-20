import type { Request, Response } from 'express';
import { RES_INTERNAL_ERROR, RES_NOT_FOUND, RES_UNAUTHORIZED, RES_VALIDATION_ERROR } from '../constants/response-code';

export function handleValidationError(_req: Request, res: Response, message: string) {
  const code: string = RES_VALIDATION_ERROR;
  res.status(400).json({ code, message });
}

export function handle404Error(_req: Request, res: Response) {
  const code: string = RES_NOT_FOUND;
  res.status(404).json({
    code,
    message: 'Route not found',
  });
}

export function handleUnauthorized(_req: Request, res: Response) {
  const code: string = RES_UNAUTHORIZED;
  res.status(404).json({
    code,
    message: 'Route not found',
  });
}

export function handleError(_req: Request, res: Response) {
  const code: string = RES_INTERNAL_ERROR;
  res.status(500).json({
    code,
    message: 'Internal Server Error',
  });
}
