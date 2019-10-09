import Koa from 'koa'
import webpack from 'webpack'
import MemoryFS from 'memory-fs'

import {
  getFilenameFromUrl,
  readFileFromMemory,
  setHeaders,
  setupHooks,
  Out,
  reporter,
  Logger
} from './utils'

// TODO Support write to disk
// TODO Support HMR(hot module replace)
export interface KoaWDMOptions {
  index?: string
  log?: Out,
  displayStats?: boolean,
  stats?: webpack.Stats.ToStringOptionsObject
}

const defaults = {
  displayStats: true,
  index: 'index.html',
  log: new Logger('wdm'),
  stats: {
    context: process.cwd(),
    colors: true,
  }
}

const wrapper = (compiler: webpack.Compiler, ops: KoaWDMOptions = {}) => {
  const options = Object.assign({}, defaults, ops)

  const mfs = new MemoryFS()
  compiler.outputFileSystem = mfs

  const { log } = options

  setupHooks(compiler, options)

  compiler.watch({ aggregateTimeout: 200 }, (err, stats) => {
    if (err) {
      log.error(err.stack || err)
    }

    reporter(options, {
      log,
      stats
    })
  })

  const middleware: Koa.Middleware = async (ctx, next) => {
    const filename = getFilenameFromUrl(compiler, ctx.request.url)
    const file = readFileFromMemory(mfs, filename, options.index)

    // if file is exist set headers and body
    if (file) {
      let { filename, content } = file
      content = setHeaders(ctx, filename, content)

      ctx.body = content
    }
    await next()
  }

  return middleware
}

export default wrapper