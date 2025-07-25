CREATE TABLE `pug_lobbies` (
	`id` integer PRIMARY KEY NOT NULL,
	`category_id` text NOT NULL,
	`created_at` text NOT NULL,
	`created_by` text NOT NULL,
	`deleted_at` text,
	`deleted_by` text
);
