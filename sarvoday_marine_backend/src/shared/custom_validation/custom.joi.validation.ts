import Email from '@src/shared/valueIbjects/email';
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';
import { CustomHelpers } from 'joi';

const phoneNumberUtil = PhoneNumberUtil.getInstance();

export const mobileNumberValidator = (value: string, helper: CustomHelpers<string>) => {
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

export const emailValidation = async (value: string, helper: CustomHelpers<string>) => {
  try {
    const email = new Email(value);
    await email.validate();
    return email.getValue();
  } catch (error) {
    return helper.message({ custom: 'Invalid email address' });
  }
};
