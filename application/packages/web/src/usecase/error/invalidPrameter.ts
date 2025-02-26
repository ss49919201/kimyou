export class InvalidParameterError extends Error {
  type = "InvalidParameter";
  readonly details?: string;

  constructor(msg: string, details?: string) {
    super(msg);
    this.details = details;
  }
}
