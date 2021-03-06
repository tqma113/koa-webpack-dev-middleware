import webpack from 'webpack'
import reporter from './reporter';
import { KoaWDMOptions } from '../index';
import Logger,{ Out } from './logger'

const setupHooks = (compiler: webpack.Compiler, options: KoaWDMOptions) => {
  let log: Out

  const invalid = (a: string, b: Date) => {
    console.log(a, b)
  }

  const run = (_: webpack.Compiler, callback: CallableFunction) => {
    reporter(options, {
      log
    });

    if (typeof callback === 'function') {
      callback()
    }
  }

  const done = (stats: webpack.Stats) => {
    process.nextTick(() => {
      reporter(options, {
        log,
        stats
      })
    })
  }

  if (options.log) {
    log = options.log
  } else {
    log = new Logger('wdm')
  }

  compiler.hooks.invalid.tap('WebpackDevMiddleware', invalid);
  compiler.hooks.run.tap('WebpackDevMiddleware', run);
  compiler.hooks.done.tap('WebpackDevMiddleware', done);
  compiler.hooks.watchRun.tap(
    'WebpackDevMiddleware',
    run
  )

  return log
}

export default setupHooks