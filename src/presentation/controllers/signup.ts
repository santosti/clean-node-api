import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helpers/http-helper';
import { HttpRequest, HttpResponse } from '../protocols/http';

export class SignupController {
  handle(httpResponde: HttpRequest): HttpResponse {
    if (!httpResponde.body.name) {
      return badRequest(new MissingParamError('name'));
    }

    if (!httpResponde.body.email) {
      return badRequest(new MissingParamError('email'));
    }
  }
}
