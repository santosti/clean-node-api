import {
  LoadAccountByEmailRepositoy,
  Encrypter,
  HashComparer,
  UpdateAccessTokenRepository,
} from './db-authentication-protocols';
import {
  Authentication,
  AuthenticationModel,
} from '@/domain/usecases/authentication';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepositoy;
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository;
  private readonly hashComparer: HashComparer;
  private readonly encrypter: Encrypter;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepositoy,
    updateAccessTokenRepository: UpdateAccessTokenRepository,
    hashComparer: HashComparer,
    encrypter: Encrypter
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.updateAccessTokenRepository = updateAccessTokenRepository;
    this.hashComparer = hashComparer;
    this.encrypter = encrypter;
  }
  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadAccountByEmail(
      authentication.email
    );
    if (account) {
      const isValid = await this.hashComparer.compare(
        authentication.password,
        account.password
      );
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id);
        await this.updateAccessTokenRepository.updateAccessToken(
          account.id,
          accessToken
        );
        return accessToken;
      }
    }
    return null;
  }
}
