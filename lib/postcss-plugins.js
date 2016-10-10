'use babel';

/*eslint-env node*/
/*eslint vars-on-top: 0*/


var addAutoprefixer = (options, optionsPostcss) => {

	var autoprefixer = require('autoprefixer');
	var autoprefixerOptions = {
		'browsers': [
			'last 4 versions',
			'> 5%',
			'ie 9',
			'ie 8',
			'Firefox ESR',
			'iOS 7'
		]
	};

	if (typeof options === 'string' && options !== 'true') {
		autoprefixerOptions.browsers = options.split(';');
	}

	return optionsPostcss.plugins.push(autoprefixer(autoprefixerOptions));

};

var addOldie = (options, optionsPostcss) => {

	var oldie = require('oldie');
	var oldieOptions = {};

	return optionsPostcss.plugins.push(oldie(oldieOptions));

};

var addCssnano = (options, optionsPostcss) => {

	var cssnano = require('cssnano');
	var cssnanoOptions = {
		safe: options === 'safe'
	};

	return optionsPostcss.plugins.push(cssnano(cssnanoOptions));

};

export default (params, optionsPostcss) => {

	optionsPostcss.plugins = [];

	if (params.autoprefixer && params.autoprefixer !== 'false') {
		addAutoprefixer(params.autoprefixer, optionsPostcss);
	}

	if (params.oldie === 'true') {
		addOldie(params.oldie, optionsPostcss);
	}

	if (params.compress && params.compress !== 'false') {
		addCssnano(params.compress, optionsPostcss);
	}

};
