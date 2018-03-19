import { readFile } from 'fs';
import { resolve, join } from 'path';
import * as ts from 'typescript';
import { transpile, transpileModule } from 'typescript';
import { RequestHandler, RequestUrl } from './index';
import { ServerResponse } from 'http';
import { inspect } from 'util';

export class TypescriptHandler implements RequestHandler {
  constructor(private readonly clientFilesPath: string) {}

  handles(extension: string): boolean {
    return extension === '.ts';
  }

  serve(url: RequestUrl, res: ServerResponse): void {
    const tsFile = join(this.clientFilesPath, url.pathname);
    const program = ts.createProgram([tsFile], {
      module: 4,
      target: 3,
      outFile: join(this.clientFilesPath, 'test.js'),
      inlineSourceMap: true,
      // skipLibCheck: true,
      // outDir: this.clientFilesPath,
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
      res.writeHead(200, {
        'content-type': 'application/javascript',
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
