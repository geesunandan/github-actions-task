import * as bcrypt from 'bcrypt';

import { appConfig } from '@/config/appConfig';

export type HmacEncoding = 'hex' | 'base64';

export async function hash(value: string): Promise<string> {
  const saltRounds = parseInt(appConfig.auth.saltRounds, 10);

  return bcrypt.hash(value, saltRounds);
}

export async function compareWithHashValue(value: string, hashedValue: string): Promise<boolean> {
  return bcrypt.compare(value, hashedValue);
}
