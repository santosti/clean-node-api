import { HashComparer } from '@/data/protocols/criptografhy/hash-compare';
import { LoadAccountByEmailRepositoy } from '@/data/protocols/db/load-account-by-email-repository';
import {
  Authentication,
  AuthenticationModel,
} from '@/domain/usecases/authentication';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepositoy;
  private readonly hashComparer: HashComparer;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepositoy,
    hashComparer: HashComparer
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
  }
  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email
    );
    if (account) {
      await this.hashComparer.compare(
        authentication.password,
        account.password
      );
    }
    return null;
  }
}
