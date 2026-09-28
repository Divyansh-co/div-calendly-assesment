import { neon } from "@neondatabase/serverless";
import * as fs from "node:fs";
import * as path from "node:path";

async function runMigration(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  const schemaPath = path.resolve(process.cwd(), "db/schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf-8");

  console.log("Applying database migrations...");
  await sql(schema);
  console.log("Database migrations applied successfully.");
}

runMigration().catch((err: unknown) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
