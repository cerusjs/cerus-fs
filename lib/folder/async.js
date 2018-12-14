const fs = require("fs");
const fsextra = require("fs-extra");
const abstract_async = require("./../abstract/async");

class folder_async extends abstract_async {
	constructor(cerus, parent) {
		super(cerus, parent);
	}

	clear() {
		return this._cerus.promise(fsextra.emptyDir(this._parent._path))
		.then(() => this._parent, {passthrough: true});
	}

	empty() {
		return this.clear();
	}

	create({mode} = {}) {
		return this._cerus.promisify(fs.mkdir)(this._parent._path, {mode})
		.then(() => this._parent, {passthrough: true});
	}

	mkdir(options) {
		return this.create(options);
	}

	mkdirp({mode} = {}) {
		return this._cerus.promise(fsextra.mkdirp(this._parent._path, {mode}))
		.then(() => this._parent, {passthrough: true});
	}

	files({encoding} = {}) {
		return this._cerus.promise(event => {
			this._cerus.promisify(fs.readdir)(this._parent._path, {encoding})
			.then(files => {
				files.forEach((filename, index) => {
					let file = this._cerus.file(this._parent._path + (this._parent._path.endsWith("/") ? filename : "/" + filename));

					file.stats().is().file()
					.then(is_file => {
						if(!is_file) return;

						event("file", file, this._parent);

						if(index === (files.length - 1)) event("finish", this._parent);
					});
				});
			})
			.catch(err => event("error", err));
		});
	}
}

module.exports = folder_async;