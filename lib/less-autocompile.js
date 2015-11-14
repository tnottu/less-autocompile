'use babel';

var LessAutocompile;
var LessAutocompileView = require('./less-autocompile-view.js');
var CompositeDisposable = require('atom');

module.exports = LessAutocompile = {

	lessAutocompileView: null,

	activate(state) {
		return this.lessAutocompileView = new LessAutocompileView(state.lessAutocompileViewState);
	},

	deactivate() {
		return this.lessAutocompileView.destroy();
	},

	serialize() {
		return {
			lessAutocompileViewState: this.lessAutocompileView.serialize()
		};
	}

};
