import routes from './server/middleware/routes';

export function initAlways({ app }) {
    return [routes(app)];
}
