import IMAGE_LOADER_CONFIG from './webpack/loaders/image.config';
import COPY_PLUGIN_CONFIG from './webpack/plugins/copy.config';
import MODERNIZR_PLUGIN_CONFIG from './webpack/plugins/modernizr.config';
import OPTIMIZE_CSS_PLUGIN_CONFIG from './webpack/plugins/optimize-css.config';
import PROVIDE_PLUGIN_CONFIG from './webpack/plugins/provide.config';
import UGLIFY_JS_PLUGIN_CONFIG from './webpack/plugins/uglify-js.config';

const BUILD_CONFIG = {
	project_name: 'YSM Global Network',
	pkg: require('../package.json'),
	webpack: {
		loaders: {
			imageLoader: IMAGE_LOADER_CONFIG
		},
		plugins: {
			copy: COPY_PLUGIN_CONFIG,
			modernizr: MODERNIZR_PLUGIN_CONFIG,
			optimizeCSS: OPTIMIZE_CSS_PLUGIN_CONFIG,
			provide: PROVIDE_PLUGIN_CONFIG,
			uglifyJS: UGLIFY_JS_PLUGIN_CONFIG,
			browsersync: (() => {
				try {
					return require('./webpack/plugins/local.browsersync.config').default;

				} catch(e) {
					return null;
				}
			})()
		},
		externals: {
			'jquery': 'jQuery'
		},
		includeModernizr: true
	},
	input: {
		folders: {
			base: {
				name: 'src'
			},
			js: {
				name: 'js'
			},
			styles: {
				name: 'scss'
			},
			images: {
				name: 'images'
			},
			fonts: {
				name: 'fonts'
			},
			vendors: {
				name: 'vendors'
			},
		},
		files: {
			js: [
				'ysm-global-network.main.js'
			],
			styles: [
				'ysm-global-network.main.scss'
			]
		}
	},
	output: {
		folders: {
			base: {
				name: 'dist'
			},
			js: {
				name: 'js'
			},
			styles: {
				name: 'css',
			},
			images: {
				name: 'images'
			},
			fonts: {
				name: 'fonts'
			}
		}
	}
};

export default BUILD_CONFIG;
