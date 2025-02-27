CREATE TABLE `remove_montos` (
	`id` text PRIMARY KEY NOT NULL,
	`monto_id` text NOT NULL,
	`reason` text NOT NULL,
	`note` text,
	`removed_date` text NOT NULL,
	FOREIGN KEY (`monto_id`) REFERENCES `montos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `remove_montos_monto_id_unique` ON `remove_montos` (`monto_id`);--> statement-breakpoint
CREATE TABLE `restore_montos` (
	`id` text PRIMARY KEY NOT NULL,
	`monto_id` text NOT NULL,
	`note` text,
	`restored_date` text NOT NULL,
	FOREIGN KEY (`monto_id`) REFERENCES `montos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `restore_montos_monto_id_unique` ON `restore_montos` (`monto_id`);--> statement-breakpoint
ALTER TABLE `montos` ADD `status` text DEFAULT 'ACTIVE' NOT NULL;--> statement-breakpoint
CREATE VIEW `active_montos` AS select "id", "genderId", "first_name", "last_name", "phone_number", "address", "status", "date_of_death", "created_date", "updated_date" from "montos" where "montos"."status" = 'ACTIVE';--> statement-breakpoint
CREATE VIEW `inactive_montos` AS select "id", "genderId", "first_name", "last_name", "phone_number", "address", "status", "date_of_death", "created_date", "updated_date" from "montos" where "montos"."status" = 'INACTIVE';