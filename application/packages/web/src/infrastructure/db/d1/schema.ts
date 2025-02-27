import { eq } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  sqliteView,
  text,
} from "drizzle-orm/sqlite-core";

export const genders = sqliteTable("genders", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  type: text("type").notNull(), // MALE | FEMALE
  createdDate: text("created_date").notNull(), // RFC3339 ex)2006-01-02T15:04:05Z07:00
  updatedDate: text("updated_date").notNull(), // RFC3339 ex)2006-01-02T15:04:05Z07:00
});

const montoStatus = {
  active: "ACTIVE",
  inactive: "INACTIVE",
};

export const montos = sqliteTable("montos", {
  id: text().notNull().primaryKey(),
  genderId: integer({ mode: "number" })
    .notNull()
    .references(() => genders.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  address: text("address").notNull(),
  status: text("").notNull().default(montoStatus.active), // ACTIVE | INACTIVE
  dateOfDeath: text("date_of_death"), // RFC3339 ex)2006-01-02T15:04:05Z07:00
  createdDate: text("created_date").notNull(), // RFC3339 ex)2006-01-02T15:04:05Z07:00
  updatedDate: text("updated_date").notNull(), // RFC3339 ex)2006-01-02T15:04:05Z07:00
});

export const buddhistProfiles = sqliteTable("buddhist_profiles", {
  id: text().notNull().primaryKey(),
  montoId: text("monto_id")
    .notNull()
    .unique()
    .references(() => montos.id),
  homyo: text(),
  ingou: text(),
  createdDate: text("created_date").notNull(), // RFC3339 ex)2006-01-02T15:04:05Z07:00
  updatedDate: text("updated_date").notNull(), // RFC3339 ex)2006-01-02T15:04:05Z07:00
});

export const activeMontos = sqliteView("active_montos").as((db) =>
  db.select().from(montos).where(eq(montos.status, montoStatus.active))
);

export const inactiveMontos = sqliteView("inactive_montos").as((db) =>
  db.select().from(montos).where(eq(montos.status, montoStatus.inactive))
);

export const removeMontos = sqliteTable("remove_montos", {
  id: text().notNull().primaryKey(),
  montoId: text("monto_id")
    .notNull()
    .unique()
    .references(() => montos.id),
  reason: text().notNull(), // temple_transfer | misregistration | others
  note: text(),
  removedDate: text("removed_date").notNull(), // RFC3339 ex)2006-01-02T15:04:05Z07:00
});

export const restoreMontos = sqliteTable("restore_montos", {
  id: text().notNull().primaryKey(),
  montoId: text("monto_id")
    .notNull()
    .unique()
    .references(() => montos.id),
  note: text(),
  restoredDate: text("restored_date").notNull(), // RFC3339 ex)2006-01-02T15:04:05Z07:00
});
