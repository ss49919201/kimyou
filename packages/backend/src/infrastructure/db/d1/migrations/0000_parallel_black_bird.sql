CREATE TABLE `administrator` (
	`id` text NOT NULL,
	`hased_password` text NOT NULL,
	`created_date` text NOT NULL,
	`updated_date` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `administrator_id_unique` ON `administrator` (`id`);--> statement-breakpoint
CREATE TABLE `buddhist_profile` (
	`id` text NOT NULL,
	`monto_id` text NOT NULL,
	`homyo` text NOT NULL,
	`ingou` text,
	`created_date` text NOT NULL,
	`updated_date` text NOT NULL,
	FOREIGN KEY (`monto_id`) REFERENCES `monto`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `buddhist_profile_id_unique` ON `buddhist_profile` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `buddhist_profile_monto_id_unique` ON `buddhist_profile` (`monto_id`);--> statement-breakpoint
CREATE TABLE `monto` (
	`id` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`date_of_death` text,
	`created_date` text NOT NULL,
	`updated_date` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `monto_id_unique` ON `monto` (`id`);