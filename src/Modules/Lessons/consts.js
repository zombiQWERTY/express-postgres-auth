import Enum from 'enum';

export const types = new Enum(['individual', 'group']);
export const statuses = new Enum(['created', 'paid', 'allConnected', 'translating', 'finished', 'loosenStudent']);
