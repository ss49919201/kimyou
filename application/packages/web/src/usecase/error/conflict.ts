export class ConflictError extends Error {
  type = "Conflict";
  readonly details?: string;

  constructor(msg: string, details?: string) {
    if (details) {
      msg += ` details: ${details}`;
    }
    super(msg);
    this.details = details;
  }
}
