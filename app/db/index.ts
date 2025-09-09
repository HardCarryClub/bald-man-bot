import { Database } from "bun:sqlite";
import { DATABASE_URL } from "@app/utilities/config";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";

const sqlite = new Database(DATABASE_URL);
export const db = drizzle({
  client: sqlite,
  schema,
});
