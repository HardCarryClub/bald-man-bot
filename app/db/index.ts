import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

const sqlite = new Database("data/database.sqlite");

export const database = drizzle({ client: sqlite });
