declare module 'st' {
  import { IncomingMessage, ServerResponse } from 'http';

  namespace StaticFileServer {
    type MountFunction = (options: StaticMountOptions) => RequestHandler;
    type RequestHandler = (req: IncomingMessage, res: ServerResponse, passthrough?: () => {}) => void;

    type StaticMountOptions = {
      path: string;
      url?: string;
      passthrough?: boolean;
      cors?: boolean;
      index?: boolean | string;
      cache?: boolean | CacheOptions;
    };

    type CacheOptions = {
      fd?: CacheAgeOptions;
      stat?: CacheAgeOptions;
      content?: CacheAgeOptions & { cacheControl: string };
      index?: CacheAgeOptions;
      readdir?: CacheAgeOptions;
    };

    type CacheAgeOptions = {
      max: number;
      maxAge: number;
    };
  }

  var st: StaticFileServer.MountFunction;
  export = st;
}
