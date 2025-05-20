import process from 'node:process';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import drizzleConfig from '../drizzle.config';
import 'dotenv/config';

async function main() {
  const connection = postgres(process.env.DB_URL, { max: 1 });
  await migrate(drizzle(connection), { migrationsFolder: drizzleConfig.out });
  await connection.end();
}

main();
