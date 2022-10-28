import { DBAddAccount } from './db-add-account';

describe('DBAddAccount Usecases ', () => {
  test('should call Encrypter with correct password', async () => {
    class EncrypterStub {
      async encrypt(value: string): Promise<string> {
        return new Promise<string>((resolve) => resolve('hash_password'));
      }
    }
    const encrypterStub = new EncrypterStub();
    const sut = new DBAddAccount(encrypterStub);
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    await sut.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });
});
