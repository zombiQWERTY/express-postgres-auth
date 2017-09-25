import R from 'ramda';

export class ApplicationError extends Error {
  constructor(...arg) {
    super(...arg);
  }
}

export class IOError extends ApplicationError {
  constructor(cause, prefix) {
    super(prefix + ': ' + cause.message);
    this.cause = cause;
    this.name = 'IOError';
    this.type = 'IOError';
  }
}

export class OptionError extends ApplicationError {
  constructor(message, options = null) {
    super(message);
    this.option = options;
    this.name = 'OptionError';
    this.type = 'OptionError';
  }
}

export class ValidationError extends ApplicationError {
  constructor(errors) {
    super(`${R.length(R.keys)} invalid values`);
    this.errors = errors;
    this.name = 'ValidationError';
    this.type = 'ValidationError';
  }
}

export class WrapError extends ApplicationError {
  constructor(type, cause) {
    super(cause.message);
    this.name = type;
    this.type = type;
    this.errors = cause.errors;
    this.originalMessage = cause.message;
  }
}

export const isApplicationError = error => error instanceof  ApplicationError;
