var fs = require("fs");
var abstract_async = require("./../abstract/async");

class file_async extends abstract_async {
	constructor(cerus, path, data) {
		super(cerus, path);

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

		return this._cerus.promise(function(event) {
			fs.appendFile(this._path.path, data, opts, function(err) {
				if(err) {
					return event("error", err);
				}

				event("done");
			});
		}.bind(this));
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

	create(opts = {}) {
		if(opts["excl"]) {
			this._data.data = "";
		}

		return this._cerus.promise(function(event) {
			fs.open(this._path.path, opts["excl"] ? "x" : "a", opts["mode"], function(err, fd) {
				if(err) {
					return event("error", err);
				}

				event("done", fd);
			});
		}.bind(this));
	}

	read(opts = {}) {
		return this._cerus.promise(function(event) {
			fs.readFile(this._path.path, opts, function(err, data) {
				if(err) {
					return event("error", err);
				}

				var data_ = data;

				if(Buffer.isBuffer(data_)) {
					data_ = data_.toString();
				}

				this._data.data = data_;

				event("done", data_);
			}.bind(this));
		}.bind(this));
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

				this.data.data = this.data.substring(0, length);

				event("done");
			}.bind(this));
		}.bind(this));
	}

	write(data, opts = {}) {
		return this._cerus.promise(function(event) {
			fs.writeFile(this._path.path, data, opts, function(err) {
				if(err) {
					return event("error", err);
				}

				this._data.data = data;

				event("done");
			}.bind(this));
		}.bind(this));
	}
}

module.exports = file_async;