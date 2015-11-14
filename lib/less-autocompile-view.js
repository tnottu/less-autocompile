'use babel';

var async = require('async');
var fs = require('fs');
var less = require('less');
var mkdirp = require('mkdirp');
var path = require('path');
var readline = require('readline');

var lessPlugins = require('./less-plugins.js');

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
					return this.getParams(this.filePath, (params) => {
						return this.compileLess(params);
					});
				}
			}
		}

		writeFiles(output, newPath, newFile) {
			async.series({
				css: (callback) => {

					console.log(output, newPath, newFile);

					if (output.css) {
						return this.writeFile(output.css, newPath, newFile, function() {
							return callback(null, newFile);
						});
					} else {
						return callback(null, null);
					}
				},
				map: (callback) => {
					if (output.map) {
						newFile = `${newFile}.map`;

						return this.writeFile(output.map, newPath, newFile, function() {
							return callback(null, newFile);
						});
					} else {
						return callback(null, null);
					}
				}
			}, function(err, results) {
				if (err) {
					return atom.notifications.addError(err, {
						dismissable: true
					});
				} else {
					if (results.map !== null) {
						return atom.notifications.addSuccess('Files created', {
							detail: `${results.css}\n${results.map}`
						});
					} else {
						return atom.notifications.addSuccess('File created', {
							detail: results.css
						});
					}
				}
			});
		}

		writeFile(contentFile, newPath, newFile, callback) {
			return mkdirp(newPath, function(err) {
				if (err) {
					return atom.notifications.addError(err, {
						dismissable: true
					});
				} else {
					return fs.writeFile(newFile, contentFile, callback);
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
				compress: params.compress === 'true' ? true : false,
				sourceMap: params.sourcemap === 'true' ? ({}) : false
			};

			lessPlugins(params, optionsLess);

			var rl = readline.createInterface({
				input: fs.createReadStream(params.file),
				terminal: false
			});

			rl.on('line', function(line) {
				if (!firstLine) {
					contentFile.push(line);
				}

				return firstLine = false;
			});

			return rl.on('close', () => {
				return this.renderLess(params, contentFile, optionsLess);
			});
		}

		renderLess(params, contentFile, optionsLess) {
			contentFile = contentFile.join("\n");

			less.render(contentFile, optionsLess).then((output) => {
				var newFile = path.resolve(path.dirname(params.file), params.out);
				var newPath = path.dirname(newFile);

				return this.writeFiles(output, newPath, newFile);
			}, function(err) {

				if (err) {
					return atom.notifications.addError(err.message, {
						detail: `${err.filename}:${err.line}`,
						dismissable: true
					});
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
				return this.parseFirstLine(line);
			});

			return rl.on('close', () => {
				if (this.params.main) {
					return this.getParams(path.resolve(path.dirname(filePath), this.params.main), callback);
				} else {
					return callback(this.params);
				}
			});
		}

		parseFirstLine(line) {
			if (!this.firstLine) {
				return;
			}

			this.firstLine = false;

			return line.split(',').forEach((item) => {
				var i = item.indexOf(':');

				if (i < 0) {
					return;
				}

				var key = item.substr(0, i).trim();
				var match = /^\s*\/\/\s*(.+)/.exec(key);

				if (match) {
					key = match[1];
				}

				var value = item.substr(i + 1).trim();

				return this.params[key] = value;
			});
		}
	};
