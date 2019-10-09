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
  getLogger
} from './utils'

export interface KoaWDMOptions {
  index?: string
  stats?: webpack.Stats.ToJsonOptions
  log?: Out,
  displayStats?: boolean,
  context?: string,
  colors?: boolean
}

const defaults: KoaWDMOptions = {
  displayStats: true,
  context: process.cwd(),
  colors: true
}

const wrapper = (compiler: webpack.Compiler, ops: KoaWDMOptions = {}) => {
  ops = Object.assign({}, defaults, ops)

  const mfs = new MemoryFS()
  compiler.outputFileSystem = mfs

  const log = getLogger(ops)

  setupHooks(compiler, ops)

  compiler.watch({ aggregateTimeout: 200 }, (err, stats) => {
    if (err) {
      log.error(err.stack || err)
    }

    reporter(ops, {
      log,
      stats
    })
  })

  const middleware: Koa.Middleware = async (ctx, next) => {
    const filename = getFilenameFromUrl(compiler, ctx.request.url)
    const file = readFileFromMemory(mfs, filename, ops.index)

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