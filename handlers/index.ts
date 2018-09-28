import { ServerResponse, IncomingMessage } from 'http';

export interface RequestHandler {
  handles(extension: string): boolean;
  knowsAbout(url: RequestUrl): boolean;
  serve(url: RequestUrl, req: IncomingMessage, res: ServerResponse): void;
}

export type RequestUrl = {
  pathname: string;
};
