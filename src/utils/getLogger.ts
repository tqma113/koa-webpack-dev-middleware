import { KoaWDMOptions } from '../index';
import Logger from './logger';

const defaultLog = new Logger('wdm')

const getLogger = (options: KoaWDMOptions) => {
  return options.log || defaultLog
}

export default getLogger