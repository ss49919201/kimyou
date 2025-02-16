PRAGMA defer_foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_montos` (
	`id` text PRIMARY KEY NOT NULL,
	`genderId` integer NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`phone_number` text NOT NULL,
	`address` text NOT NULL,
	`date_of_death` text,
	`created_date` text NOT NULL,
	`updated_date` text NOT NULL,
	FOREIGN KEY (`genderId`) REFERENCES `genders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_montos`("id", "genderId", "first_name", "last_name", "phone_number", "address", "date_of_death", "created_date", "updated_date") SELECT "id", "genderId", "first_name", "last_name", "phone_number", "address", "date_of_death", "created_date", "updated_date" FROM `montos`;--> statement-breakpoint
DROP TABLE `montos`;--> statement-breakpoint
ALTER TABLE `__new_montos` RENAME TO `montos`;--> statement-breakpoint
PRAGMA defer_foreign_keys=OFF;