import { AddAccountRepository } from '@/data/protocols/db/add-account-repository';
import { AddAccountModel } from '@/domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository {
  // TODO: Retornar tipo correto
  async add(accountData: AddAccountModel): Promise<any> {
    const accountCollection = await MongoHelper.getConnection('accounts');
    const { insertedId } = await accountCollection.insertOne(accountData);
    return insertedId;
  }
}
