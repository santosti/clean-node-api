import { LoadAccountByEmailRepositoy } from '@/data/protocols/load-account-by-email-repository';
import {
  Authentication,
  AuthenticationModel,
} from '@/domain/usecases/authentication';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepositoy;
  constructor(loadAccountByEmailRepository: LoadAccountByEmailRepositoy) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
  }
  async auth(authentication: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(authentication.email);
    return 'any_token';
  }
}
