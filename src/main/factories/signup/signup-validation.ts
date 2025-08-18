import {
  CompareFieldsValidation,
  RequiredFieldValidation,
  ValidationComposite,
  EmailValidation,
} from '../../../presentation/helpers/validators';
import { Validation } from '@/presentation/protocols';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';

export const makeSignUpValidation = (): ValidationComposite => {
  const validators: Validation[] = [];
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validators.push(new RequiredFieldValidation(field));
  }
  validators.push(
    new CompareFieldsValidation('password', 'passwordConfirmation')
  );
  validators.push(new EmailValidation('email', new EmailValidatorAdapter()));
  return new ValidationComposite(validators);
};
