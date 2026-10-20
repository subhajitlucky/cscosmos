import { Pool } from "pg";

let pool: Pool | null = null;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool(): Pool {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      ssl:
        process.env.DATABASE_SSL === "disable"
          ? false
          : { rejectUnauthorized: false },
    });
  }

  return pool;
}
