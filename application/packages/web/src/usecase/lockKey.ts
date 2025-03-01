export function lockKeyForUpdateMonto(id: string): `updateMonto:${string}` {
  return `updateMonto:${id}`;
}
