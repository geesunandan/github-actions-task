export default class ApiError extends Error {
  code: number;
  constructor({ message, code }: { message: string; code: number }) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message);
    this.code = code;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}
