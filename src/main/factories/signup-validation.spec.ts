import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation';
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { Validation } from '../../presentation/helpers/validators/validation';
import { makeSignUpValidation } from './signup-validation';

jest.mock('../../presentation/helpers/validators/validation-composite');
describe('SignupValidation Factory', () => {
  test('Should call ValidationComposite with all validators', () => {
    makeSignUpValidation();
    const validators: Validation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validators.push(new RequiredFieldValidation(field));
    }
    validators.push(
      new CompareFieldsValidation('password', 'passwordConfirmation')
    );
    expect(ValidationComposite).toHaveBeenCalledWith(validators);
  });
});
