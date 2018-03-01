import { IncomingMessage, ServerResponse } from 'http';

export interface RequestHandler {
  handles(extension: string): boolean;
  serve(req: IncomingMessage, res: ServerResponse): void;
}
