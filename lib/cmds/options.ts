import { Provider } from '../provider/provider';

/**
 * An options object to update and start the server.
 */
export interface Options {
  providers?: Array<{
    name?: string,
    version?: string,
    binary?: Provider
  }>,
  server?: {
    name?: string,
    version?: string,
    binary?: Provider
  },
  proxy?: string,
  ignoreSSL?: boolean,
  outDir?: string
}