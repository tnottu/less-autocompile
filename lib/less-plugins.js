/*eslint-env node*/
/*eslint vars-on-top: 0*/

var addAutoprefix = (options, optionsLess) => {

	var AutoprefixLessPlugin = require('less-plugin-autoprefix');

	var autoprefixOptions = {};

	if (typeof options === 'string') {
		autoprefixOptions.browsers = options.split(';');
	}

	return optionsLess.plugins.push(new AutoprefixLessPlugin(autoprefixOptions));

};

var addCleanCss = (options, optionsLess) => {

	var CleanCssLessPlugin = require('less-plugin-clean-css');

	var cleancssOptions = {};

	if (typeof options === 'string') {
		cleancssOptions.compatibility = options;
	}

	return optionsLess.plugins.push(new CleanCssLessPlugin(cleancssOptions));

};

export default (params, optionsLess) => {

	optionsLess.plugins = [];

	if (params.autoprefix) {
		addAutoprefix(params.autoprefix, optionsLess);
	}
	if (params.cleancss) {
		return addCleanCss(params.cleancss, optionsLess);
	}

};
