import sizeof from "object-sizeof";

export function calculateNumberOfBytes<T>(obj: T): number {
  return sizeof(obj);
}
