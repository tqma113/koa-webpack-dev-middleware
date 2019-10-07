import Koa from 'koa'
import webpack from 'webpack'
import MemoryFS from 'memory-fs'

import {
  getFilenameFromUrl,
  readFileFromMemory,
  setHeaders,
  setupHooks,
  Out
} from './utils'

export interface Options {
  index?: string
  stats?: webpack.Stats.ToJsonOptions
  log?: Out
}

const wrapper = (compiler: webpack.Compiler, ops: Options = {}) => {
  const mfs = new MemoryFS()

  compiler.outputFileSystem = mfs

  setupHooks(compiler, ops)

  const watching = compiler.watch({ aggregateTimeout: 200 }, (err, stats) => {
    console.log(err)
  })

  const middleware: Koa.Middleware = async (ctx, next) => {
    // const filename = getFilenameFromUrl(compiler, ctx.request.url)
    // const file = readFileFromMemory(mfs, filename, ops.index)

    // // if file is exist set headers and body
    // if (file) {
    //   let { filename, content } = file
    //   content = setHeaders(ctx, filename, content)

    //   ctx.body = content
    // }
    await next()
  }

  return middleware
}

export default wrapper