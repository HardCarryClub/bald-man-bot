ALTER TABLE `pug_user_note_discord_messages` ADD `game` text NOT NULL;
ALTER TABLE `pug_user_notes` ADD `game` text NOT NULL AFTER `user_id`;