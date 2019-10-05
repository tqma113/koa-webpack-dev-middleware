import colors from 'ansi-colors'

const symbols = {
  trace: colors.grey(colors.symbols.line),
  debug: colors.cyan('➤'),
  info: colors.blue(colors.symbols.info),
  warn: colors.yellow(colors.symbols.warning),
  error: colors.red(colors.symbols.cross),
  silent: ''
};

export const LEVEL = Object.keys(symbols) as LEVELType[]
export type LEVELType = keyof typeof symbols


export interface Profix {
  level?: (level: LEVELType) => string
  template: string
}

export interface LoggerProps {
  name: string
  level: LEVELType
  unique: boolean
  color: boolean
  profix: Profix
}

const defaults: LoggerProps = {
  name: '<unknown>',
  level: LEVEL[2],
  unique: true,
  color: true,
}

const prefix: Profix = {
  level(level) {
    return symbols[level];
  },
  template: `{{level}} ${colors.gray('｢{{name}}｣')}: `,
};

const noColorPrefix: Profix = {
  template: '｢{{name}}｣: ',
}