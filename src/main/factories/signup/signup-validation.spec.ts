import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields-validation';
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation';
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite';
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation';
import { Validation } from '../../../presentation/helpers/validators/validation';
import { EmailValidator } from '../../../presentation/protocols/email-validator';
import { makeSignUpValidation } from './signup-validation';

jest.mock('../../../presentation/helpers/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};
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
    validators.push(new EmailValidation('email', makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validators);
  });
});
