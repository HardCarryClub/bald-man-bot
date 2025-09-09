import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const pugLobby = sqliteTable("pug_lobby", {
  id: integer("id").primaryKey(),
  categoryId: text("category_id").notNull(),
  game: text("game").notNull(),
  createdAt: text("created_at").notNull(),
  createdBy: text("created_by").notNull(),
  deletedAt: text("deleted_at"),
  deletedBy: text("deleted_by"),
});
export type SelectPugLobby = typeof pugLobby.$inferSelect;
export type InsertPugLobby = typeof pugLobby.$inferInsert;

export const pugBan = sqliteTable("pug_ban", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull(),
  reason: text("reason"),
  createdAt: text("created_at").notNull(),
  createdBy: text("created_by").notNull(),
});
export type SelectPugBan = typeof pugBan.$inferSelect;
export type InsertPugBan = typeof pugBan.$inferInsert;

export const pugUserNote = sqliteTable("pug_user_note", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull(),
  game: text("game").notNull(),
  note: text("note").notNull(),
  createdAt: text("created_at").notNull(),
  createdBy: text("created_by").notNull(),
  updatedAt: text("updated_at"),
  updatedBy: text("updated_by"),
  deletedAt: text("deleted_at"),
  deletedBy: text("deleted_by"),
});
export type SelectUserNote = typeof pugUserNote.$inferSelect;
export type InsertUserNote = typeof pugUserNote.$inferInsert;

export const pugUserNoteDiscordMessage = sqliteTable("pug_user_note_discord_message", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull(),
  game: text("game").notNull(),
  channelId: text("channel_id").notNull(),
  messageId: text("message_id").notNull(),
});

export type SelectUserNoteDiscordMessage = typeof pugUserNoteDiscordMessage.$inferSelect;
export type InsertUserNoteDiscordMessage = typeof pugUserNoteDiscordMessage.$inferInsert;
