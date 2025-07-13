import { badRequest } from '../../../presentation/helpers/http-helper';
import { MissingParamError } from '../../../presentation/errors';
import { LoginController } from './login';

interface SutTypes {
  sut: LoginController;
}

const makeSut = (): SutTypes => {
  const sut = new LoginController();
  return { sut };
};

describe('Login Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };

    sut.handle(httpRequest);
    const HttpResponse = await sut.handle(httpRequest);
    expect(HttpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
      },
    };

    sut.handle(httpRequest);
    const HttpResponse = await sut.handle(httpRequest);
    expect(HttpResponse).toEqual(badRequest(new MissingParamError('password')));
  });
});
