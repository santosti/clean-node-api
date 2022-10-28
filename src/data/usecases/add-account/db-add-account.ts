import { Encrypter } from '@/data/protocols/encrypter';
import { AccountModel } from '@/domain/models/account';
import { AddAccount, AddAccountModel } from '@/domain/usecases/add-account';

export class DBAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;

  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter;
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);
    return new Promise<AccountModel>((resolve) => resolve(null));
  }
}
