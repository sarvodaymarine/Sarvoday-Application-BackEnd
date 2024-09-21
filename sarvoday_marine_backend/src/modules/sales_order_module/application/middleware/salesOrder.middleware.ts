import { ValidationError } from '@src/shared/utils/exceptions/validation_error.exception';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const salesOrderSchema = Joi.object({
  locationName: Joi.string().min(3).required(),
  clientId: Joi.string().required(),
  products: Joi.string().required(),
  noOfContainer: Joi.number().required(),
  orderDate: Joi.date().required(),
  clientName: Joi.string().required(),
});

export const validateSalesOrderRequestBody = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = await salesOrderSchema.validateAsync(req.body);
  if (error) {
    const details = [...(error?.details || [])];
    next(new ValidationError('Invalid service data', details));
  }
  next();
};
