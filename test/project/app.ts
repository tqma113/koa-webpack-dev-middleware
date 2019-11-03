import Koa from 'koa'
import webpack from 'webpack'

import webpackConfig from './webpack.config'
import getMiddleware from '../../src/index'

const app = new Koa()

const compiler = webpack(webpackConfig)

app.use(getMiddleware(compiler))

app.listen(8080, () => {
  console.log('start at 8080')
})