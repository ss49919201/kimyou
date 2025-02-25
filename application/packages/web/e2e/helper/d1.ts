import { applyD1Migrations, D1Migration } from "cloudflare:test";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import {
  buddhistProfiles,
  genders,
  montos,
} from "../../src/infrastructure/db/d1/schema";

export async function setupD1(
  d1: D1Database,
  d1Migraions: D1Migration[]
): Promise<void> {
  await applyD1Migrations(d1, d1Migraions);
  await insertDummy(d1);
}

export const dummyMontoId = "a06f0af8-bcdf-4f2d-9208-7408a90a294c";

async function insertDummy(d1: D1Database): Promise<void> {
  const db = drizzle(d1);

  const createdDate = new Date().toISOString();
  const updatedDate = createdDate;

  await db.insert(genders).values([
    {
      type: "男",
      createdDate,
      updatedDate,
    },
    {
      type: "女",
      createdDate,
      updatedDate,
    },
  ]);

  const genderMale = await db
    .select()
    .from(genders)
    .where(eq(genders.type, "男"))
    .get();

  if (!genderMale) {
    throw new Error("gender male not found");
  }

  const montoId = dummyMontoId;
  await db.insert(montos).values({
    id: montoId,
    genderId: genderMale.id,
    firstName: "テスト名",
    lastName: "テスト性",
    dateOfDeath: new Date("2025-01-31T15:00:00Z").toISOString(),
    createdDate,
    updatedDate,
    address: "テスト住所",
    phoneNumber: "テスト電話番号",
  });

  await db.insert(buddhistProfiles).values({
    id: crypto.randomUUID(),
    montoId,
    homyo: "釋　一宗",
    ingou: "帰命院",
    createdDate,
    updatedDate,
  });
}
