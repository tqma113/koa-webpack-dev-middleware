import webpack from 'webpack'
import reporter from './reporter';
import { Options } from '../index';
import Logger,{ Out } from './logger'

export type Callback = (...args: any[]) => any

let state = false

const setupHooks = (compiler: webpack.Compiler, options: Options) => {
  let log: Out

  const invalid: Callback = (callback) => {
    if (state) {
      reporter(options, {
        log,
        state: false
      });
    }

    // state = false

    if (typeof callback === 'function') {
      callback()
    }
  }

  const done = (stats: webpack.Stats) => {
    state = true

    process.nextTick(() => {
      if (state) {
        reporter(options, {
          state: true,
          log,
          stats
        })
      }
    })
  }

  if (options.log) {
    log = options.log
  } else {
    log = new Logger('wdm')
  }

  state = true

  compiler.hooks.invalid.tap('WebpackDevMiddleware', invalid);
  compiler.hooks.run.tap('WebpackDevMiddleware', invalid);
  compiler.hooks.done.tap('WebpackDevMiddleware', done);
  compiler.hooks.watchRun.tap(
    'WebpackDevMiddleware',
    (comp, callback) => {
      invalid(callback);
    }
  )
}

export default setupHooks