export const EMAIL = {
  regexp: /^[-a-z0-9!#$%&'*+\/=?^_`{|}~]+(?:\.[-a-z0-9!#$%&'*+\/=?^_`{|}~]+)*@(?:[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?\.)\.*(([a-z]){1,15})$/
};

/* MINUTES */
export const ONLINE_OFFSET = 60 * 3;

export const PBKDF2 = {
  salten: 32,
  iterations: 25000,
  keylen: 512,
  encoding: 'hex',
  digestAlgorithm: 'sha256'
};
