import { createServer } from 'http';
import * as st from 'st';
import { extname, resolve } from 'path';
import { parse as parseUrl } from 'url';
import { IncomingMessage, ServerResponse } from 'http';
import { RequestHandler } from './handlers/';
import { TypescriptHandler } from './handlers/typescript';

function main() {
  const path = process.cwd();
  const serveStatic = st({ path, url: '/', passthrough: true, cache: false });
  const handlers = createHandlers(path);

  createServer((req, res) => {
    if (!req.url) {
      // send a 500 response
      return;
    }

    const url = parseUrl(req.url);
    const extension = url.pathname && extname(url.pathname).toLowerCase();
    const extensionHandler = extension && handlers.filter(handler => handler.handles(extension))[0];

    if (url.pathname && extensionHandler) {
      extensionHandler.serve({ pathname: url.pathname }, res);
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
