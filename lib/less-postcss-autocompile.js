'use babel';

/*eslint-env node*/
/*eslint vars-on-top: 0*/

import AutocompileView from './less-postcss-autocompile-view.js';

export default {

	activate(state) {
		this.autocompileView = new AutocompileView(state.autocompileViewState);
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
