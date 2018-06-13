import * as path from 'path';
import * as shellJs from 'shelljs';
import BUILD_CONFIG from './build.config';

const UTILITIES = {
	/**
	 * Finds the main JS file and returns it.
	 *	
	 * @return {string}
	 * 	The main JS file.
	 */
	getMainJsFile() {
		return BUILD_CONFIG.input.files.js.filter((file) => {
			if (file.indexOf('main') >= 0) {
				return file;
			}
		}).pop();
	},

	/**
	 * Finds the main style file and returns it.
	 *
	 * @return {string}
	 * 	The main styles file.
	 */
	getMainStyleFile() {
		return BUILD_CONFIG.input.files.styles.filter((file) => {
			if (file.indexOf('main') >= 0) {
				return file;
			}
		}).pop();
	}
};

export default UTILITIES;