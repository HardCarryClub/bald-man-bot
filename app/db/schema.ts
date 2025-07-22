import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const pugBans = sqliteTable("pug_bans", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull(),
  reason: text("reason"),
  createdAt: text("created_at").notNull(),
  createdBy: text("created_by").notNull(),
});

export const pugUserNotes = sqliteTable("pug_user_notes", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull(),
  note: text("note").notNull(),
  createdAt: text("created_at").notNull(),
  createdBy: text("created_by").notNull(),
  updatedAt: text("updated_at"),
  updatedBy: text("updated_by"),
  deletedAt: text("deleted_at"),
  deletedBy: text("deleted_by"),
});

export const pugUserNoteDiscordMessages = sqliteTable("pug_user_note_discord_messages", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull(),
  channelId: text("channel_id").notNull(),
  messageId: text("message_id").notNull(),
});
