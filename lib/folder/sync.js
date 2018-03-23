var fs = require("fs");
var fsextra = require("fs-extra");
var abstract_sync = require("./../abstract/sync");

class folder_sync extends abstract_sync {
	constructor(path, cerus) {
		super(path);

		this._cerus = cerus;
	}

	clear() {
		fsextra.emptyDirSync(this._path.path);
	}

	empty() {
		this.clear();
	}

	create(mode) {
		fs.mkdirSync(this._path.path, mode);
	}

	mkdir(mode) {
		this.create(mode);
	}

	file(file) {
		if(typeof file !== "string") {
			throw new TypeError("the argument file must be a string");
		}

		return this._cerus.file(this._path.path + (this._path.path.endsWith("/") ? file : "/" + file));
	}

	files(opts = {}) {
		return fs.readdirSync(this._path.path, opts);
	}
}

module.exports = folder_sync;