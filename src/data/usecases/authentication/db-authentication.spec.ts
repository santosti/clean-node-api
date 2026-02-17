import { HashComparer } from '@/data/protocols/criptografhy/hash-compare';
import { LoadAccountByEmailRepositoy } from '../../protocols/db/load-account-by-email-repository';
import { AccountModel } from '../add-account/db-account-protocols';
import { DbAuthentication } from './db-authentication';

interface sutType {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepositoy;
  hashComparerStub: HashComparer;
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

const makehashComparer = (): HashComparer => {
  class hashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new hashComparerStub();
};

const makeSut = (): sutType => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashComparerStub = makehashComparer();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub
  );

  return {
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
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
});
