import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation';
import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields-validation';
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite';
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation';
import { Validation } from '../../../presentation/protocols/validation';
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
