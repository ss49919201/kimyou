export class NotFoundError extends Error {
  type = "NotFoundError";
  readonly details?: string;

  constructor(msg: string, details?: string) {
    if (details) {
      msg += ` details: ${details}`;
    }
    super(msg);
    this.details = details;
  }
}
