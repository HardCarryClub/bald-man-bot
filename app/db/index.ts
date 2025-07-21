import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { DATABASE_URL } from "../utilities/env";
import * as schema from "./schema";

const sqlite = new Database(DATABASE_URL);
export const database = drizzle({
  client: sqlite,
  schema,
});
