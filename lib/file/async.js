const fs = require("fs");
const abstract_async = require("./../abstract/async");

class file_async extends abstract_async {
	constructor(cerus, parent) {
		super(cerus, parent);
	}

	remove() {
		return super.remove();
	}

	append(data, {encoding, mode, flag} = {}) {
		return this._cerus.promisify(fs.appendFile)(this._parent._path, data, {encoding, mode, flag})
		.then(() => this._parent, {passthrough: true});
	}

	clear() {
		return this.truncate(0);
	}

	empty() {
		return this.clear();
	}

	create({exclusive, mode} = {}) {
		return this._cerus.promisify(fs.open)(this._parent._path, exclusive ? "x" : "a", mode)
		.then(fd => {
			fs.close(fd);

			return this._parent;
		}, {passthrough: true});
	}

	read({encoding, flag} = {}) {
		return this._cerus.promisify(fs.readFile)(this._parent._path, {encoding, flag})
		.then(data => {
			let _data = data;

			if(!Buffer.isBuffer(_data)) {
				_data = Buffer.from(_data);
			}

			return [_data, this._parent];
		}, {passthrough: true, multi: false});
	}

	load(options) {
		return this.read(options);
	}

	truncate(length) {
		return this._cerus.promisify(fs.truncate)(this._parent._path, length)
		.then(() => this._parent, {passthrough: true});
	}

	unwatch() {
		if(this._watcher === undefined) return;

		this._watcher.close();
		this._watcher = undefined;

		return this._cerus.promise().event("done");
	}

	watch({persistent, recursive, encoding} = {}) {
		return this._cerus.promise(event => {
			this._watcher = fs.watch(this._parent._path, {persistent, recursive, encoding});

			this._watcher.on("change", (type, file) => event(type, file, this._parent));
			this._watcher.on("error", err => event("error", err));
		});
	}

	write(data, {encoding, mode, flag} = {}) {
		return this._cerus.promisify(fs.writeFile)(this._parent._path, data, {encoding, mode, flag})
		.then(() => this._parent, {passthrough: true});
	}
}

module.exports = file_async;