import R from 'ramda';
import Future from 'fluture';

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
  }
}

export class OptionError extends ApplicationError {
  constructor(message, options = null) {
    super(message);
    this.option = options;
    this.name = 'OptionError';
  }
}

export class ValidationError extends ApplicationError {
  constructor(errors) {
    super(`${R.length(R.keys(errors))} invalid values`);
    this.errors = errors;
    this.name = 'ValidationError';
  }
}

export class WrapError extends ApplicationError {
  constructor(name, cause) {
    super(R.pathOr('', ['message'], cause));
    this.name = name;
    this.errors = R.pathOr({}, ['errors'], cause);
    this.originalName = R.pathOr('', ['name'], cause);
    this.originalMessage = R.pathOr('', ['message'], cause);
  }
}

export const isApplicationError = error => error instanceof  ApplicationError;
export const manipulateError =
  R.curry((message, error) => Future.reject(new WrapError(message || error.message, error)));
