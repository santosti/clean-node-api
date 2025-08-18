import { badRequest, ok, serverError } from '../../helpers/http/http-helper';
import {
  AddAccount,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from './signup-protocols';

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount;
  private readonly validation: Validation;

  constructor(addAccount: AddAccount, validation: Validation) {
    this.addAccount = addAccount;
    this.validation = validation;
  }

  async handle(httpResquest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpResquest.body);

      if (error) {
        return badRequest(error);
      }

      const { name, password, email } = httpResquest.body;
      const account = await this.addAccount.add({ name, email, password });

      return ok(account);
    } catch (error) {
      return serverError(error);
    }
  }
}
