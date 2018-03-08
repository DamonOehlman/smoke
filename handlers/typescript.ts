import { readFile } from 'fs';
import { resolve, join } from 'path';
import * as ts from 'typescript';
import { transpile, transpileModule } from 'typescript';
import { RequestHandler, RequestUrl } from './index';
import { ServerResponse } from 'http';

export class TypescriptHandler implements RequestHandler {
  constructor(private readonly clientFilesPath: string) {}

  handles(extension: string): boolean {
    return extension === '.ts';
  }

  serve(url: RequestUrl, res: ServerResponse): void {
    const tsFile = join(this.clientFilesPath, url.pathname);
    readFile(tsFile, { encoding: 'utf-8' }, (err, content) => {
      if (err) {
        return this.abort(res, err);
      }

      try {
        const jsCode = transpile(content, {
          module: 0,
        });
        console.log(jsCode);

        res.writeHead(200, {
          'content-type': 'application/javascript',
        });

        // res.statusCode = 404;
        res.write(jsCode);
        res.end();
      } catch (e) {
        this.abort(res, e);
      }
    });
  }

  abort(res: ServerResponse, err?: Error): void {
    if (err) {
      res.writeHead(500);
      res.write(err.message);
      console.error(err);
    } else {
      res.writeHead(404);
      res.write('not found');
    }

    res.end();
  }
}
