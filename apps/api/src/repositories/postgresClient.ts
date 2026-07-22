import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.PG_POOL_MAX ?? 10),
  idleTimeoutMillis: 30_000
});

export async function runMigrations() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../");
  const migrationDir = path.join(root, "migrations");
  const migrations = ["001_init.sql", "002_seed.sql"];

  for (const migration of migrations) {
    const sql = await readFile(path.join(migrationDir, migration), "utf8");
    await pool.query(sql);
  }
}
