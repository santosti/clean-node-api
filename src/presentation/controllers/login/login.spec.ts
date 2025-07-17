import { EmailValidator, Authentication } from './login-protocols';
import { LoginController } from './login';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '../../../presentation/helpers/http-helper';
import {
  InvalidParamError,
  MissingParamError,
} from '../../../presentation/errors';

interface SutTypes {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
}

const makeEmailValidator = (): EmailValidator => {
  class EmaiValidatorStub implements EmailValidator {
    isValid(_email: string): boolean {
      return true;
    }
  }
  return new EmaiValidatorStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    auth(email: string, password: string): Promise<string> {
      return new Promise((resolve) => resolve('any_token'));
    }
  }
  return new AuthenticationStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication();
  const sut = new LoginController(emailValidatorStub, authenticationStub);
  return { sut, emailValidatorStub, authenticationStub };
};

describe('Login Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };
    const HttpResponse = await sut.handle(httpRequest);
    expect(HttpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const HttpResponse = await sut.handle(httpRequest);
    expect(HttpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
      },
    };
    const HttpResponse = await sut.handle(httpRequest);
    expect(HttpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com');
  });

  test('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };
    const authSpy = jest.spyOn(authenticationStub, 'auth');
    await sut.handle(httpRequest);
    expect(authSpy).toHaveBeenCalledWith('any_email@email.com', 'any_password');
  });

  test('should return 401 if invalid credentials provided', async () => {
    const { sut, authenticationStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(unauthorized());
  });

  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
  });
});
