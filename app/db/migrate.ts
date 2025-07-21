import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { DATABASE_URL } from "../utilities/env";

const sqlite = new Database(DATABASE_URL);
const db = drizzle(sqlite);
migrate(db, { migrationsFolder: "./drizzle" });
