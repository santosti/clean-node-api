import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  AddAccountRepository,
  Hasher,
} from './db-account-protocols';

export class DBAddAccount implements AddAccount {
  private readonly hasher: Hasher;
  private readonly addAccountRepository: AddAccountRepository;

  constructor(hasher: Hasher, addAccountRepository: AddAccountRepository) {
    this.hasher = hasher;
    this.addAccountRepository = addAccountRepository;
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(account.password);
    return this.addAccountRepository.add(
      Object.assign({}, account, { password: hashedPassword })
    );
  }
}
