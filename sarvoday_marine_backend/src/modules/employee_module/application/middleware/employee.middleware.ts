// import { UserRoles } from '@src/shared/enum/user_roles.enum';
// import { ValidationError } from '@src/shared/utils/exceptions/validation_error.exception';
// import Email from '@src/shared/valueIbjects/email';
// import { Request, Response, NextFunction } from 'express';
// import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';
// import Joi, { CustomHelpers, string } from 'joi';
// import { ObjectId } from 'mongodb';

// const phoneNumberUtil = PhoneNumberUtil.getInstance();

// const objectIdValidation = (value: any, helpers: CustomHelpers) => {
//   if (!ObjectId.isValid(value)) {
//     return helpers.error('any.invalid');
//   }
//   return value;
// };

// const mobileNumberValidator = (value: string, helper: CustomHelpers<string>) => {
//   try {
//     const phoneNumber = `${value}`;
//     const parsedNumber = phoneNumberUtil.parse(phoneNumber, 'IN');

//     if (!phoneNumberUtil.isValidNumber(parsedNumber)) {
//       return helper.message({ custom: 'Invalid mobile number format' });
//     }
//     const formattedNumber = phoneNumberUtil.format(parsedNumber, PhoneNumberFormat.E164);
//     return formattedNumber;
//   } catch (error) {
//     console.error('Error validating phone number:', error);
//     return helper.message({ custom: 'Invalid mobile number format' });
//   }
// };

// const emailValidation = async (value: string, helper: CustomHelpers<string>) => {
//   try {
//     const email = new Email(value);
//     await email.validate();
//     return email.getValue();
//   } catch (error) {
//     return helper.message({ custom: 'Invalid email address' });
//   }
// };

// const createEmployeeSchema = Joi.object({
//   firstName: Joi.string().min(3).required(),
//   lastName: Joi.string().min(3).required(),
//   email: Joi.string().email().custom(emailValidation).required(),
//   countryCode: Joi.string()
//     .required()
//     .min(1)
//     .max(4)
//     .pattern(/^\+\d+$/),
//   mobile: Joi.string().required().custom(mobileNumberValidator, 'Mobile number validation'),
//   userRole: Joi.string()
//     .valid(...Object.values(UserRoles))
//     .required(),
//   assignLocations: Joi.array().required(),
// });

// const updateEmployeeSchema = Joi.object({
//   firstName: Joi.string().min(3).optional(),
//   lastName: Joi.string().min(3).optional(),
//   email: Joi.string().email().custom(emailValidation).optional(),
//   countryCode: Joi.string()
//     .min(1)
//     .max(4)
//     .pattern(/^\+\d+$/)
//     .optional(),
//   mobile: Joi.string().optional().custom(mobileNumberValidator, 'Mobile number validation'),
//   UserRoles: Joi.string()
//     .valid(...Object.values(UserRoles))
//     .optional(),
//   assignLocations: Joi.string().optional(),
// });

// const EmployeeParamsSchema = Joi.object({
//   id: Joi.string().custom(objectIdValidation, 'ObjectId validation').optional(),
//   locationName: Joi.string().min(3).optional(),
// });

// export const validateEmployeeRequestBody = async (req: Request, res: Response, next: NextFunction) => {
//   const { error } = await createEmployeeSchema.validateAsync(req.body);
//   if (error) {
//     const details = [...(error?.details || [])];
//     next(new ValidationError('Invalid service data', details));
//   }
//   next();
// };

// export const validateUpdatedEmployeeReqData = (req: Request, res: Response, next: NextFunction) => {
//   const { error } = updateEmployeeSchema.validate(req.body, { abortEarly: false });
//   const { error: paramsError } = EmployeeParamsSchema.validate(req.params);

//   if (error || paramsError) {
//     const details = [...(error?.details || []), ...(paramsError?.details || [])];
//     next(new ValidationError('Invalid service data', details));
//   } else {
//     next();
//   }
// };

// export const validateEmployeeApiParams = (req: Request, res: Response, next: NextFunction) => {
//   const { error } = EmployeeParamsSchema.validate(req.params);
//   if (error) {
//     const details = [...(error?.details || [])];
//     next(new ValidationError('Invalid service data', details));
//   } else {
//     next();
//   }
// };
