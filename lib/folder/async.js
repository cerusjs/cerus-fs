var fs = require("fs");
var abstract_async = require("./../abstract/async");

class folder_async extends abstract_async {
	constructor(cerus, path) {
		super(cerus, path);
	}

	clear() {
		return this._cerus.promise(function(event) {
			fs.emptyDir(this._path.path, function(err) {
				if(err) {
					return event("error");
				}

				event("done");
			});
		}.bind(this));
	}

	empty() {
		this.clear();
	}

	create(mode) {
		return this._cerus.promise(function(event) {
			fs.mkdir(this._path.path, mode, function(err) {
				if(err) {
					return event("error");
				}

				event("done");
			});
		}.bind(this));
	}

	mkdir(mode) {
		this.create(mode);
	}

	files(opts = {}) {
		return this._cerus.promise(function(event) {
			fs.readdir(this._path.path, opts, function(err, files) {
				if(err) {
					return event("error");
				}

				files.forEach(function(filename, index) {
					event("file", this._cerus.file(this._path.path + (this._path.path.endsWith("/") ? filename : "/" + filename), (index === (files.length - 1))));

					if(index === (files.length - 1)) {
						event("finish");
					}
				}.bind(this));
			}.bind(this));
		}.bind(this));
	}
}

module.exports = folder_async;