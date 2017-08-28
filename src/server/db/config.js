import NODE_ENV from '../utils/NODE_ENV';

const setup = (type, prefix) => `mongodb://localhost:27017/iqlang${prefix ? '_' + prefix : ''}_${type}`;

export const development = {
    site: setup('development'),
    admin: setup('development', 'admin')
};

export const production = {
    site: setup('production'),
    admin: setup('production', 'admin')
};

export const testing = {
    site: setup('testing'),
    admin: setup('testing', 'admin')
};

export const DBConfig = NODE_ENV === 'production' ? production : development;
