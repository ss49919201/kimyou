export class NotFoundError extends Error {
  type = "NotFoundError";
  readonly details?: string;

  constructor(msg: string, details?: string) {
    super(msg);
    this.details = details;
  }
}
