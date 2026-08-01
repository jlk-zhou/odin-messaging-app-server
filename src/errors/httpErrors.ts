export class HttpError extends Error {
  statusCode: number;

  constructor(error: string, statusCode: number) {
    super(error);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends HttpError {
  constructor(error: string, statusCode = 400) {
    super(error, statusCode);
  }
}

export class NotFoundError extends HttpError {
  constructor(error: string, statusCode = 404) {
    super(error, statusCode);
  }
}

export class InternalServerError extends HttpError {
  constructor(error: string, statusCode = 500) {
    super(error, statusCode);
  }
}
