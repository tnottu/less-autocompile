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

var addUnmq = (options, optionsPostcss) => {

	var PostcssUnmq = require('postcss-unmq');

	var unmqOptions = {};

	if (typeof options === 'string' && options !== 'true') {
		unmqOptions.width = parseInt(options, 10);
	}

	return optionsPostcss.plugins.push(new PostcssUnmq(unmqOptions));

};

module.exports = (params, optionsPostcss) => {

	optionsPostcss.plugins = [];

	if (params.postcssAutoprefixer) {
		addAutoprefixer(params.postcssAutoprefixer, optionsPostcss);
	}

	if (params.postcssUnmq) {
		return addUnmq(params.postcssUnmq, optionsPostcss);
	}

};
