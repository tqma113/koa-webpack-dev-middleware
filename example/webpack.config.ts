import path from 'path'
import webpack from 'webpack'
import ManifestPlugin from 'webpack-manifest-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const config: webpack.Configuration = {
  mode: 'development',
  entry: path.resolve(__dirname, './src/index.tsx'),
  context: __dirname,
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.tsx',
      '.ts'
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html')
    }),
    new ManifestPlugin({
      fileName: 'manifest.json',
      map: (file: ManifestPlugin.FileDescriptor) => {
        // 删除 .js 后缀，方便直接使用 obj.name 来访问
        if (file.name && /\.js$/.test(file.name)) {
          file.name = file.name.slice(0, -3)
        }
        return file
      }
    }),
  ]
}

export default config