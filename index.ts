import { createServer } from 'http';
import * as st from 'st';
import { extname } from 'path';
import { IncomingMessage, ServerResponse } from 'http';
import { RequestHandler } from './handlers/';
import { TypescriptHandler } from './handlers/typescript';

const handlers: RequestHandler[] = [
  new TypescriptHandler(), //
];

function main() {
  const path = process.cwd();
  const serveStatic = st({ path, url: '/', passthrough: true });

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

main();
