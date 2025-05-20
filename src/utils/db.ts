import process from 'node:process';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { schema } from '@/schema';
export const db = drizzle(postgres(process.env.DB_URL), { schema });
