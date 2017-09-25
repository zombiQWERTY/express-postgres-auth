export const IOError = (cause, prefix) => {
  const error = new Error(prefix + ': ' + cause.message);

  error.cause = cause;
  error.name = 'IOError';
  error.type = 'error.IOError';

  return error;
};

export const OptionError = (message, options = null) => {
  const error = new Error(message);

  error.option = options;
  error.name = 'OptionError';
  error.type = 'error.OptionError';

  return error;
};

export const ValidationError = errors => {
  const error = new Error('ValidationError');

  error.errors = errors;
  error.name = 'ValidationError';
  error.type = 'error.ValidationError';

  return error;
};
