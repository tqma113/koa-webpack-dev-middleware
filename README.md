# koa-webpack-dev-middleware

A development middleware for koa2.x with typescript for use with webpack bundles. 

## Requirements

This module requires a minimum of Node v10.16.3 and Webpack v4.41.0, and must be used with a server that accepts koa2.x-style middleware.

## Get started

First thing's first, install the module.

npm:

```console
npm install --save-dev koa-wdm
```

yarn:

```console
yarn add -D koa-wdm
```

## Usage

```js
import Koa from 'koa'
import webpack from 'webpack'

import webpackConfig from './webpack.config'
import getMiddleware from '../src/index'

const app = new Koa()

const compiler = webpack(webpackConfig)

app.use(getMiddleware(compiler))

app.listen(8080, () => {
  console.log('start at 8080')
})
```

## Options

The middleware accept a object to change some behavior.
It also support zero config.

### index

The index path for web server, defaults to "index.html".

Type: string  
Default: index.html

### log

In the rare event that a user would like to provide a custom logging interface, this property allows the user to assign one. Created with [ansi-colors](https://github.com/doowb/ansi-colors)

Type: Out(An object consist of 5 function attributes, log, info, debug, warn, error)  
Default: [Logger](https://github.com/tqma113/koa-webpack-dev-middleware/blob/master/src/utils/logger/index.ts)

### displayStats

It controller if ouput the log message.

Type: boolean  
Default: true

### stats

Options for formatting statistics displayed during and after compile. For more information and property details, please see the [webpack documentation](https://webpack.js.org/configuration/stats/#stats).

Type: boolean  
Default:  
```js
{
  context: process.cwd(),
  colors: true,
}
 ```

## License

[MIT](https://github.com/tqma113/koa-webpack-dev-middleware/blob/master/LICENSE)