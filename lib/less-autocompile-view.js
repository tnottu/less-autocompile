/*eslint-env node*/
/*eslint vars-on-top: 0*/

'use strict';

var async = require('async');
var fs = require('fs');
var less = require('less');
var mkdirp = require('mkdirp');
var path = require('path');
var readline = require('readline');
var postcss = require('postcss');

var lessPlugins = require('./less-plugins.js');
var postcssPlugins = require('./postcss-plugins.js');

module.exports =
	class LessAutocompileView {

		constructor(serializeState) {
			atom.commands.add('atom-workspace', {
				'core:save': () => this.handleSave()
			});
		}

		serialize() {}

		destroy() {}

		handleSave() {
			this.activeEditor = atom.workspace.getActiveTextEditor();

			if (this.activeEditor) {
				this.filePath = this.activeEditor.getURI();
				this.fileExt = path.extname(this.filePath);

				if (this.fileExt === '.less') {
					this.getParams(this.filePath, (params) => {
						this.compileLess(params);
					});
				}
			}
		}

		writeFiles(output, newPath, newFile) {

			async.series({
				css: (callback) => {
					if (output.css) {
						this.writeFile(output.css, newPath, newFile, function() {
							callback(null, newFile);
						});
					} else {
						callback(null, null);
					}
				},
				map: (callback) => {

					let newFileMap = `${newFile}.map`;

					if (output.map) {

						this.writeFile(output.map, newPath, newFileMap, function() {
							callback(null, newFileMap);
						});
					} else {
						callback(null, null);
					}
				},
				unmq: (callback) => {
					if (output.unmq) {
						let newFileUnmq = newFile.replace('.css', '.unmq.css');

						this.writeFile(output.unmq, newPath, newFileUnmq, function() {
							callback(null, newFileUnmq);
						});
					} else {
						callback(null, null);
					}
				}
			}, function(err, results) {
				if (err) {
					return atom.notifications.addError(err, {
						dismissable: true
					});
				} else {
					if (results.map !== null) {
						atom.notifications.addSuccess('Files created', {
							detail: `${results.css}\n${results.map}`
						});
					} else {
						atom.notifications.addSuccess('File created', {
							detail: results.css
						});
					}
				}
			});
		}

		compileLess(params) {

			if (!params.out) {
				return;
			}

			var firstLine = true;
			var contentFile = [];
			var optionsLess = {
				paths: [path.dirname(path.resolve(params.file))],
				filename: path.basename(params.file),
				compress: params.compress === 'true',
				sourceMap: params.sourcemap === 'true' ? ({}) : false
			};

			lessPlugins(params, optionsLess);

			var optionsPostcss = {};

			postcssPlugins(params, optionsPostcss);

			var rl = readline.createInterface({
				input: fs.createReadStream(params.file),
				terminal: false
			});

			rl.on('line', function(line) {
				if (!firstLine) {
					contentFile.push(line);
				} else {
					firstLine = false;
				}
				return firstLine;
			});

			rl.on('close', () => {
				this.renderLess(params, contentFile, optionsLess, optionsPostcss);
			});

		}

		renderLess(params, contentFile, optionsLess, optionsPostcss) {

			var contentFileJoined = contentFile.join('\n');

			less.render(contentFileJoined, optionsLess).then((output) => {

				var newFile = path.resolve(path.dirname(params.file), params.out);
				var newPath = path.dirname(newFile);

				if (!optionsPostcss.plugins.length) {
					this.writeFiles(output, newPath, newFile);
				} else {
					this.processPostcss(output, newPath, newFile, optionsPostcss);
				}

			}, function(err) {

				if (err) {
					atom.notifications.addError(err.message, {
						detail: `${err.filename}:${err.line}`,
						dismissable: true
					});
				}

			});

		}

		processPostcss(lessOutput, newPath, newFile, optionsPostcss) {

			var unmqIndex = optionsPostcss.plugins.findIndex((plugin) => plugin.postcssPlugin === 'postcss-unmq');
			var unmq = (unmqIndex > -1) ? optionsPostcss.plugins.splice(unmqIndex, 1) : false;

			postcss(optionsPostcss.plugins).process(lessOutput.css, {
				from: this.filePath,
				to: newFile,
				map: {
					prev: lessOutput.map,
					annotation: true
				}
			})
			.then((result) => {

				var resultBeforeUnmq = result;

				if (!unmq) {
					this.writeFiles(result, newPath, newFile);
				} else {
					postcss(unmq).process(resultBeforeUnmq.css, {
						from: this.filePath,
						to: newFile,
						map: false
					})
					.then((result) => {
						resultBeforeUnmq.unmq = result.css;
						this.writeFiles(resultBeforeUnmq, newPath, newFile);
					});
				}
			});


		}

		writeFile(contentFile, newPath, newFile, callback) {
			return mkdirp(newPath, function(err) {
				if (err) {
					atom.notifications.addError(err, {
						dismissable: true
					});
				} else {
					fs.writeFile(newFile, contentFile, callback);
				}
			});
		}

		getParams(filePath, callback) {

			if (!fs.existsSync(filePath)) {
				atom.notifications.addError(`${filePath} not exist`, {
					dismissable: true
				});

				return;
			}

			this.params = {
				file: filePath
			};

			this.firstLine = true;

			var rl = readline.createInterface({
				input: fs.createReadStream(filePath),
				terminal: false
			});

			rl.on('line', (line) => {
				this.parseFirstLine(line);
			});

			rl.on('close', () => {
				if (this.params.main) {
					this.getParams(path.resolve(path.dirname(filePath), this.params.main), callback);
				} else {
					callback(this.params);
				}
			});
		}

		parseFirstLine(line) {

			if (!this.firstLine) {
				return;
			}

			this.firstLine = false;

			line.split(',').forEach((item) => {
				var i = item.indexOf(':');

				if (i < 0) {
					return;
				}

				var key = item.substr(0, i).trim();
				var match = /^\s*\/\/\s*(.+)/.exec(key);

				if (match) {
					key = match[1];
				}

				this.params[key] = item.substr(i + 1).trim();

			});
		}
	};
