import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const administrator = sqliteTable("administrator", {
  id: text().notNull().unique(),
  hased_password: text().notNull(),
  created_date: text().notNull(), // RFC3339 ex)2006-01-02T15:04:05Z07:00
  updated_date: text().notNull(), // RFC3339 ex)2006-01-02T15:04:05Z07:00
});

export const monto = sqliteTable("monto", {
  id: text().notNull().unique(),
  first_name: text().notNull(),
  last_name: text().notNull(),
  date_of_death: text(), // RFC3339 ex)2006-01-02T15:04:05Z07:00
  created_date: text().notNull(), // RFC3339 ex)2006-01-02T15:04:05Z07:00
  updated_date: text().notNull(), // RFC3339 ex)2006-01-02T15:04:05Z07:00
});

export const buddhistProfile = sqliteTable("buddhist_profile", {
  id: text().notNull().unique(),
  monto_id: text()
    .notNull()
    .unique()
    .references(() => monto.id),
  homyo: text().notNull(),
  ingou: text(),
  created_date: text().notNull(), // RFC3339 ex)2006-01-02T15:04:05Z07:00
  updated_date: text().notNull(), // RFC3339 ex)2006-01-02T15:04:05Z07:00
});
