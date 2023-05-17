import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import request from 'supertest';
import app from '../config/app';
import env from '../config/env';

describe('Signup Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = MongoHelper.getConnection('accounts');
    await accountCollection.deleteMany({});
  });

  test('Should return an account on sucess', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: '123',
        passwordConfirmation: '123',
      })
      .expect(200);
  });
});
