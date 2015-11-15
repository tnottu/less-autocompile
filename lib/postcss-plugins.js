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
	var cssnanoOptions = {};

	return optionsPostcss.plugins.push(cssnano(cssnanoOptions));

};

module.exports = (params, optionsPostcss) => {

	optionsPostcss.plugins = [];

	if (params.postcssAutoprefixer && params.postcssAutoprefixer !== 'false') {
		addAutoprefixer(params.postcssAutoprefixer, optionsPostcss);
	}

	if (params.postcssOldie == 'true') {
		addOldie(params.postcssOldie, optionsPostcss);
	}

	if (params.compress == 'true') {
		addCssnano(params.compress, optionsPostcss);
	}

};
