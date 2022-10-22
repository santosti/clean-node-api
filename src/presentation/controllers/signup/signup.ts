import { MissingParamError, InvalidParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/http-helper';
import {
  AddAccount,
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from './signup-protocols';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  handle(httpResquest: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ];

      for (const field of requiredFields) {
        if (!httpResquest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { name, password, passwordConfirmation, email } = httpResquest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'));
      }

      const account = this.addAccount.add({ name, email, password });

      return {
        statusCode: 200,
        body: account,
      };
    } catch (error) {
      return serverError();
    }
  }
}
