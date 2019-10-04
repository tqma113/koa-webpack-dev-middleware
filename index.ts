import path from 'path'
import Koa from 'koa'
import webpack from 'webpack'
import MemoryFS from 'memory-fs'
import { parse } from 'url'
import mime from 'mime'

export interface Options {
  index?: string
}

const NonCharsetFileTypes = /\.(wasm|usdz)$/;

const wdm = (compiler: webpack.Compiler, ops: Options = {}) => {
  const mfs = new MemoryFS()

  compiler.outputFileSystem = mfs

  const outputPath = compiler.outputPath
  const publicPath = compiler.options &&
    compiler.options.output &&
    compiler.options.output.publicPath;
  const watching = compiler.watch({}, (err) => {
    console.log(err)
  })

  const middleware: Koa.Middleware = async (ctx, next) => {
    const localPrefix = parse(publicPath || '/', false, true)
    const urlObj = parse(ctx.request.url)
    let filename: string = ''

    if (typeof urlObj.pathname === 'string'
      && typeof localPrefix.pathname === 'string'
      && urlObj.pathname.indexOf(localPrefix.pathname) === 0) {
      filename = urlObj.pathname.substr(localPrefix.pathname.length);
    }

    filename = path.posix.join(outputPath || '', filename)

    try {
      let stat = mfs.statSync(filename);

      if (!stat.isFile()) {
        if (stat.isDirectory()) {
          let { index } = ops;

          // eslint-disable-next-line no-undefined
          if (index === undefined) {
            index = 'index.html'
          } else if (!index) {
            throw new Error('next')
          }

          filename = path.posix.join(filename, index);
          stat = mfs.statSync(filename);

          if (!stat.isFile()) {
            throw new Error('next')
          }
        } else {
          throw new Error('next')
        }
      }
    } catch (e) {
      console.log(e)
    }

    let contentType = mime.getType(filename) || ''

    if (!NonCharsetFileTypes.test(filename)) {
      contentType += '; charset=UTF-8'
    }

    ctx.response.type = contentType
    if (!ctx.response.type) {
      ctx.response.type = contentType
    }

    let content = mfs.readFileSync(filename)

    ctx.body = content
    next()
  }
  
  return middleware
}

export default wdm