export class InvalidParameterError extends Error {
  type = "InvalidParameter";
  readonly details?: string;

  constructor(msg: string, details?: string) {
    if (details) {
      msg += ` details: ${details}`;
    }
    super(msg);
    this.details = details;
  }
}
