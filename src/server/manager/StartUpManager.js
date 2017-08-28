import R from 'ramda';
import path from 'path';
import fs from 'async-file';

import { connectDatabase } from '../db';
import { DBConfig } from '../db/config';
import { genericLogger } from '../utils/logger';

class StartUpManager {
    static CONFIG_FOLDER_PATH = path.resolve(__dirname, '../../../config');
    static dbConnections = {};

    constructor() {
        this.startApplication();
    }

    async startApplication() {
        genericLogger.verbose(`Running with process.pid: ${process.pid}.`);

        let server;
        try {
            for (let type in DBConfig) {
                if (DBConfig.hasOwnProperty(type)) {
                    StartUpManager.dbConnections[type] = await connectDatabase(DBConfig[type]);
                    let { host, port, name } = StartUpManager.dbConnections[type];
                    genericLogger.verbose(`Connected to ${host}:${port}/${name} database.`)
                }
            }

            server = await require('../../server.js')['default']();
        } catch (error) {
            console.log(error);
            genericLogger.error(`Unable to start up.`, error.message);
            StartUpManager.gracefullyExit();
        }

        return server;
    }


    static gracefullyExit(timeout = 1500) {
        setTimeout(() => process.exit(1), timeout);
    }

    static async checkConfig() {
        const isJSON = R.test(/\.json$/i);
        const isSample = R.test(/\.sample$/i);
        const readConfigsList = dir => fs.readdir(dir).then(R.filter(R.anyPass([isJSON, isSample])));

        const extensionPattern = /\.[0-9a-z]+$/i;
        const groupByExtension = R.groupBy(R.compose(R.head, R.match(extensionPattern)));

        const readJSON = async (path) => {
            const raw = await fs.readFile(path);
            return JSON.parse(raw.toString());
        };

        async function test(directory) {
            const configs = await readConfigsList(directory);
            const { '.json': jsons, '.sample': samples } = groupByExtension(configs);

            if (jsons.length !== samples.length) {
                throw new Error('The number of configuration files and samples should be the equal.');
            }

            return Promise.all(
                jsons.map(async (configPath) => {
                    const pair = await Promise.all([
                        readJSON(path.resolve(`${directory}/`, configPath)),
                        readJSON(path.resolve(`${directory}/`, configPath + '.sample'))
                    ]);

                    const keys = R.map(R.compose(R.sortBy(R.prop(0)), R.keys), pair);
                    if (!R.equals(...keys)) {
                        throw new Error(`The signature of ${configPath} is not valid.`);
                    }
                })
            );
        }

        try {
            await test(this.CONFIG_FOLDER_PATH);
        } catch (error) {
            genericLogger.error(`Checking the configuration files failed.`, error.message);
            this.gracefullyExit();
        }
    }
}

export default StartUpManager;
