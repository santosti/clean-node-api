import { AccountModel } from '@/domain/models/account';

export interface LoadAccountByEmailRepositoy {
  loadAccountByEmail(email: string): Promise<AccountModel>;
}
