CREATE TABLE `pug_bans` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`reason` text,
	`created_at` text NOT NULL,
	`created_by` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pug_user_note_discord_messages` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`channel_id` text NOT NULL,
	`message_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pug_user_notes` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`note` text NOT NULL,
	`created_at` text NOT NULL,
	`created_by` text NOT NULL,
	`updated_at` text,
	`updated_by` text,
	`deleted_at` text,
	`deleted_by` text
);
