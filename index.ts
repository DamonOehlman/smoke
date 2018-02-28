import * as http from 'http';
import * as st from 'st';
import { TypescriptHandler } from './handlers/typescript';

function main() {
  const path = process.cwd();
  const mount = st({ path, url: '/', passthrough: true });

  http
    .createServer(
      st({
        path: process.cwd(),
        cors: true,
      }),
    )
    .listen(1337);
}

main();
