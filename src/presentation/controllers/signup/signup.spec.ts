import { AccountModel, AddAccountModel, AddAccount } from './signup-protocols';
import { Validation } from '../../../presentation/helpers/validators/validation';
import { MissingParamError, ServerError } from '../../errors';
import { SignUpController } from './signup';

interface SutTypes {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@example.com',
        password: 'valid_password',
      };
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }

  return new AddAccountStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }

  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();

  const sut = new SignUpController(addAccountStub, validationStub);

  return {
    sut,
    addAccountStub,
    validationStub,
  };
};

describe('Signup Controller ', () => {
  test('should call AddAccount with correct email', async () => {
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

    await sut.handle(httpRequest);

    expect(addSpy).toHaveBeenLastCalledWith({
      name: 'testname',
      email: 'test-email@example.com',
      password: 'testpassword',
    });
  });

  test('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockRejectedValue(new Error());

    const httpRequest = {
      body: {
        name: 'testname',
        email: 'teste-email@example.com',
        password: 'testpassword',
        passwordConfirmation: 'testpassword',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError(null));
  });

  test('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@example.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@example.com',
      password: 'valid_password',
    });
  });

  test('should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@example.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
      },
    };

    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@example.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new MissingParamError('any_field'));
  });
});
