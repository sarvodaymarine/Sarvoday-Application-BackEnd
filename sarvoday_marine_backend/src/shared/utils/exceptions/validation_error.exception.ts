import Joi, { ValidationErrorItem } from 'joi';

export class ValidationError extends Error {
  details: ValidationErrorItem[];

  constructor(message: string, details: ValidationErrorItem[]) {
    super(message);
    this.details = details;
    this.name = 'ValidationError';
  }
}
