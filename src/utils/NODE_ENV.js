import R from 'ramda';

export const NODE_ENV = R.compose(R.trim, R.pathOr('development', ['env', 'NODE_ENV']))(process);

export const isDevelopment = () => NODE_ENV === 'development';
export const isProduction = () => NODE_ENV === 'production';
export const isTesting = () => NODE_ENV === 'test';
