import webpack from 'webpack'
import Koa from 'koa'

import webpackConfig from './webpack.config'
import getMiddleware from '../index'

const app = new Koa()

const compiler = webpack(webpackConfig)

app.use(getMiddleware(compiler))

app.listen(8080, () => {
  console.log('start at 8080')
})