import { Encrypter } from './db-account-protocols';
import { DBAddAccount } from './db-add-account';

interface sutType {
  sut: DBAddAccount;
  encrypterStub: Encrypter;
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('hash_password'));
    }
  }
  return new EncrypterStub();
};

const makeSut = (): sutType => {
  const encrypterStub = makeEncrypter();
  const sut = new DBAddAccount(encrypterStub);

  return {
    sut,
    encrypterStub,
  };
};

describe('DBAddAccount Usecases ', () => {
  test('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    await sut.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();

    encrypterStub.encrypt = jest.fn(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    const promise = sut.add(accountData);

    await expect(promise).rejects.toThrow();
  });
});
