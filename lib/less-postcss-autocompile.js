/*eslint-env node*/
/*eslint vars-on-top: 0*/

var Autocompile;
var CompileView = require('./less-postcss-autocompile-view.js');
var CompositeDisposable = require('atom');

module.exports = Autocompile = {

	lessAutocompileView: null,

	activate(state) {
		this.autocompileView = new CompileView(state.lessAutocompileViewState);
	},

	deactivate() {
		this.autocompileView.destroy();
	},

	serialize() {
		return {
			lessAutocompileViewState: this.autocompileView.serialize()
		};
	}

};
