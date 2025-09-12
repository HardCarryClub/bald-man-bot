CREATE TABLE `pug_lobby_host_signup` (
	`id` integer PRIMARY KEY NOT NULL,
	`game` text NOT NULL,
	`channel_id` text,
	`message_id` text,
	`data` text NOT NULL,
	`created_at` text NOT NULL,
	`created_by` text NOT NULL
);
