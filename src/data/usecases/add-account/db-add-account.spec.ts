import { Encrypter } from '@/data/protocols/encrypter';
import { DBAddAccount } from './db-add-account';

interface sutType {
  sut: DBAddAccount;
  encrypterStub: Encrypter;
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise<string>((resolve) => resolve('hash_password'));
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
});
