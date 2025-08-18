import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation';
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite';
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation';
import { Validation } from '../../../presentation/helpers/validators/validation';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';

export const makeLoginValidation = (): ValidationComposite => {
  const validators: Validation[] = [];
  for (const field of ['email', 'password']) {
    validators.push(new RequiredFieldValidation(field));
  }
  validators.push(new EmailValidation('email', new EmailValidatorAdapter()));
  return new ValidationComposite(validators);
};
