import { HashCompare } from '@/data/protocols/criptografhy/hash-compare';
import { LoadAccountByEmailRepositoy } from '@/data/protocols/db/load-account-by-email-repository';
import {
  Authentication,
  AuthenticationModel,
} from '@/domain/usecases/authentication';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepositoy;
  private readonly hashCompare: HashCompare;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepositoy,
    hashCompare: HashCompare
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashCompare = hashCompare;
  }
  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email
    );
    if (account) {
      await this.hashCompare.compare(authentication.password, account.password);
    }
    return null;
  }
}
