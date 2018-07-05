var fs = require("fs");
var abstract_async = require("./../abstract/async");

class folder_async extends abstract_async {
	constructor(cerus, path, obj) {
		super(cerus, path, obj);
	}

	clear() {
		return this._cerus.promise(function(event) {
			fs.emptyDir(this._path.path, function(err) {
				if(err) {
					return event("error", err);
				}

				event("done", this._obj);
			}.bind(this));
		}.bind(this));
	}

	empty() {
		return this.clear();
	}

	create(mode) {
		return this._cerus.promise(function(event) {
			fs.mkdir(this._path.path, mode, function(err) {
				if(err) {
					return event("error", err);
				}

				event("done", this._obj);
			}.bind(this));
		}.bind(this));
	}

	mkdir(mode) {
		return this.create(mode);
	}

	files(opts = {}) {
		return this._cerus.promise(function(event) {
			fs.readdir(this._path.path, opts, function(err, files) {
				if(err) {
					return event("error", err);
				}
				
				files.forEach(function(filename, index) {
					var file = this._cerus.file(this._path.path + (this._path.path.endsWith("/") ? filename : "/" + filename));

					file.stats().is().file()
					.then(function(isfile) {
						if(!isfile) {
							if(index === (files.length - 1)) {
								event("finish", this._obj);
							}

							return;
						}

						event("file", file, (index === (files.length - 1)), this._obj);
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}.bind(this));
	}
}

module.exports = folder_async;