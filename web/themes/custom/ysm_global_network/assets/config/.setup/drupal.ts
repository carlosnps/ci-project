// import * as path from 'path';
// import * as shellJs from 'shelljs';
// import * as readlineSync from 'readline-sync';

// const TEMPLATE_FOLDERS = [
// 	'core',
// 	'fields',
// 	'nodes',
// 	'pages',
// 	'taxonomy',
// 	'views'
// ];

// let baseTemplateFolder = 'templates';

// const DRUPAL = {
// 	configure(callback) {
// 		let _callback = (typeof callback == 'function') ? callback : new Function();

// 		// Check if tpl folder exists.
// 		if (shellJs.test('-d', path.resolve('../tpl'))) {
// 			baseTemplateFolder = 'tpl';
// 		}
		
// 		if (readlineSync.keyInYNStrict('\nAre you using Drupal for this project?: ')) {
// 			if (readlineSync.keyInYNStrict('\nDo you want to create the Drupal template folders?: ')) {
// 				shellJs.exec(`mkdir -p "${ path.resolve('..') }/${ baseTemplateFolder }"/{${ TEMPLATE_FOLDERS.toString() }}`, function() {
// 					_callback();
// 				});
// 			} else {
// 				_callback();
// 			}
		
// 		} else {
// 			_callback();
// 		}
// 	}
// };

// export default DRUPAL;