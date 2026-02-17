import { HashComparer } from '@/data/protocols/criptografhy/hash-compare';
import { TokenGenerator } from '@/data/protocols/criptografhy/token-generator';
import { LoadAccountByEmailRepositoy } from '@/data/protocols/db/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '@/data/protocols/db/update-access-token-repository';
import {
  Authentication,
  AuthenticationModel,
} from '@/domain/usecases/authentication';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepositoy;
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository;
  private readonly hashComparer: HashComparer;
  private readonly tokenGenerator: TokenGenerator;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepositoy,
    updateAccessTokenRepository: UpdateAccessTokenRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.updateAccessTokenRepository = updateAccessTokenRepository;
    this.hashComparer = hashComparer;
    this.tokenGenerator = tokenGenerator;
  }
  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email
    );
    if (account) {
      const isValid = await this.hashComparer.compare(
        authentication.password,
        account.password
      );
      if (isValid) {
        const accessToken = await this.tokenGenerator.generate(account.id);
        await this.updateAccessTokenRepository.update(account.id, accessToken);
        return accessToken;
      }
    }
    return null;
  }
}
