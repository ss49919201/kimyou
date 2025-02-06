CREATE TABLE `buddhist_profiles` (
	`id` text NOT NULL,
	`monto_id` text NOT NULL,
	`homyo` text NOT NULL,
	`ingou` text,
	`created_date` text NOT NULL,
	`updated_date` text NOT NULL,
	FOREIGN KEY (`monto_id`) REFERENCES `montos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `buddhist_profiles_id_unique` ON `buddhist_profiles` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `buddhist_profiles_monto_id_unique` ON `buddhist_profiles` (`monto_id`);--> statement-breakpoint
CREATE TABLE `montos` (
	`id` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`address` text NOT NULL,
	`date_of_death` text,
	`created_date` text NOT NULL,
	`updated_date` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `montos_id_unique` ON `montos` (`id`);