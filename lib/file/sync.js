var fs = require("fs");
var path = require("path");
var abstract_sync = require("./../abstract/sync");

class file_sync extends abstract_sync {
	constructor(cerus, path, data) {
		super(path);

		this._cerus = cerus;
		this._data = data;
	}

	remove() {
		this._data.data = "";
		super.remove();
	}

	append(data, opts = {}) {
		if(typeof data !== "string") {
			throw new TypeError("the argument data must be a string");
		}

		this._data.data += data;
		fs.appendFileSync(this._path.path, data, opts);
	}

	clone(dest, opts) {
		this.copy(dest, opts);
	}

	clear() {
		this.truncate(0);
	}

	empty() {
		this.clear();
	}

	ext() {
		return path.extname(this._path.path);
	}

	type() {
		return this.ext();
	}

	create(opts = {}) {
		if(opts["excl"]) {
			this._data.data = "";
		}

		fs.openSync(this._path.path, opts["excl"] ? "x" : "a", opts["mode"]);
	}

	data() {
		return this._data;
	}

	dir() {
		return path.dirname(this._path.path);
	}

	name() {
		return path.basename(this._path.path, this.ext());
	}

	pipe(response) {
		if(response === undefined) {
			throw new TypeError("the argument response must be a response");
		}

		var stream = fs.createReadStream(this._path.path);
		
		stream.pipe(response);
	}

	read(opts = {}) {
		this.data.data = fs.readFileSync(this._path.path, opts);

		return this._data.data;
	}

	truncate(length) {
		if(typeof length !== "number") {
			throw new TypeError("the argument length must be a number");
		}

		this._data.data = this._data.data.substring(0, length);
		fs.truncateSync(this._path.path, length);
	}

	unwatch(listener) {
		fs.unwatchFile(this._path.path, listener);
	}

	watch(listener, opts = {}) {
		// TODO: Add support for using a promise.
		fs.watch(this._path.path, opts, listener);
	}

	write(data, opts = {}) {
		this._data.data = data;
		fs.writeFileSync(this._path.path, data, opts);
	}
}

module.exports = file_sync;