import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log';
import { SignUpController } from '../../presentation/controllers/signup/signup';
import { DBAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter';
import { LogControllerDecorator } from '../decorators/log';
import { Controller } from '../../presentation/protocols';
import { makeSignUpValidation } from './signup-validation';

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DBAddAccount(bcryptAdapter, accountMongoRepository);
  const signUpController = new SignUpController(
    dbAddAccount,
    makeSignUpValidation()
  );
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
// This function creates an instance of SignUpController with all its dependencies.
// It uses EmailValidatorAdapter for email validation, BcryptAdapter for password encryption,
// and DBAddAccount for adding accounts to the database.
// The salt value for BcryptAdapter is set to 12, which is a common value for bcrypt hashing.
// The AccountMongoRepository is used to interact with the MongoDB database for account operations.
// The makeSignUpController function encapsulates the creation of the SignUpController,
// making it easier to manage dependencies and maintain the code.
// This approach follows the Dependency Injection pattern, allowing for better testability and separation of concerns.
// The SignUpController can now be used in the application to handle user sign-up requests,
// validating the input data, checking the email format, and storing the new account in the database.
// The code is structured to allow for easy modifications and extensions in the future,
// such as changing the hashing algorithm or the database implementation without affecting the controller logic.
