/*eslint-env node*/
/*eslint vars-on-top: 0*/


var addAutoprefixer = (options, optionsPostcss) => {

	var Autoprefixer = require('autoprefixer');
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

	return optionsPostcss.plugins.push(new Autoprefixer(autoprefixerOptions));

};

var addOldie = (options, optionsPostcss) => {

	var PostcssOldie = require('oldie');
	var oldieOptions = {};

	return optionsPostcss.plugins.push(new PostcssOldie(oldieOptions));

};

module.exports = (params, optionsPostcss) => {

	optionsPostcss.plugins = [];

	if (params.postcssAutoprefixer && params.postcssAutoprefixer !== 'false') {
		addAutoprefixer(params.postcssAutoprefixer, optionsPostcss);
	}

	if (params.postcssOldie && params.postcssOldie !== 'false') {
		addOldie(params.postcssAutoprefixer, optionsPostcss);
	}

};
