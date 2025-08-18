import {
  CompareFieldsValidation,
  RequiredFieldValidation,
  ValidationComposite,
  EmailValidation,
} from '../../../presentation/helpers/validators';
import { Validation, EmailValidator } from '@/presentation/protocols';
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
