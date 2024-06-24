import { execSync } from 'child_process';
import { join } from 'path';

import { PrismaClient } from '@prisma/client';
import { v4 } from 'uuid';

const generateDatabaseURL = (schema: string) => {
  if (!process.env.POSTGRES_DB_CONNECTION_URL) {
    throw new Error('POSTGRES_DB_CONNECTION_URL has not been defined');
  }

  return process.env.POSTGRES_DB_CONNECTION_URL + `?schema=${schema}`;
};

const schemaId = `test-${v4()}`;
const prismaBinary = join(__dirname, '..', '..', '..', 'node_modules', '.bin', 'prisma');
const url = generateDatabaseURL(schemaId);

const prisma = new PrismaClient({
  datasources: { db: { url } }
});

beforeEach(async () => {
  await prisma.$connect();
  execSync(`${prismaBinary} db push`, {
    env: {
      ...process.env,
      POSTGRES_DB_CONNECTION_URL: generateDatabaseURL(schemaId)
    }
  });
});

afterEach(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE;`);
  await prisma.$disconnect();
});

export default prisma;
