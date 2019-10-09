import { Options } from '../index';
import Logger from './logger';

const defaultLog = new Logger('wdm')

const getLogger = (options: Options) => {
  return options.log || defaultLog
}

export default getLogger