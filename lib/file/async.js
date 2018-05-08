var fs = require("fs");
var abstract_async = require("./../abstract/async");

class file_async extends abstract_async {
	constructor(cerus, path, data, obj) {
		super(cerus, path, obj);

		this._data = data;
	}

	remove() {
		this._data.data = undefined;

		return super.remove();
	}

	append(data, opts = {}) {
		if(typeof data !== "string") {
			throw new TypeError("the argument data must be a string");
		}

		return this._cerus.promise(function(event) {
			fs.appendFile(this._path.path, data, opts, function(err) {
				if(err) {
					return event("error", err);
				}

				event("done", this._obj);
			}.bind(this));
		}.bind(this));
	}

	clone(dest, opts) {
		return this.copy(dest, opts);
	}

	clear() {
		return this.truncate(0);
	}

	empty() {
		return this.clear();
	}

	create(opts = {}) {
		if(opts["excl"]) {
			this._data.data = "";
		}

		return this._cerus.promise(function(event) {
			fs.open(this._path.path, opts["excl"] ? "x" : "a", opts["mode"], function(err, fd) {
				if(err) {
					return event("error", err);
				}

				event("done", fd, this._obj);

				fs.close(fd);
			}.bind(this));
		}.bind(this));
	}

	read(opts = {}) {
		return this._cerus.promise(function(event) {
			fs.readFile(this._path.path, opts, function(err, data) {
				if(err) {
					return event("error", err);
				}

				if(!Buffer.isBuffer(data)) {
					data = Buffer.from(data);
				}

				event("done", (this._data.data = data), this._obj);
			}.bind(this));
		}.bind(this));
	}

	load(opts) {
		return this.read(opts);
	}

	truncate(length) {
		if(typeof length !== "number") {
			throw new TypeError("the argument length must be a number");
		}

		return this._cerus.promise(function(event) {
			fs.truncate(this._path.path, length, function(err) {
				if(err) {
					return event("error", err);
				}

				event("done", this._obj);
			}.bind(this));
		}.bind(this));
	}

	write(data, opts = {}) {
		return this._cerus.promise(function(event) {
			fs.writeFile(this._path.path, data, opts, function(err) {
				if(err) {
					return event("error", err);
				}

				event("done", this._obj);
			}.bind(this));
		}.bind(this));
	}
}

module.exports = file_async;