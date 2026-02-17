import { AccountModel } from '@/domain/models/account';

export interface LoadAccountByEmailRepositoy {
  load(email: string): Promise<AccountModel>;
}
