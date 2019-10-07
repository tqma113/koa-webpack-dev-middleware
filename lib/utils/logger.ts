import colors, { StylesType } from 'ansi-colors'

export type Level =
'trace'
| 'debug'
| 'info'
| 'warn'
| 'error'

export interface Out {
  trace: (messge: any) => any
  debug: (messge: any) => any
  info: (messge: any) => any
  warn: (messge: any) => any
  error: (messge: any) => any
}

export interface LoggerProps {
  name?: string
  unique?: boolean
  color?: boolean
  template?: string
  out?: Out
  symbols?: Symbols
  styleConfig?: StyleConfig
}

export interface Symbols {
  trace: string
  debug: string
  info: string
  warn: string
  error: string
}

export type Style = keyof StylesType<any>

export interface StyleConfig {
  trace: Style | [Style, Style]
  debug: Style | [Style, Style]
  info: Style | [Style, Style]
  warn: Style | [Style, Style]
  error: Style | [Style, Style]
}

const defaultSymbols: Symbols = {
  trace: '₸',
  debug: '➤',
  info: colors.symbols.info,
  warn: colors.symbols.warning,
  error: colors.symbols.cross,
};

const defaultStyleConfig: StyleConfig = {
  trace: 'grey',
  debug: 'cyan',
  info: 'blue',
  warn: 'yellow',
  error: 'red'
}


const defaults: LoggerProps = {
  name: '<unknown>',
  unique: true,
  color: true,
}

const template: string = `${colors.gray('｢{{name}}｣')}: `

const noColorTemplate: string =  '｢{{name}}｣: '

class Logger {
  private name: string
  private out: Out
  private template: string
  private symbols: Symbols
  private styleConfig: StyleConfig
  constructor(options: LoggerProps | string) {
    if (typeof options === 'string') {
      options = {
        name: options
      }
    }
    options = Object.assign({}, defaults, options)
    
    this.name = options.name || 'unknown'
    this.out = options.out || console
    this.template = options.template || options.color ? template : noColorTemplate
    this.symbols = options.symbols || defaultSymbols
    this.styleConfig = options.styleConfig || defaultStyleConfig
  }

  trace(message: any) {
    message = 
    console.trace(this.composite('trace', message))
  }

  debug(message: any) {
    console.debug(this.composite('debug', message))
  }

  info(message: any) {
    console.info(this.composite('info', message))
  }

  warn(message: any) {
    console.warn(this.composite('warn', message))
  }

  error(message: any) {
    console.error(this.composite('error', message))
  }

  private interpolate() {
    const replacer = (stache: string, prop: string) => {
      if (prop === 'name') {
        return this.name
      }
  
      return stache;
    }
    return template.replace(/{{([^{}]*)}}/g, replacer);
  }

  private composite(level: Level, message: any) {
    if (typeof this.styleConfig[level] === 'string') {
      return colors[this.styleConfig[level] as Style](this.symbols[level] + this.interpolate() + message)
    } else {
      return colors[this.styleConfig[level][0] as Style][this.styleConfig[level][1] as Style](this.symbols[level] + this.interpolate() + message)
    }
  }
}

export default Logger