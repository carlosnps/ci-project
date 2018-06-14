import * as path from 'path';
import * as webpack from 'webpack';
import * as extractTextWebpackPlugin from 'extract-text-webpack-plugin';
import * as copyWebpackPlugin from 'copy-webpack-plugin';
import * as modernizrWebpackPlugin from 'modernizr-webpack-plugin';
import * as optimizeCSSAssetsWebpackPlugin from 'optimize-css-assets-webpack-plugin';
import * as autoprefixer from 'autoprefixer';
import * as browsersyncWebpackPlugin from 'browser-sync-webpack-plugin';
import * as moment from 'moment';
import * as shellJs from 'shelljs';
import * as cleanWebpackPlugin from 'clean-webpack-plugin';

import BUILD_CONFIG from './config/build.config';
import UTILITIES from './config/_utilities';

const ENTRY_FILES: any = {};
const PLUGINS: any[] = [];
const FOLDERS_TO_COPY: any[] = [];

//////////////////////////////////////////////////
// CREATE AN ARRAY OF FOLDERS TO COPY
// FROM SOURCE FOLDER TO DESTINATION FOLDER
//////////////////////////////////////////////////

BUILD_CONFIG.webpack.plugins.copy.folders.forEach((folder) => {
	FOLDERS_TO_COPY.push({
		context: path.resolve(BUILD_CONFIG.input.folders.base.name, folder),
		from: '**/*',
		to: folder
	});
});

//////////////////////////////////////////////////
// CREATE THE ENTRY FILES OBJECT
//////////////////////////////////////////////////

BUILD_CONFIG.input.files.js.forEach((file) => {
	ENTRY_FILES[file.split('.js')[0]] = path.resolve(`${ BUILD_CONFIG.input.folders.base.name }/${ BUILD_CONFIG.input.folders.js.name }/${ file }`);
});

//////////////////////////////////////////////////
// DEFINE ALL THE PLUGINS
//////////////////////////////////////////////////

// Only add these plugins when the environment is production.
if (process.env.NODE_ENV == 'production') {
	PLUGINS.push(new optimizeCSSAssetsWebpackPlugin(BUILD_CONFIG.webpack.plugins.optimizeCSS));
	PLUGINS.push(new webpack.optimize.UglifyJsPlugin(BUILD_CONFIG.webpack.plugins.uglifyJS));
	PLUGINS.push(new cleanWebpackPlugin(`${ __dirname }/${ BUILD_CONFIG.output.folders.base.name }`));
}

PLUGINS.push(new extractTextWebpackPlugin(`${ BUILD_CONFIG.output.folders.styles.name }/[name].min.css`));

PLUGINS.push(new webpack.NamedModulesPlugin());

PLUGINS.push(new webpack.ProvidePlugin(BUILD_CONFIG.webpack.plugins.provide));

PLUGINS.push(new webpack.BannerPlugin({
	banner: [
		`@client: ${ BUILD_CONFIG.pkg.client }`,
		`@description: ${ BUILD_CONFIG.pkg.description }`,
		`@version: ${ BUILD_CONFIG.pkg.version }`,
		`@build: ${ moment().format('YYYY-MM-DD | HHmmss') }`
	].join('\n')
}));

PLUGINS.push(new copyWebpackPlugin(FOLDERS_TO_COPY, {
	ignore: BUILD_CONFIG.webpack.plugins.copy.ignoreFiles,
	copyUnmodified: true
}));

if (BUILD_CONFIG.webpack.includeModernizr) {
	PLUGINS.push(new modernizrWebpackPlugin(BUILD_CONFIG.webpack.plugins.modernizr));
}

if (BUILD_CONFIG.webpack.plugins.browsersync !== null) {
	PLUGINS.push(new browsersyncWebpackPlugin(BUILD_CONFIG.webpack.plugins.browsersync));
}

//////////////////////////////////////////////////
// CONFIGURE WEBPACK
//////////////////////////////////////////////////

// Force the webpack configuration to use the new syntax.
interface WebackConfig extends webpack.Configuration {
	module: {
		rules: webpack.NewUseRule[]
	},
	resolve: webpack.Resolve
}

const WEBPACK_CONFIG: WebackConfig = {
	entry: ENTRY_FILES,
	externals: BUILD_CONFIG.webpack.externals,
	output: {
		path: path.join(`${ __dirname }/${ BUILD_CONFIG.output.folders.base.name }`),
		publicPath: '../',
		filename: `${ BUILD_CONFIG.output.folders.js.name }/[name].min.js`
	},
	stats: {
		children: false
	},
	module: {
		rules: [{
			test: /\.js$/,
			use: [{
				loader: 'babel-loader',
				options: {
					presets: [
						['es2015', {
							'modules': false
						}]
					]
				}
			}, {
				loader: 'imports-loader?define=>false'
			}],
			exclude: /node_modules/,
		}, {
			test: /\.(css|scss)$/,
			use: extractTextWebpackPlugin.extract({
				fallback: 'style-loader',
				use: 'css-loader!postcss-loader!sass-loader'
			})
		}, {
			test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
			include: [/fonts?/],
			use: [{
				loader: 'url-loader',
				options: {
					limit: 1000,
					name: `${ BUILD_CONFIG.output.folders.fonts.name }/[name].[ext]`
				}
			}]
		}, {
			test: /\.(gif|png|jpe?g|svg)$/,
			exclude: [/fonts?/],
			use: [{
				loader: 'url-loader',
				options: {
					limit: 1000,
					name: `${ BUILD_CONFIG.output.folders.images.name }/[name].[ext]`
				}
			}]
		}, {
			test: /\.(gif|png|jpe?g|svg)$/,
			include: path.resolve(`${ BUILD_CONFIG.input.folders.base.name }/${ BUILD_CONFIG.input.folders.images }`),
			use: [{
				loader: 'file-loader',
				options: {
					name: `${ BUILD_CONFIG.output.folders.images.name }/[name].[ext]`
				}
			}, {
				loader: 'image-webpack-loader',
				options: BUILD_CONFIG.webpack.loaders.imageLoader
			}]
		}]
	},
	resolve: {
		modules: [
			path.resolve(`${ BUILD_CONFIG.input.folders.base.name }/${ BUILD_CONFIG.input.folders.js.name }`),
			'node_modules'
		],
		alias: {
			'src:styles$': path.resolve(`${ BUILD_CONFIG.input.folders.base.name }/${ BUILD_CONFIG.input.folders.styles.name }/${ BUILD_CONFIG.input.files.styles }`),
			'src:images$': path.resolve(`${ BUILD_CONFIG.input.folders.base.name }/${ BUILD_CONFIG.input.folders.images.name }`),
			'src:vendors': path.resolve(`${ BUILD_CONFIG.input.folders.base.name }/${ BUILD_CONFIG.input.folders.vendors.name }`)
		}
	},
	plugins: PLUGINS,
	devtool: (process.env.NODE_ENV == 'production') ? 'source-map' : 'cheap-eval-source-map'
};

export default WEBPACK_CONFIG;