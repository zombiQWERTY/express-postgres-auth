import R from 'ramda';
import yargs from 'yargs';
import config from '../../../config/config.json';

export const getURI = () => R.merge(config.service, {
  startport: yargs.argv.startport
});

const isPublicPort = port => [80, 443].includes(port);
const getPort = port => !isPublicPort(port) ? ':' + port : '';
export const getBaseURI = () => {
  const URI = getURI();
  return URI.protocol + '://' + URI.domain + getPort(URI.port);
};
