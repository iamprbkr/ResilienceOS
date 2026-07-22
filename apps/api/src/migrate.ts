import { pool, runMigrations } from "./repositories/postgresClient.js";

await runMigrations();
await pool.end();
console.log("PostgreSQL migrations applied");
