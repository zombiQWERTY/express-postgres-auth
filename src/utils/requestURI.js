import { getBaseURI } from './baseURI';

export default req => getBaseURI() + req.originalUrl;
