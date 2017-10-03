import R from 'ramda';

export class ApplicationError extends Error {
  constructor(...arg) {
    super(...arg);
  }
}

export class ValidationError extends ApplicationError {
  constructor(errors) {
    super(`${R.length(R.keys(errors))} invalid values`);
    this.errors = errors;
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ApplicationError {
  constructor(message) {
    super(message || 'User not found.');
    this.status = 401;
    this.name = 'AuthenticationError';
  }
}

export class DBError extends ApplicationError {
  constructor(cause) {
    super('Database error.');
    this.name = 'DatabaseError';
  }
}

const isPgError = R.allPass([R.has('severity'), R.has('internalPosition'), R.has('file'), R.has('routine')]);

export const manipulateErrorData = error => {
  const errors = R.pathOr(undefined, ['errors'], error);
  let message = R.pathOr(undefined, ['message'], error);

  if (error && isPgError(error)) {
    error = new DBError(error);
    return { message: error.message, success: false };
  }

  if (error.message && error.message.includes('invalid values')) {
    message = undefined;
  }

  return { errors, message, success: false };
};
