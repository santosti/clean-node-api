import { MissingParamError } from '../errors/missing-param-error';
import { SignupController } from './signup';

const makeSut = (): SignupController => {
  return new SignupController();
};

describe('Signup Controller ', () => {
  test('should return 400 if no name is provided', () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        email: 'test@example.com',
        password: 'testpassword',
        passwordConfirmation: 'testpassword',
      },
    };

    const httpResponde = sut.handle(httpRequest);

    expect(httpResponde.statusCode).toBe(400);
    expect(httpResponde.body).toEqual(new MissingParamError('name'));
  });

  test('should return 400 if no email is provided', () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        name: 'testname',
        password: 'testpassword',
        passwordConfirmation: 'testpassword',
      },
    };

    const httpResponde = sut.handle(httpRequest);

    expect(httpResponde.statusCode).toBe(400);
    expect(httpResponde.body).toEqual(new MissingParamError('email'));
  });

  test('should return 400 if no password is provided', () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        name: 'testname',
        email: 'test@example.com',
        passwordConfirmation: 'testpassword',
      },
    };

    const httpResponde = sut.handle(httpRequest);

    expect(httpResponde.statusCode).toBe(400);
    expect(httpResponde.body).toEqual(new MissingParamError('password'));
  });

  test('should return 400 if no passwordConfirmation is provided', () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        name: 'testname',
        email: 'test@example.com',
        password: 'testpassword',
      },
    };

    const httpResponde = sut.handle(httpRequest);

    expect(httpResponde.statusCode).toBe(400);
    expect(httpResponde.body).toEqual(
      new MissingParamError('passwordConfirmation')
    );
  });
});
