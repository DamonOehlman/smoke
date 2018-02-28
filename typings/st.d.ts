declare module 'st' {
  import { IncomingMessage, ServerResponse } from 'http';

  namespace StaticFileServer {
    type StaticMountOptions = {
      path: string;
      url?: string;
      passthrough?: boolean;
      cors?: boolean;
    };

    type RequestHandler = (req: IncomingMessage, res: ServerResponse, passthrough?: () => {}) => void;
    type MountFunction = (options: StaticMountOptions) => RequestHandler;
  }

  var st: StaticFileServer.MountFunction;
  export = st;
}
