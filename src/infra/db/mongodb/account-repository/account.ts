import { AddAccountRepository } from '@/data/protocols/db/add-account-repository';
import { AddAccountModel } from '@/domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';
import { AccountModel } from '@/domain/models/account';

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getConnection('accounts');
    const { insertedId } = await accountCollection.insertOne(accountData);
    return MongoHelper.map(insertedId);
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getConnection('accounts');
    const account = await accountCollection.findOne({ email });
    return account && MongoHelper.map(account);
  }
}
