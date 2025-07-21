import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const pugBans = sqliteTable("pug_bans", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull(),
  reason: text("reason"),
});
