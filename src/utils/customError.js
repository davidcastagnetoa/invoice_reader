class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.code = statusCode;
  }
}

export default CustomError;