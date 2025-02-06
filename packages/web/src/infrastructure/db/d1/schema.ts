import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const montos = sqliteTable("montos", {
  id: text().notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  address: text("address").notNull(),
  dateOfDeath: text("daetOfDeath"), // RFC3339 ex)2006-01-02T15:04:05Z07:00
  createdDate: text("created_date").notNull(), // RFC3339 ex)2006-01-02T15:04:05Z07:00
  updatedDate: text("updated_date").notNull(), // RFC3339 ex)2006-01-02T15:04:05Z07:00
});

export const buddhistProfiles = sqliteTable("buddhist_profiles", {
  id: text().notNull().unique(),
  montoId: text("monto_id")
    .notNull()
    .unique()
    .references(() => montos.id),
  homyo: text().notNull(),
  ingou: text(),
  createdDate: text("created_date").notNull(), // RFC3339 ex)2006-01-02T15:04:05Z07:00
  updatedDate: text("updated_date").notNull(), // RFC3339 ex)2006-01-02T15:04:05Z07:00
});
