import path from 'path'
import { parse } from 'url'
import webpack from 'webpack'

const getFilenameFromUrl = (compiler: webpack.Compiler, url: string) => {
  const outputPath = compiler.outputPath
  const publicPath = compiler.options &&
    compiler.options.output &&
    compiler.options.output.publicPath;

  const localPrefix = parse(publicPath || '/', false, true)
  const urlObj = parse(url)

  let filename: string = ''

  if (typeof urlObj.pathname === 'string'
    && typeof localPrefix.pathname === 'string'
    && urlObj.pathname.indexOf(localPrefix.pathname) === 0) {
    filename = urlObj.pathname.substr(localPrefix.pathname.length);
  }

  filename = path.posix.join(outputPath || '', filename)

  return filename
}

export default getFilenameFromUrl