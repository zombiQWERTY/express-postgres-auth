export const match = (hash, ...values) => `${hash}:${values.join(':')}`;
export const set = match;
