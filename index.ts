import { createServer } from 'http';
import * as st from 'st';
import { extname, resolve } from 'path';
import { IncomingMessage, ServerResponse } from 'http';
import { RequestHandler } from './handlers/';
import { TypescriptHandler } from './handlers/typescript';

function main() {
  const path = process.cwd();
  const serveStatic = st({ path, url: '/', passthrough: true });
  const handlers = createHandlers(path);

  createServer((req, res) => {
    const extension = extname(req.url).toLowerCase();
    const extensionHandler = handlers.filter(handler => handler.handles(extension))[0];

    if (extensionHandler) {
      extensionHandler.serve(req, res);
    } else {
      serveStatic(req, res);
    }
  }).listen(1337);
}

function createHandlers(path: string): RequestHandler[] {
  const clientFilesPath = resolve(path, 'client');

  return [
    new TypescriptHandler(clientFilesPath), //
  ];
}

main();
