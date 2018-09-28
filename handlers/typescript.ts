import { readFile } from 'fs';
import { resolve, join, basename, dirname } from 'path';
import * as ts from 'typescript';
import * as etag from 'etag';
import { transpile, transpileModule } from 'typescript';
import { RequestHandler, RequestUrl } from './index';
import { ServerResponse, IncomingMessage } from 'http';
import { inspect } from 'util';

type CacheData = {
  etag: string;
  data: string;
};

export class TypescriptHandler implements RequestHandler {
  private readonly cache: Map<string, CacheData>;
  private main?: string;

  constructor(private readonly clientFilesPath: string) {
    this.cache = new Map();
  }

  handles(extension: string): boolean {
    return extension === '.ts';
  }

  knowsAbout(url: RequestUrl): boolean {
    const targetModule = join(this.clientFilesPath, basename(url.pathname, '.ts'));
    return this.cache.has(targetModule);
  }

  serve(url: RequestUrl, req: IncomingMessage, res: ServerResponse): void {
    const targetModule = join(this.clientFilesPath, basename(url.pathname, '.ts'));

    console.log(`received request for url: ${url.pathname}`);

    const cachedContent = this.cache.get(targetModule);
    const reqEtag = req.headers['if-none-match'];
    if (cachedContent && cachedContent.etag === reqEtag) {
      res.writeHead(304);
      return res.end();
    } else if (cachedContent && !reqEtag) {
      res.writeHead(200, {
        'content-type': 'application/javascript',
        etag: cachedContent.etag,
      });
      return res.end(cachedContent.data);
    }

    this.main = basename(targetModule, '.ts');
    const program = ts.createProgram([`${targetModule}.ts`], {
      module: 5,
      target: 3,
      // inlineSourceMap: true,
      // skipLibCheck: true,
      outDir: this.clientFilesPath,
    });

    console.log(program.getSourceFiles().map(file => file.fileName));
    const handleCompilerError = (message: string) => {
      console.log('captured error:', message);
      res.writeHead(500);
      res.write(message);
      res.end();
    };

    const handleCompilerWrite: ts.WriteFileCallback = (
      fileName: string,
      data: string,
      writeOrderByteMark: boolean,
      handleCompilerError,
      sourceFiles: ReadonlyArray<ts.SourceFile>,
    ) => {
      const cacheKey = join(dirname(fileName), basename(fileName, '.js'));

      // cache the content
      // TODO: make this smarter
      this.cache.set(cacheKey, {
        etag: etag(data),
        data,
      });

      if (basename(fileName, '.js') !== this.main) {
        return;
      }

      console.log(`writing file ${fileName}`);
      res.writeHead(200, {
        'content-type': 'application/javascript',
        etag: etag(data),
      });
      res.end(data);
      // console.log('...');
      //   console.log('generated code', sourceFiles.map(file => file.fileName));
    };

    const emitResult = program.emit(undefined, handleCompilerWrite);
    if (emitResult.emitSkipped) {
      res.writeHead(500);
      res.end('failure in transpilation');
      return;
    }

    console.log(inspect(ts.getPreEmitDiagnostics(program), { depth: null, colors: true }));
    // res.writeHead(200, {
    //   'content-type': 'application/javascript',
    // });

    // res.statusCode = 404;
    // res.write(data);
    // res.end();

    console.log('attempted to compile program');
    console.log(inspect(emitResult, { depth: null, colors: true }));

    // ;
    // readFile(tsFile, { encoding: 'utf-8' }, (err, content) => {
    //   if (err) {
    //     return this.abort(res, err);
    //   }

    //   try {
    //     const jsCode = transpile(content, {
    //       module: 0,
    //     });
    //     console.log(jsCode);

    //     res.writeHead(200, {
    //       'content-type': 'application/javascript',
    //     });

    //     // res.statusCode = 404;
    //     res.write(jsCode);
    //     res.end();
    //   } catch (e) {
    //     this.abort(res, e);
    //   }
    // });
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
