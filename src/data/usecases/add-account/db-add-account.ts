import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  AddAccountRepository,
  Encrypter,
} from './db-account-protocols';

export class DBAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;
  private readonly addAccountRepository: AddAccountRepository;

  constructor(
    encrypter: Encrypter,
    addAccountRepository: AddAccountRepository
  ) {
    this.encrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password);
    return this.addAccountRepository.add(
      Object.assign({}, account, { password: hashedPassword })
    );
  }
}
