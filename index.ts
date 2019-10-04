import Koa from 'koa'
import webpack from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import { ServerResponse } from 'http'

const wdm = async (compiler: webpack.Compiler, ops: WebpackDevMiddleware.Options) => {
  const devMiddleware = WebpackDevMiddleware(compiler, ops)

  const middleware: Koa.Middleware = (context, next) => {
    // wait for webpack-dev-middleware to signal that the build is ready
    const ready = new Promise((resolve, reject) => {
      compiler.hooks.failed.tap('KoaWebpack', (error) => {
        reject(error);
      });

      devMiddleware.waitUntilValid(() => {
        resolve(true);
      });
    });
    // tell webpack-dev-middleware to handle the request
    const init = new Promise((resolve) => {
      const res: ServerResponse = Object.assign(context.res, {
        end: (content: any) => {
          // eslint-disable-next-line no-param-reassign
          context.body = content;
          resolve();
        },
        getHeader: context.get.bind(context),
        setHeader: context.set.bind(context),
        locals: context.state
      })

      devMiddleware(
        context.req,
        res,
        () => resolve(next())
      );
    });

    return Promise.all([ready, init]);
  }

  return middleware
}

export default wdm