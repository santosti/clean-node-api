import { HttpRequest, HttpResponse } from './http';

export interface Controller {
  handle(httpResponse: HttpRequest): Promise<HttpResponse>;
}
