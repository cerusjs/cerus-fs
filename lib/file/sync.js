var fs = require("fs");
var path = require("path");
var abstract_sync = require("./../abstract/sync");

class file_sync extends abstract_sync {
	constructor(cerus, path, data, obj) {
		super(path, obj);

		this._cerus = cerus;
		this._data = data;
	}

	append(data, opts = {}) {
		if(typeof data !== "string") {
			throw new TypeError("the argument data must be a string");
		}

		fs.appendFileSync(this._path.path, data, opts);

		return this._obj;
	}

	clear() {
		return this.truncate(0);
	}

	create(opts = {}) {
		if(this.exists() && this.stats().is().directory()) {
			throw new Error("Error: EISDIR, file cannot be a folder");
		}

		fs.closeSync(fs.openSync(this._path.path, "w", opts["mode"]));

		return this._obj;
	}

	empty() {
		return this.clear();
	}

	ext() {
		return path.extname(this._path.path);
	}

	data() {
		return this._data.data;
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

		return this._obj;
	}

	read(opts = {}) {
		var data = fs.readFileSync(this._path.path, opts);

		if(!Buffer.isBuffer(data)) {
			data = Buffer.from(data);
		}

		return (this._data.data = data);
	}

	remove() {
		this._data.data = undefined;
		
		return super.remove();
	}

	truncate(length) {
		if(typeof length !== "number") {
			throw new TypeError("the argument length must be a number");
		}

		fs.truncateSync(this._path.path, length);

		return this._obj;
	}

	type() {
		return this.ext();
	}

	unwatch(listener) {
		fs.unwatchFile(this._path.path, listener);

		return this._obj;
	}

	watch(listener, opts = {}) {
		// TODO: Add support for using a promise.
		fs.watch(this._path.path, opts, listener);

		return this._obj;
	}

	write(data, opts = {}) {
		var data_ = data;

		if(typeof data_ === "string") {
			data_ = Buffer.from(data, opts["encoding"]);
		}
		else if(!Buffer.isBuffer(data_)) {
			throw new TypeError("the argument data must be a string or buffer");
		}

		fs.writeFileSync(this._path.path, data_, opts);

		return this._obj;
	}
}

module.exports = file_sync;