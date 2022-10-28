import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  Encrypter,
} from './db-account-protocols';
import { DBAddAccount } from './db-add-account';

interface sutType {
  sut: DBAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('hash_password'));
    }
  }
  return new EncrypterStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositorySub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password',
      };
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new AddAccountRepositorySub();
};

const makeSut = (): sutType => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DBAddAccount(encrypterStub, addAccountRepositoryStub);

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
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

  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    await sut.add(accountData);

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hash_password',
    });
  });

  test('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();

    addAccountRepositoryStub.add = jest.fn(async () => {
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
