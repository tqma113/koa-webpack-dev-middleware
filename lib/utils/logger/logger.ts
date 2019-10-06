import colors from 'ansi-colors'

const symbols = {
  trace: colors.grey('₸'),
  debug: colors.cyan('➤'),
  info: colors.blue(colors.symbols.info),
  warn: colors.yellow(colors.symbols.warning),
  error: colors.red(colors.symbols.cross),
  silent: ''
};

export interface LoggerProps {
  name: string
  unique: boolean
  color: boolean
  template: string
}

const defaults: LoggerProps = {
  name: '<unknown>',
  unique: true,
  color: true,
}

const template: string = `{{level}} ${colors.gray('｢{{name}}｣')}: `

const noColorTemplate: string =  '｢{{name}}｣: '

class Logger {
  private name: string

  constructor(options: LoggerProps) {

  }

  trace() {

  }

  debug() {

  }

  info() {

  }

  warn() {

  }

  error() {

  }

  silent() {

  }
}