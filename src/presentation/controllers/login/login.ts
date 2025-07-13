import { MissingParamError } from '../../../presentation/errors';
import { badRequest } from '../../../presentation/helpers/http-helper';
import { HttpRequest, HttpResponse } from '../../../presentation/protocols';
import { Controller } from '../../../presentation/protocols/controller';

export class LoginController implements Controller {
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
  }
}
