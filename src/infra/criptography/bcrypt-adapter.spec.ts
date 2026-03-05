import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('hash_value'));
  },
  async compare(): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  },
}));

const salt = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('Bcrypt Adapter ', () => {
  test('should call Bcrypt with correct values', async () => {
    const sut = makeSut();
    const bcryptSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hash('any_value');

    expect(bcryptSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('should return a valid hash on hash success', async () => {
    const sut = makeSut();
    const hash = await sut.hash('any_value');
    expect(hash).toBe('hash_value');
  });

  test('should throw if bcrypt throws', async () => {
    const sut = makeSut();
    bcrypt.hash = jest.fn(async (): Promise<string> => {
      return new Promise((resolve, reject) => reject(new Error()));
    });
    const promise = sut.hash('any_value');

    await expect(promise).rejects.toThrow();
  });

  test('should call Compare with correct values', async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    await sut.compare('any_value', 'any_hash');

    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
  });
});
