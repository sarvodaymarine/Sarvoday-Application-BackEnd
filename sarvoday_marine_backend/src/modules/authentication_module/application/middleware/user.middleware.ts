import { UserRoles } from '@src/shared/enum/user_roles.enum';
import Email from '@src/shared/valueIbjects/email';
import { Request, Response, NextFunction } from 'express';
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';
import Joi, { CustomHelpers } from 'joi';

const phoneNumberUtil = PhoneNumberUtil.getInstance();

const mobileNumberValidator = (value: string, helper: CustomHelpers<string>) => {
  try {
    const phoneNumber = `${value}`;
    const parsedNumber = phoneNumberUtil.parse(phoneNumber, 'IN');

    if (!phoneNumberUtil.isValidNumber(parsedNumber)) {
      return helper.message({ custom: 'Invalid mobile number format' });
    }
    const formattedNumber = phoneNumberUtil.format(parsedNumber, PhoneNumberFormat.E164);
    return formattedNumber;
  } catch (error) {
    console.error('Error validating phone number:', error);
    return helper.message({ custom: 'Invalid mobile number format' });
  }
};

const emailValidation = async (value: string, helper: CustomHelpers<string>) => {
  try {
    const email = new Email(value);
    await email.validate();
    return email.getValue();
  } catch (error) {
    console.error('Error Invalid email address:', error);
    return helper.message({ custom: 'Invalid email address' });
  }
};

const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().custom(emailValidation).required(),
  // password: Joi.string().min(8).required(),
  countryCode: Joi.string()
    .required()
    .min(1)
    .max(4)
    .pattern(/^\+\d+$/),
  mobile: Joi.string().required().custom(mobileNumberValidator, 'Mobile number validation'),
  userRole: Joi.string()
    .valid(...Object.values(UserRoles))
    .required(),
});

const userCredential = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const validateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = await userSchema.validateAsync(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateLoginCredentical = (req: Request, res: Response, next: NextFunction) => {
  const { error } = userCredential.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
