import webpack from 'webpack'
import { Options } from '../index'

interface ReporterOptions {
  state: boolean
  stats?: webpack.Stats
}

export type Reporter = (
	middlewareOptions: Options,
	options: ReporterOptions
) => void

const reporter: Reporter = (middlewareOptions, options) => {
  const { state, stats } = options
  const log = console
	if (state) {
		const displayStats = middlewareOptions.stats !== undefined
		const statsString = stats ? stats.toString(middlewareOptions.stats) : ''

		if (displayStats && statsString.trim().length) {
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