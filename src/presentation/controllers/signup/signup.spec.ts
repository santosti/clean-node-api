import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from '../../errors';
import {
  AccountModel,
  AddAccountModel,
  AddAccount,
  EmailValidator,
} from './signup-protocols';
import { SignUpController } from './signup';

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
      };
      return fakeAccount;
    }
  }

  return new AddAccountStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();

  const sut = new SignUpController(emailValidatorStub, addAccountStub);

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
  };
};

describe('Signup Controller ', () => {
  test('should return 400 if no name is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'test@example.com',
        password: 'testpassword',
        passwordConfirmation: 'testpassword',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('should return 400 if no email is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'testname',
        password: 'testpassword',
        passwordConfirmation: 'testpassword',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  test('should return 400 if no password is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'testname',
        email: 'test@example.com',
        passwordConfirmation: 'testpassword',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'testname',
        email: 'test@example.com',
        password: 'testpassword',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    );
  });

  test('should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut();

    emailValidatorStub.isValid = jest.fn(() => false);

    const httpRequest = {
      body: {
        name: 'testname',
        email: 'invalid-email@example.com',
        password: 'testpassword',
        passwordConfirmation: 'testpassword',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  test('should return 400 if confirmation fails', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'testname',
        email: 'teste-email@example.com',
        password: 'testpassword',
        passwordConfirmation: 'invalidpassword',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation')
    );
  });

  test('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = {
      body: {
        name: 'testname',
        email: 'invalid-email@example.com',
        password: 'testpassword',
        passwordConfirmation: 'testpassword',
      },
    };

    sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenLastCalledWith('invalid-email@example.com');
  });

  test('should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut();

    emailValidatorStub.isValid = jest.fn(() => {
      throw new Error();
    });

    const httpRequest = {
      body: {
        name: 'testname',
        email: 'teste-email@example.com',
        password: 'testpassword',
        passwordConfirmation: 'testpassword',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test('should call AddAccount with correct email', () => {
    const { sut, addAccountStub } = makeSut();

    const addSpy = jest.spyOn(addAccountStub, 'add');

    const httpRequest = {
      body: {
        name: 'testname',
        email: 'test-email@example.com',
        password: 'testpassword',
        passwordConfirmation: 'testpassword',
      },
    };

    sut.handle(httpRequest);

    expect(addSpy).toHaveBeenLastCalledWith({
      name: 'testname',
      email: 'test-email@example.com',
      password: 'testpassword',
    });
  });

  test('should return 500 if AddAccount throws', () => {
    const { sut, addAccountStub } = makeSut();

    addAccountStub.add = jest.fn(() => {
      throw new Error();
    });

    const httpRequest = {
      body: {
        name: 'testname',
        email: 'teste-email@example.com',
        password: 'testpassword',
        passwordConfirmation: 'testpassword',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});
