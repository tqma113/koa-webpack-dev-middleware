import webpack from 'webpack'

import { Out } from './logger';
import { KoaWDMOptions } from '../index'

interface ReporterOptions {
	log: Out
  stats?: webpack.Stats
}

export type Reporter = (
	middlewareOptions: KoaWDMOptions,
	options: ReporterOptions
) => void

const reporter: Reporter = (middlewareOptions, options) => {
  const { log, stats } = options
	if (typeof stats !== 'undefined') {
		const statsString = stats.toString(middlewareOptions.stats)
		
		if (middlewareOptions.displayStats && statsString.trim().length) {
			if (stats && stats.hasErrors()) {
				log.error(statsString)
			} else if (stats && stats.hasWarnings()) {
				log.warn(statsString)
			} else {
				log.info(statsString)
			}
		}

		let message = 'Compiled successfully.'

		if (stats && stats.hasErrors()) {
			message = 'Failed to compile.'
		} else if (stats && stats.hasWarnings()) {
			message = 'Compiled with warnings.'
		}
		log.info(message)
	} else {
		log.info('Compiling...')
	}
}

export default reporter