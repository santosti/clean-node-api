import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './accounts';

describe('Account mongo repository ', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGODB_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    await MongoHelper.removeAll('accounts');
  });

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  };

  test('should return an account on success', async () => {
    const sut = makeSut();

    const account = await sut.add({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    });

    expect(account).toBeTruthy();
  });
});
