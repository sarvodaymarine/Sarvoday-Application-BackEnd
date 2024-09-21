import { emailValidation, mobileNumberValidator } from '@src/shared/custom_validation/custom.joi.validation';
import { ValidationError } from '@src/shared/utils/exceptions/validation_error.exception';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const createClientSchema = Joi.object({
  userId: Joi.string().required().messages({
    'string.base': 'User ID should be a type of text',
    'string.empty': 'User ID cannot be an empty field',
    'any.required': 'User ID is a required field',
  }),
  firstName: Joi.string().required().messages({
    'string.base': 'First name should be a type of text',
    'string.empty': 'First name cannot be an empty field',
    'any.required': 'First name is a required field',
  }),
  lastName: Joi.string().required().messages({
    'string.base': 'Last name should be a type of text',
    'string.empty': 'Last name cannot be an empty field',
    'any.required': 'Last name is a required field',
  }),
  email: Joi.string().email().custom(emailValidation).required().messages({
    'string.base': 'Email should be a type of text',
    'string.empty': 'Email cannot be an empty field',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is a required field',
  }),
  countryCode: Joi.string()
    .min(1)
    .max(4)
    .pattern(/^\+\d+$/)
    .required()
    .messages({
      'string.base': 'Country code should be a type of text',
      'string.empty': 'Country code cannot be an empty field',
      'string.min': 'Country code must be at least 1 character long',
      'string.max': 'Country code must be at most 4 characters long',
      'string.pattern.base': 'Country code must start with a "+" followed by digits',
      'any.required': 'Country code is a required field',
    }),
  mobile: Joi.string().required().custom(mobileNumberValidator, 'Mobile number validation').messages({
    'string.base': 'Mobile number should be a type of text',
    'string.empty': 'Mobile number cannot be an empty field',
    'any.required': 'Mobile number is a required field',
    'custom.mobileNumberValidation': 'Mobile number is invalid',
  }),
  address: Joi.string().required().messages({
    'string.base': 'Address should be a type of text',
    'string.empty': 'Address cannot be an empty field',
    'any.required': 'Address is a required field',
  }),
  services: Joi.array()
    .items(
      Joi.object({
        serviceName: Joi.string().required().messages({
          'string.base': 'Service name should be a type of text',
          'string.empty': 'Service name cannot be an empty field',
          'any.required': 'Service name is a required field',
        }),
        container1Price: Joi.number().positive().required().messages({
          'number.base': 'Container1 price should be a type of number',
          'number.positive': 'Container1 price must be a positive number',
          'any.required': 'Container1 price is a required field',
        }),
        container2Price: Joi.number().positive().required().messages({
          'number.base': 'Container2 price should be a type of number',
          'number.positive': 'Container2 price must be a positive number',
          'any.required': 'Container2 price is a required field',
        }),
        container3Price: Joi.number().positive().required().messages({
          'number.base': 'Container3 price should be a type of number',
          'number.positive': 'Container3 price must be a positive number',
          'any.required': 'Container3 price is a required field',
        }),
        container4Price: Joi.number().positive().required().messages({
          'number.base': 'Container4 price should be a type of number',
          'number.positive': 'Container4 price must be a positive number',
          'any.required': 'Container4 price is a required field',
        }),
      }),
    )
    .optional()
    .messages({
      'array.base': 'Services should be an array',
    }),
});

export const updateClientSchema = Joi.object({
  userId: Joi.string().required().messages({
    'string.base': 'User ID should be a type of text',
    'string.empty': 'User ID cannot be an empty field',
    'any.required': 'User ID is a required field',
  }),
  firstName: Joi.string().optional().messages({
    'string.base': 'First name should be a type of text',
    'string.empty': 'First name cannot be an empty field',
  }),
  lastName: Joi.string().optional().messages({
    'string.base': 'Last name should be a type of text',
    'string.empty': 'Last name cannot be an empty field',
  }),
  email: Joi.string().email().custom(emailValidation).optional().messages({
    'string.base': 'Email should be a type of text',
    'string.email': 'Email must be a valid email address',
  }),
  countryCode: Joi.string()
    .min(1)
    .max(4)
    .pattern(/^\+\d+$/)
    .optional()
    .messages({
      'string.base': 'Country code should be a type of text',
      'string.min': 'Country code must be at least 1 character long',
      'string.max': 'Country code must be at most 4 characters long',
      'string.pattern.base': 'Country code must start with a "+" followed by digits',
    }),
  mobile: Joi.string().optional().custom(mobileNumberValidator, 'Mobile number validation').messages({
    'string.base': 'Mobile number should be a type of text',
    'custom.mobileNumberValidation': 'Mobile number is invalid',
  }),
  address: Joi.string().optional().messages({
    'string.base': 'Address should be a type of text',
    'string.empty': 'Address cannot be an empty field',
  }),
  isDeleted: Joi.boolean().optional().messages({
    'boolean.base': 'isDeleted should be a boolean',
  }),
  services: Joi.array()
    .items(
      Joi.object({
        serviceId: Joi.string().required().messages({
          'string.base': 'Service ID should be a type of text',
          'string.empty': 'Service ID cannot be an empty field',
          'any.required': 'Service ID is a required field',
        }),
        serviceName: Joi.string().optional().messages({
          'string.base': 'Service Name should be a type of text',
          'string.empty': 'Service Name cannot be an empty field',
        }),
        container1Price: Joi.number().positive().optional().messages({
          'number.base': 'Container1 price should be a type of number',
          'number.positive': 'Container1 price must be a positive number',
        }),
        container2Price: Joi.number().positive().optional().messages({
          'number.base': 'Container2 price should be a type of number',
          'number.positive': 'Container2 price must be a positive number',
        }),
        container3Price: Joi.number().positive().optional().messages({
          'number.base': 'Container3 price should be a type of number',
          'number.positive': 'Container3 price must be a positive number',
        }),
        container4Price: Joi.number().positive().optional().messages({
          'number.base': 'Container4 price should be a type of number',
          'number.positive': 'Container4 price must be a positive number',
        }),
      }),
    )
    .optional()
    .messages({
      'array.base': 'Services should be an array',
    }),
});

const ClientParamsSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.base': 'ID should be a type of text',
    'any.required': 'ID is a required parameter',
  }),
});

function isJoiError(error: unknown): error is Joi.ValidationError {
  return (error as Joi.ValidationError).isJoi !== undefined;
}

export const validateClientReqData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createClientSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    if (isJoiError(error)) {
      const details: Joi.ValidationErrorItem[] = error.details;
      next(new ValidationError('Invalid client parameters', details));
    } else {
      next(error);
    }
  }
};

export const validateUpdatedClientReqData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await updateClientSchema.validateAsync(req.body, { abortEarly: false });
    const { error: paramsError } = ClientParamsSchema.validate(req.params, { abortEarly: false });

    const bodyErrors = [];
    const paramErrors = paramsError ? paramsError.details : [];

    if (paramsError) {
      bodyErrors.push(...paramErrors);
    }

    if (bodyErrors.length > 0) {
      next(new ValidationError('Invalid request data', bodyErrors));
    } else {
      next();
    }
  } catch (error) {
    if (isJoiError(error)) {
      const details: Joi.ValidationErrorItem[] = error.details;
      next(new ValidationError('Invalid client parameters', details));
    } else {
      next(error);
    }
  }
};

export const validateClientApiParams = (req: Request, res: Response, next: NextFunction) => {
  const { error } = ClientParamsSchema.validate(req.params, { abortEarly: false });
  if (error) {
    const details: Joi.ValidationErrorItem[] = error.details;
    next(new ValidationError('Invalid client parameters', details));
  } else {
    next();
  }
};
