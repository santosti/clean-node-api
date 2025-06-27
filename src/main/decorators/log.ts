import { Controller, HttpResponse } from '@/presentation/protocols';

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller;

  constructor(controller: Controller) {
    this.controller = controller;
  }

  async handle(httpRequest: HttpResponse): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);
    if (httpResponse.statusCode === 500) {
      console.error('An error occurred:', httpResponse.body);
    }
    return httpResponse;
  }
}
