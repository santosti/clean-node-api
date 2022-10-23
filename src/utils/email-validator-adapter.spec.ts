import { EmailValidatorAdapter } from './email-validator-adapter';

describe('EmailValidator Adapter ', () => {
  test('should return false if validator returns false', async () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('invalid_email@mail.com');
    expect(isValid).toBeFalsy();
  });
});
