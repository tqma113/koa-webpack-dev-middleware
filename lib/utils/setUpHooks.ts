import webpack from 'webpack'
import reporter from './reporter';
import { Options } from '../index';

export type Callback = (...args: any[]) => any

let state = false

const setupHooks = (compiler: webpack.Compiler, options: Options) => {
  const invalid: Callback = (callback) => {
    if (state) {
      reporter(options, {
        state: false
      });
    }

    state = false

    if (typeof callback === 'function') {
      callback()
    }
  }

  const done = (stats: webpack.Stats) => {
    process.nextTick(() => {
      if (state) {
        reporter(options, {
          state: true,
          stats
        })
      }
    })
  }

  compiler.hooks.done.tap('WebpckDevMiddleware', done)
  compiler.hooks.invalid.tap('WebpackDevMiddleware', invalid);
  compiler.hooks.run.tap('WebpackDevMiddleware', invalid);
  compiler.hooks.done.tap('WebpackDevMiddleware', done);
  compiler.hooks.watchRun.tap(
    'WebpackDevMiddleware',
    (comp, callback) => {
      invalid(callback);
    }
  );
}

export default setupHooks