import * as path from 'path';
import * as shellJs from 'shelljs';
import * as readlineSync from 'readline-sync';
import * as chalk from 'chalk';

let hostUrl: string = 'localhost';
let proxyUrl: string = '';
let usingProxy: boolean = false;
let portNumber: number = 3000;
let fileExtensions: string[] = [];
let serverType: string = 'server';
let serverTypeValue: any = {
	baseDir: ['../']
};
let openWhichUrl: string = 'internal';

const SKELETON_FILE: string = 'browsersync.config.ts';
const SKELETON_FILE_PATH: string = `./config/.skel/webpack/plugins/${ SKELETON_FILE }`;

const LOCAL_FILE: string = 'local.browsersync.config.ts';
const LOCAL_FILE_PATH: string = `./config/webpack/plugins/${ LOCAL_FILE }`;

console.log('\n--------------------------------------------------');
console.log('Browsersync Setup');
console.log('--------------------------------------------------');

// There is no local browsersync.config file.
if (!shellJs.test('-f', path.resolve(LOCAL_FILE_PATH))) {
	// Make a local copy of the skeleton browsersync file
	// and put in config/webpack/plugins directory.
	shellJs.cp(
		path.resolve(SKELETON_FILE_PATH),
		path.resolve(LOCAL_FILE_PATH)
	);

	if (readlineSync.keyInYNStrict('\nDo you need to use a proxy server to process server-side files like PHP?: ')) {
		serverType = 'proxy';
		usingProxy = true;
		openWhichUrl = 'external';

		proxyUrl = readlineSync.question('\nWhat is the url of the proxy? Please include the http protocol: ', {
			limit: function(input) {
				return /^https?:\/\/.+$/.test(input);
			},
			limitMessage: 'Please include the http protocol.'
		});

		// Change the server type property to be the proxy url.
		serverTypeValue = proxyUrl;

		// Since a proxy is being used, we want the host url
		// to be the same as the proxy url without the http protocol.
		hostUrl = proxyUrl.split('//')[1];
	}

	if (!usingProxy) {
		hostUrl = readlineSync.question(`\nWhat url do you want to use for Browsersync? Do not include the http protocol. (Default is '${ hostUrl }'): `, {
			limit: function(input) {
				return /^(?!https?:\/\/).+$/.test(input);
			},
			limitMessage: 'Do not include the http or https protocol.',
			defaultInput: hostUrl
		});
	}

	portNumber = readlineSync.question(`\nWhat port number do you want Browsersync to use with your url? (Default is ${ portNumber }): `, {
		limit: function(input) {
			return /^[0-9]+$/.test(input);
		},
		limitMessage: 'Please use only numbers.',
		defaultInput: portNumber
	});

	//////////////////////////////////////////////////
	// REPLACE PLACEHOLDERS WITH USER VALUES
	//////////////////////////////////////////////////

	shellJs.sed(
		'-i',
		/host_url/,
		hostUrl,
		path.resolve(LOCAL_FILE_PATH)
	);

	shellJs.sed(
		'-i',
		/port_number/,
		portNumber,
		path.resolve(LOCAL_FILE_PATH)
	);

	shellJs.sed(
		'-i',
		/server_type/,
		serverType,
		path.resolve(LOCAL_FILE_PATH)
	);

	shellJs.sed(
		'-i',
		/'server_type_value'/,
		JSON.stringify(serverTypeValue).replace(/\"/g, '\''),
		path.resolve(LOCAL_FILE_PATH)
	);

	shellJs.sed(
		'-i',
		/open_which_url/,
		openWhichUrl,
		path.resolve(LOCAL_FILE_PATH)
	);

	console.log('\n--------------------------------------------------');
	console.log('Browsersync Setup Complete');
	console.log('--------------------------------------------------');
	
	console.log(`\nWhen you run ${ chalk.bgBlue.bold('npm run webpack:watch') }, browsersync will automatically start.`);
	console.log(`\nMake sure you add ${ chalk.bold(LOCAL_FILE) } to your .gitignore file.  This is your local copy and it shouldn't be tracked in GIT.`);
	
// A local browsersync.config file already exists.
} else {
	console.log(`\n${ chalk.red('A browsersync configuration file already exists.') }`);
}