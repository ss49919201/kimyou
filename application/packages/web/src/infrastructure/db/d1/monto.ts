import { eq } from "drizzle-orm";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { randomUUID } from "node:crypto";
import {
  isMontoStatus,
  newSavedMonto,
  SavedMonto,
  UnsavedMonto,
} from "../../../domain/model/monto";
import { buddhistProfiles, genders, montos, removeMontos } from "./schema";

export async function findOneForUpdate(
  db: DrizzleD1Database,
  id: string
): Promise<SavedMonto | undefined> {
  const result = await db
    .select()
    .from(montos)
    .innerJoin(genders, eq(montos.genderId, genders.id))
    .leftJoin(buddhistProfiles, eq(montos.id, buddhistProfiles.montoId))
    .where(eq(montos.id, id))
    .get();

  if (!result) {
    return undefined;
  }

  const {
    montos: selectedMonto,
    buddhist_profiles: selectedBudhistProfile,
    genders: selectedGender,
  } = result;

  if (!isMontoStatus(selectedMonto.status)) {
    throw new Error(`Invalid monto status: ${selectedMonto.status}`);
  }

  const findOneInactiveReason = async () => {
    const result = await db
      .select({ reason: removeMontos.reason })
      .from(removeMontos)
      .where(eq(removeMontos.montoId, selectedMonto.id))
      .orderBy(removeMontos.removedDate)
      .limit(1)
      .get();

    if (result === undefined) {
      throw new Error(
        `Removed monto event not found: monto id = ${selectedMonto.id}`
      );
    }

    return result.reason;
  };

  const savedMontoOrError = newSavedMonto({
    id: selectedMonto.id,
    homyo: selectedBudhistProfile?.homyo ?? undefined,
    firstName: selectedMonto.firstName,
    lastName: selectedMonto.lastName,
    ingou: selectedBudhistProfile?.ingou ?? undefined,
    dateOfDeath: selectedMonto.dateOfDeath
      ? new Date(selectedMonto.dateOfDeath)
      : undefined,
    address: selectedMonto.address,
    phoneNumber: selectedMonto.phoneNumber,
    gender: selectedGender.type,
    ...(selectedMonto.status === "ACTIVE"
      ? { status: selectedMonto.status }
      : {
          status: selectedMonto.status,
          reason: await findOneInactiveReason(),
        }),
  });

  if (savedMontoOrError instanceof Error) {
    throw savedMontoOrError;
  }

  return savedMontoOrError;
}

export async function insertMonto(
  db: DrizzleD1Database,
  unsavedMonto: UnsavedMonto
): Promise<void> {
  const selectedGender = await db
    .select({ id: genders.id })
    .from(genders)
    .where(eq(genders.type, unsavedMonto.gender))
    .get();

  if (!selectedGender) {
    throw new Error("gender not found");
  }

  const createdDate = new Date().toISOString();
  const updatedDate = new Date().toISOString();

  // NOTE: Cloudflare D1 transaction not supported
  // https://github.com/drizzle-team/drizzle-orm/issues/2463
  const montoId = randomUUID();
  await db.batch([
    db.insert(montos).values({
      id: montoId,
      genderId: selectedGender.id,
      firstName: unsavedMonto.firstName,
      lastName: unsavedMonto.lastName,
      address: unsavedMonto.address,
      phoneNumber: unsavedMonto.phoneNumber,
      dateOfDeath: unsavedMonto.dateOfDeath
        ? unsavedMonto.dateOfDeath.toISOString()
        : null,
      createdDate,
      updatedDate,
    }),
    db.insert(buddhistProfiles).values({
      id: crypto.randomUUID(),
      montoId,
      homyo: unsavedMonto.homyo,
      ingou: unsavedMonto.ingou,
      createdDate,
      updatedDate,
    }),
  ]);
}

export function maxNumberOfInsertableMontos(): number {
  // 1monto = 約100B
  // Cloudflare Workers のメモリ制限が128MB
  // 上記のインフラ制約を満たしている且つ、1回の入力として常識的な数を最大数とする
  return 1000;
}

export async function updateMonto(
  db: DrizzleD1Database,
  savedMonto: SavedMonto
): Promise<void> {
  const selectedGender = await db
    .select({ id: genders.id })
    .from(genders)
    .where(eq(genders.type, savedMonto.gender))
    .get();

  if (!selectedGender) {
    throw new Error("gender not found");
  }

  const createdDate = new Date().toISOString();
  const updatedDate = new Date().toISOString();

  console.log(savedMonto);

  // NOTE: Cloudflare D1 transaction not supported
  // https://github.com/drizzle-team/drizzle-orm/issues/2463
  await db.batch([
    db
      .update(montos)
      .set({
        genderId: selectedGender.id,
        firstName: savedMonto.firstName,
        lastName: savedMonto.lastName,
        address: savedMonto.address,
        phoneNumber: savedMonto.phoneNumber,
        dateOfDeath: savedMonto.dateOfDeath
          ? savedMonto.dateOfDeath.toISOString()
          : null,
        createdDate,
        updatedDate,
      })
      .where(eq(montos.id, savedMonto.id)),
    db
      .update(buddhistProfiles)
      .set({
        homyo: savedMonto.homyo ?? null,
        ingou: savedMonto.ingou ?? null,
        createdDate,
        updatedDate,
      })
      .where(eq(buddhistProfiles.montoId, savedMonto.id)),
  ]);
}
