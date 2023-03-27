export default class SchedulingError extends Error {
  private _httpStatusCode: number

  public get httpStatusCode(): number {
    return this._httpStatusCode
  }

  constructor(httpStatusCode: number, message: string) {
    if (message) {
      super(message)
    } else {
      super("A generic error ocurred while trying to during scheduling")
    }

    this._httpStatusCode = httpStatusCode
    Error.captureStackTrace(this, this.constructor)
  }

  toJSON(): Object {
    return {
      message: this.message,
      statusCode: this.httpStatusCode,
    }
  }
}
