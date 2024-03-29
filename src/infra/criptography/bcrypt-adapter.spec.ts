import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('hash_value'));
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
    await sut.encrypt('any_value');

    expect(bcryptSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('should return a hash on success', async () => {
    const sut = makeSut();
    const hash = await sut.encrypt('any_value');

    expect(hash).toBe('hash_value');
  });

  test('should throw if bcrypt throws', async () => {
    const sut = makeSut();
    bcrypt.hash = jest.fn(async (): Promise<string> => {
      return new Promise((resolve, reject) => reject(new Error()));
    });
    const promise = sut.encrypt('any_value');

    await expect(promise).rejects.toThrow();
  });
});
