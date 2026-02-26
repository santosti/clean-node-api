import { DbAuthentication } from './db-authentication';
import {
  LoadAccountByEmailRepositoy,
  Encrypter,
  HashComparer,
  AccountModel,
  UpdateAccessTokenRepository,
} from './db-authentication-protocols';

interface sutType {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepositoy;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
  hashComparerStub: HashComparer;
  encrypterStub: Encrypter;
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'hashed_password',
});

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepositoy => {
  class LoadAccountByEmailRepositoyStub implements LoadAccountByEmailRepositoy {
    async load(email: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new LoadAccountByEmailRepositoyStub();
};

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update(id: string, token: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new UpdateAccessTokenRepositoryStub();
};

const makehashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new HashComparerStub();
};

const makeEncrypter = (): Encrypter => {
  class EncrypterStubStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('any_token'));
    }
  }
  return new EncrypterStubStub();
};

const makeSut = (): sutType => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
  const hashComparerStub = makehashComparer();
  const encrypterStub = makeEncrypter();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    updateAccessTokenRepositoryStub,
    hashComparerStub,
    encrypterStub
  );

  return {
    loadAccountByEmailRepositoryStub,
    updateAccessTokenRepositoryStub,
    hashComparerStub,
    encrypterStub,
    sut,
  };
};

describe('DBAuthenticaion Usecase ', () => {
  test('should call LoadAccountByEmailRepositoy with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');
    await sut.auth({ email: 'any_email@mail.com', password: 'any_password' });
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('should throw if LoadAccountByEmailRepositoy throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockRejectedValue(new Error());
    const promise = sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    await expect(promise).rejects.toThrow();
  });

  test('should return null if LoadAccountByEmailRepositoy returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(null);
    const accessToken = await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    expect(accessToken).toBeNull();
  });

  test('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, 'compare');
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password');
  });

  test('should throw if hashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValue(new Error());
    const promise = sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    await expect(promise).rejects.toThrow();
  });

  test('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(Promise.resolve(false));
    const accessToken = await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    expect(accessToken).toBeNull();
  });

  test('should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut();
    const generateSpy = jest.spyOn(encrypterStub, 'encrypt');
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    expect(generateSpy).toHaveBeenCalledWith('any_id');
  });

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValue(new Error());
    const promise = sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    await expect(promise).rejects.toThrow();
  });

  test('should returns valid access token', async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    expect(accessToken).toBe('any_token');
  });

  test('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update');
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
  });

  test('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, 'update')
      .mockRejectedValue(new Error());
    const promise = sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    await expect(promise).rejects.toThrow();
  });
});
