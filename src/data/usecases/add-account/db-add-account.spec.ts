import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  Hasher,
} from './db-account-protocols';
import { DBAddAccount } from './db-add-account';

interface sutType {
  sut: DBAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(_value: string): Promise<string> {
      return new Promise((resolve) => resolve('hash_password'));
    }
  }
  return new HasherStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositorySub implements AddAccountRepository {
    async add(_accountData: AddAccountModel): Promise<AccountModel> {
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
  const hasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DBAddAccount(hasherStub, addAccountRepositoryStub);

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
  };
};

describe('DBAddAccount Usecases ', () => {
  test('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();

    const hasherSpy = jest.spyOn(hasherStub, 'hash');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    await sut.add(accountData);

    expect(hasherSpy).toHaveBeenCalledWith('valid_password');
  });

  test('should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut();

    jest.spyOn(hasherStub, 'hash').mockRejectedValue(new Error());

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
    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValue(new Error());

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  test('should return an account on success', async () => {
    const { sut } = makeSut();

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    const account = await sut.add(accountData);
    expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password',
    });
  });
});
