import {
  RequiredFieldValidation,
  ValidationComposite,
  EmailValidation,
} from '../../../presentation/helpers/validators';
import { Validation } from '@/presentation/protocols';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';

export const makeLoginValidation = (): ValidationComposite => {
  const validators: Validation[] = [];
  for (const field of ['email', 'password']) {
    validators.push(new RequiredFieldValidation(field));
  }
  validators.push(new EmailValidation('email', new EmailValidatorAdapter()));
  return new ValidationComposite(validators);
};
