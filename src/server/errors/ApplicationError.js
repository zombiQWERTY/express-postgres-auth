import winston from '../utils/logger';

const logger = winston.loggers.get('generic');

class ApplicationError extends Error {
    constructor(message, params = {}) {
        super(message, params);

        const defaultParams = {
            name: 'App',
            type: 'App.init',
            message: 'An error occurred.',
            detail: '',
            extendedInfo: '',
            reason: {},
            status: 400,
            log: true,
        };

        params.message = message;
        params.name = this.constructor.name;

        if (params.reason instanceof Error) {
            params.message = params.message + params.reason.message;
            try {
                params.reason = JSON.stringify(params.reason);
            } catch (error) {
                throw new ApplicationError('Could not stringify reason object.', {type: 'AppError'});
            }
        }

        Object.assign(this, defaultParams, params);
        Error.captureStackTrace(this, this.constructor);

        if (this.log) this.writeLog();
    }

    writeLog() {
        logger.error(this);
    }
}

export default ApplicationError;
