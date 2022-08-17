import { HttpRequest, HttpResponse } from '../protocols/http';

export class SignupController {
  handle(httpResponde: HttpRequest): HttpResponse {
    if (!httpResponde.body.name) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name'),
      };
    }

    if (!httpResponde.body.email) {
      return {
        statusCode: 400,
        body: new Error('Missing param: email'),
      };
    }
  }
}
