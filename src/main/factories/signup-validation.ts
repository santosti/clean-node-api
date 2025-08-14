import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { Validation } from '../../presentation/helpers/validators/validation';

export const makeSignUpValidation = (): ValidationComposite => {
  const validators: Validation[] = [];
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validators.push(new RequiredFieldValidation(field));
  }
  validators.push(
    new CompareFieldsValidation('password', 'passwordConfirmation')
  );
  return new ValidationComposite(validators);
};
