export class ConflictError extends Error {
  type = "Conflict";
  readonly details?: string;

  constructor(msg: string, details?: string) {
    super(msg);
    this.details = details;
  }
}
