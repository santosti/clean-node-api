import { InvalidParamError } from '../../errors/invalid-param-error';
import { Validation } from './validation';

export class CompareFieldsValidation implements Validation {
  private readonly fieldName: string;
  private readonly fieldtoCompareName: string;

  constructor(fieldName: string, fieldtoCompareName: string) {
    this.fieldName = fieldName;
    this.fieldtoCompareName = fieldtoCompareName;
  }

  validate(input: any): Error {
    if (input[this.fieldName] !== input[this.fieldtoCompareName]) {
      return new InvalidParamError(this.fieldtoCompareName);
    }
  }
}
