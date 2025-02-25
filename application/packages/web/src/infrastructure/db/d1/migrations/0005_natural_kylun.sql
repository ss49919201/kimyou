PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_buddhist_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`monto_id` text NOT NULL,
	`homyo` text,
	`ingou` text,
	`created_date` text NOT NULL,
	`updated_date` text NOT NULL,
	FOREIGN KEY (`monto_id`) REFERENCES `montos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_buddhist_profiles`("id", "monto_id", "homyo", "ingou", "created_date", "updated_date") SELECT "id", "monto_id", "homyo", "ingou", "created_date", "updated_date" FROM `buddhist_profiles`;--> statement-breakpoint
DROP TABLE `buddhist_profiles`;--> statement-breakpoint
ALTER TABLE `__new_buddhist_profiles` RENAME TO `buddhist_profiles`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `buddhist_profiles_monto_id_unique` ON `buddhist_profiles` (`monto_id`);