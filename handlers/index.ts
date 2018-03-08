import { ServerResponse } from 'http';

export interface RequestHandler {
  handles(extension: string): boolean;
  serve(url: RequestUrl, res: ServerResponse): void;
}

export type RequestUrl = {
  pathname: string;
};
