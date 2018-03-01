import * as ts from 'typescript';
import { RequestHandler } from './index';
import { IncomingMessage, ServerResponse } from 'http';

export class TypescriptHandler implements RequestHandler {
  handles(extension: string): boolean {
    return extension === '.ts';
  }

  serve(req: IncomingMessage, res: ServerResponse): void {
    // TODO: compile the typescript and return as javascript mimetype
    res.statusCode = 404;
    res.end();
  }
}
