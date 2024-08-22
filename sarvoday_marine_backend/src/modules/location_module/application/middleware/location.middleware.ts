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

const createLocationSchema = Joi.object({
  locationName: Joi.string().min(3).required(),
  address: Joi.string().min(3).required(),
  locationCode: Joi.string().min(3).required(),
});

const updateLocationSchema = Joi.object({
  locationName: Joi.string().min(3).optional(),
  address: Joi.string().min(3).optional(),
  locationCode: Joi.string().min(3).optional(),
});

const LocationParamsSchema = Joi.object({
  id: Joi.string().custom(objectIdValidation, 'ObjectId validation').optional(),
  locationName: Joi.string().min(3).optional(),
});

export const validateLocationData = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createLocationSchema.validate(req.body);
  if (error) {
    next(new ValidationError('Invalid service data', error?.details));
  }
  next();
};

export const validateUpdatedLocationData = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateLocationSchema.validate(req.body, { abortEarly: false });
  const { error: paramsError } = LocationParamsSchema.validate(req.params);

  if (error || paramsError) {
    const details = [...(error?.details || []), ...(paramsError?.details || [])];
    next(new ValidationError('Invalid service data', details));
  } else {
    next();
  }
};

export const validateLocationApiParams = (req: Request, res: Response, next: NextFunction) => {
  const { error } = LocationParamsSchema.validate(req.params);
  if (error) {
    const details = [...(error?.details || [])];
    next(new ValidationError('Invalid service data', details));
  } else {
    next();
  }
};
