import type { NextFunction, Request, Response } from 'express';
import { handleError } from './errors';

function globalErrorHandler(handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await handler(req, res, next);
    }
    catch (error) {
      console.error('Global Error:', error);
      return handleError(req, res);
    }
  };
}

export default globalErrorHandler;
