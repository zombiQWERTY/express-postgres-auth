import R from 'ramda';
import yargs from 'yargs';
import startConfig from '../../../config/start.json';

const defaultURIConfig = {
  port: 3000,
  startport: 3000,
  protocol: 'http',
  domain: 'localhost'
};

export const URIConfig = R.merge(defaultURIConfig, {
  startport: yargs.argv.startport,
  port: startConfig.PORT,
  protocol: startConfig.PROTOCOL,
  domain: startConfig.DOMAIN
});

const isPublicPort = port => port === 80 || port === 443;

const port = isPublicPort(URIConfig.port) ? `:${URIConfig.port}` : '';
export default `${URIConfig.protocol}://${URIConfig.domain}${port}`;
