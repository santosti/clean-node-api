import { HashComparer } from '@/data/protocols/criptografhy/hash-compare';
import { TokenGenerator } from '@/data/protocols/criptografhy/token-generator';
import { LoadAccountByEmailRepositoy } from '@/data/protocols/db/load-account-by-email-repository';
import {
  Authentication,
  AuthenticationModel,
} from '@/domain/usecases/authentication';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepositoy;
  private readonly hashComparer: HashComparer;
  private readonly tokenGenerator: TokenGenerator;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepositoy,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
    this.tokenGenerator = tokenGenerator;
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
      await this.tokenGenerator.generate(account.id);
    }
    return null;
  }
}
