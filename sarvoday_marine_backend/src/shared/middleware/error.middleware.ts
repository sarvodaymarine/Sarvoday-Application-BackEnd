import { Request, Response, NextFunction } from 'express';
import HttpException from '@src/shared/utils/exceptions/http.exception';

export const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction): void => {
  const status = error.status || 500;
  const message = error.message || 'Something went to wrong!';
  res.status(status).send({ status, message });
};
