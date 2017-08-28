import 'babel-polyfill';
import StartUp from './server/manager/StartUpManager';

(async () => {
    await StartUp.checkConfig();
    new StartUp();
})();
