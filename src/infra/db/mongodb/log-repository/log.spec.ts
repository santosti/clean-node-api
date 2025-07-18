import { Collection } from 'mongodb';

import { MongoHelper } from '../helpers/mongo-helper';
import env from '../../../../main/config/env';
import { LogMongoRepository } from './log';

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository();
};
describe('Log Mongo Repository', () => {
  let errorCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    errorCollection = await MongoHelper.getConnection('errors');
    await errorCollection.deleteMany({});
  });

  test('Should create an error log on success', async () => {
    const sut = makeSut();
    await sut.logError('any_error_stack');
    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});
