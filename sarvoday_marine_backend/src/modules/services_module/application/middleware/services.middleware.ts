import { ValidationError } from '@src/shared/utils/exceptions/validation_error.exception';
import { Request, Response, NextFunction } from 'express';
import Joi, { CustomHelpers } from 'joi';
const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
const objectIdValidation = (value: any, helpers: CustomHelpers) => {
  if (!uuidRegex.test(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

const createServiceSchema = Joi.object({
  serviceName: Joi.string().min(3).required(),
  container1Price: Joi.number().required(),
  container2Price: Joi.number().required(),
  container3Price: Joi.number().required(),
  container4Price: Joi.number().required(),
});

const updateServiceSchema = Joi.object({
  serviceName: Joi.string().min(3).optional(),
  container1Price: Joi.number().optional(),
  container2Price: Joi.number().optional(),
  container3Price: Joi.number().optional(),
  container4Price: Joi.number().optional(),
});

const serviceParamsSchema = Joi.object({
  id: Joi.string().custom(objectIdValidation, 'ObjectId validation').optional(),
  serviceName: Joi.string().min(3).optional(),
});

export const validateServiceData = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const { error } = createServiceSchema.validate(req.body);

  if (error) {
    console.log(error);
    next(new ValidationError('Invalid service data', error?.details));
  }
  next();
};

export const validateServiceUpdatedData = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateServiceSchema.validate(req.body, { abortEarly: false });
  // const { error: paramsError } = serviceParamsSchema.validate(req.params);

  if (error) {
    const details = [...(error?.details || [])];
    next(new ValidationError('Invalid service data', details));
  } else {
    next();
  }
};

export const validateServiceApiParams = (req: Request, res: Response, next: NextFunction) => {
  const { error } = serviceParamsSchema.validate(req.params);
  console.log('Error:', error);
  if (error) {
    const details = [...(error?.details || [])];
    next(new ValidationError('Invalid service params', details));
  } else {
    next();
  }
};
