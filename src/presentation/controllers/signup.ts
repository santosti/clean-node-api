export class SignupController {
  handle(httpResponde: any): any {
    if (!httpResponde.body.name) {
      return {
        statusCode: 400,
        body: new Error('missing param: name'),
      };
    }

    if (!httpResponde.body.email) {
      return {
        statusCode: 400,
        body: new Error('missing param: email'),
      };
    }
  }
}
