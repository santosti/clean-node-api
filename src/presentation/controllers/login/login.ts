import { MissingParamError } from '../../../presentation/errors';
import { badRequest } from '../../../presentation/helpers/http-helper';
import { HttpRequest, HttpResponse } from '../../../presentation/protocols';
import { Controller } from '../../../presentation/protocols/controller';
import { EmailValidator } from '../signup/signup-protocols';

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return new Promise((resolve) =>
        resolve(badRequest(new MissingParamError('email')))
      );
    }

    if (!httpRequest.body.password) {
      return new Promise((resolve) =>
        resolve(badRequest(new MissingParamError('password')))
      );
    }

    this.emailValidator.isValid(httpRequest.body.email);
  }
}
