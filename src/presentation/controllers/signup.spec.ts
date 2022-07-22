import { SignupController } from './signup';

describe('Signup Controller ', () => {
  test('should return 400 if no name is provided', () => {
    const sut = new SignupController();
    const httpRequest = {
      body: {
        mail: 'test@example.com',
        password: 'testpassword',
        passwordConfirmation: 'testpassword',
      },
    };

    const httpResponde = sut.handle(httpRequest);

    expect(httpResponde.statusCode).toBe(400);
    expect(httpResponde.body).toEqual(new Error('Missing param: name'));
  });

  test('should return 400 if no email is provided', () => {
    const sut = new SignupController();
    const httpRequest = {
      body: {
        name: 'testname',
        password: 'testpassword',
        passwordConfirmation: 'testpassword',
      },
    };

    const httpResponde = sut.handle(httpRequest);

    expect(httpResponde.statusCode).toBe(400);
    expect(httpResponde.body).toEqual(new Error('Missing param: email'));
  });
});
