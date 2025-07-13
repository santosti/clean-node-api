import { MissingParamError } from '../../../presentation/errors';
import { badRequest } from '../../../presentation/helpers/http-helper';
import { HttpRequest, HttpResponse } from '../../../presentation/protocols';
import { Controller } from '../../../presentation/protocols/controller';

export class LoginController implements Controller {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    return new Promise((resolve) =>
      resolve(badRequest(new MissingParamError('email')))
    );
  }
}
