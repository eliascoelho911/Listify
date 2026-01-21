CREATE TABLE `items` (
	`id` text PRIMARY KEY NOT NULL,
	`list_id` text,
	`section_id` text,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`description` text,
	`quantity` text,
	`price` real,
	`is_checked` integer DEFAULT false,
	`external_id` text,
	`metadata` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`list_id`) REFERENCES `lists`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `items_list_id_idx` ON `items` (`list_id`);--> statement-breakpoint
CREATE INDEX `items_section_id_idx` ON `items` (`section_id`);--> statement-breakpoint
CREATE INDEX `items_type_idx` ON `items` (`type`);--> statement-breakpoint
CREATE INDEX `items_created_at_idx` ON `items` (`created_at`);--> statement-breakpoint
CREATE INDEX `items_title_idx` ON `items` (`title`);--> statement-breakpoint
CREATE TABLE `lists` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`list_type` text NOT NULL,
	`is_prefabricated` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `lists_list_type_idx` ON `lists` (`list_type`);--> statement-breakpoint
CREATE UNIQUE INDEX `lists_name_type_unique` ON `lists` (`name`,`list_type`);--> statement-breakpoint
CREATE TABLE `purchase_history` (
	`id` text PRIMARY KEY NOT NULL,
	`list_id` text NOT NULL,
	`purchase_date` integer NOT NULL,
	`total_value` real DEFAULT 0 NOT NULL,
	`sections` text DEFAULT '[]' NOT NULL,
	`items` text DEFAULT '[]' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`list_id`) REFERENCES `lists`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `purchase_history_list_id_idx` ON `purchase_history` (`list_id`);--> statement-breakpoint
CREATE INDEX `purchase_history_purchase_date_idx` ON `purchase_history` (`purchase_date`);--> statement-breakpoint
CREATE TABLE `search_history` (
	`id` text PRIMARY KEY NOT NULL,
	`query` text NOT NULL,
	`searched_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `search_history_query_unique` ON `search_history` (`query`);--> statement-breakpoint
CREATE INDEX `search_history_searched_at_idx` ON `search_history` (`searched_at`);--> statement-breakpoint
CREATE TABLE `sections` (
	`id` text PRIMARY KEY NOT NULL,
	`list_id` text NOT NULL,
	`name` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`list_id`) REFERENCES `lists`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `sections_list_id_idx` ON `sections` (`list_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `sections_list_name_unique` ON `sections` (`list_id`,`name`);--> statement-breakpoint
CREATE TABLE `user_preferences` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`theme` text DEFAULT 'dark' NOT NULL,
	`primary_color` text,
	`layout_configs` text DEFAULT '{}' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_preferences_user_id_unique` ON `user_preferences` (`user_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`photo_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
