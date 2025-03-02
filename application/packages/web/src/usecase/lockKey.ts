/**
 * @param monto id of 1 or more characters
 * @returns lock key for update monto
 */
export function lockKeyForUpdateMonto(id: string): `updateMonto:${string}` {
  if (id.length < 1) {
    throw new Error("Monto id length must be greater than equal to 1");
  }
  return `updateMonto:${id}`;
}
