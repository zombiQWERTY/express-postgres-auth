import http from 'http';

import appCreator from './server/index';
import StartUpManager from './server/manager/StartUpManager';
import { initAlways } from './init';
import BASE_URI, { URIConfig } from './server/utils/getBaseUri';
import { genericLogger } from './server/utils/logger';
import NODE_ENV from './server/utils/NODE_ENV';

export default async (port = URIConfig.startport) => {
    const app = appCreator();
    const httpServer = http.createServer(app);

    const listener = async () => {
        try {
            await Promise.all(initAlways({ app }));
            const logs = [
                `Server started on port ${URIConfig.startport}.`,
                `Environment: ${NODE_ENV}.`,
                `Base URI: ${BASE_URI}.`
            ];

            genericLogger.verbose(logs.join(' '));
        } catch (error) {
            genericLogger.error(
                `Unable to init application. ${error.message}`,
                error
            );

            StartUpManager.gracefullyExit();
        }
    };

    const startUpArguments = NODE_ENV === 'production' ? [port, 'localhost', listener] : [port, listener];
    httpServer.listen(...startUpArguments);

    httpServer.on('error', error => {
        if (error.syscall !== 'listen') {
            genericLogger.error(`Error on start up. ${error.message}`);
            StartUpManager.gracefullyExit();
        }

        if (error.code === 'EACCES') {
            genericLogger.error('Port requires elevated privileges.');
        }

        if (error.code === 'EADDRINUSE') {
            genericLogger.error('Port is already in use.');
        }

        StartUpManager.gracefullyExit();
    });

    return httpServer;
};
