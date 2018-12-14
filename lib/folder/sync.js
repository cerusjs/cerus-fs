var fs = require("fs");
var fsextra = require("fs-extra");
var abstract_sync = require("./../abstract/sync");

class folder_sync extends abstract_sync {
	constructor(cerus, parent) {
		super(cerus, parent);
	}

	clear() {
		fsextra.emptyDirSync(this._parent._path);

		return this._parent;
	}

	empty() {
		return this.clear();
	}

	create({mode} = {}) {
		fs.mkdirSync(this._parent._path, mode);

		return this._parent;
	}

	mkdir(options) {
		return this.create(options);
	}

	file(filename) {
		return this._cerus.file(this._parent._path + (this._parent._path.endsWith("/") ? filename : "/" + filename));
	}

	files({encoding} = {}) {
		return fs.readdirSync(this._parent._path, {encoding});
	}
}

module.exports = folder_sync;