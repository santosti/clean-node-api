import { MongoHelper as sut } from './mongo-helper';
describe('MongoHelper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  test('Should reconnect if mondodb is down', async () => {
    let accountCollection = await sut.getConnection('accounts');
    expect(accountCollection).toBeTruthy();
    await sut.disconnect();
    accountCollection = await sut.getConnection('accounts');
    expect(accountCollection).toBeTruthy();
  });
});
