import { HashCompare } from '@/data/protocols/criptografhy/hash-compare';
import { LoadAccountByEmailRepositoy } from '../../protocols/db/load-account-by-email-repository';
import { AccountModel } from '../add-account/db-account-protocols';
import { DbAuthentication } from './db-authentication';

interface sutType {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepositoy;
  hashCompareStub: HashCompare;
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

const makeHashCompare = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new HashCompareStub();
};

const makeSut = (): sutType => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashCompareStub = makeHashCompare();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub
  );

  return {
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
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

  test('should call HashCompare with correct values', async () => {
    const { sut, hashCompareStub } = makeSut();
    const compareSpy = jest.spyOn(hashCompareStub, 'compare');
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password');
  });
});
