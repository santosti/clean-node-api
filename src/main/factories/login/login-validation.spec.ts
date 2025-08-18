import {
  RequiredFieldValidation,
  ValidationComposite,
  EmailValidation,
} from '../../../presentation/helpers/validators';
import { Validation, EmailValidator } from '@/presentation/protocols';
import { makeLoginValidation } from './login-validation';

jest.mock('../../../presentation/helpers/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};
describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validators', () => {
    makeLoginValidation();
    const validators: Validation[] = [];
    for (const field of ['email', 'password']) {
      validators.push(new RequiredFieldValidation(field));
    }
    validators.push(new EmailValidation('email', makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validators);
  });
});
