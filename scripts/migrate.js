const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
require("dotenv").config({ path: path.join(process.cwd(), ".env.local") });

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("Configura DATABASE_URL antes de migrar.");
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query(fs.readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf8"));
  await client.end();
  console.log("Base de datos inicializada.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
