import { HttpRequest, HttpResponse } from './http';

export interface Controller {
  handle(httpResponde: HttpRequest): HttpResponse;
}
