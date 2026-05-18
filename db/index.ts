import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// We guarantee process.env.DATABASE_URL is set in .env.local
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
