var fs = require("fs");
var path = require("path");
var abstract_sync = require("./../abstract/sync");

class file_sync extends abstract_sync {
	constructor(cerus, parent) {
		super(cerus, parent);
	}

	append(data, {encoding, mode, flag} = {}) {
		fs.appendFileSync(this._parent._path, data, {encoding, mode, flag});

		return this._parent;
	}

	clear() {
		return this.truncate(0);
	}

	create({exclusive, mode} = {}) {
		if(this.exists() && this.stats().is().directory()) {
			throw new Error("Error: EISDIR, file cannot be a folder");
		}

		fs.closeSync(fs.openSync(this._parent._path, exclusive ? "x" : "a", mode));

		return this._parent;
	}

	dir() {
		return path.dirname(this._parent._path);
	}

	directory() {
		return this.dir();
	}

	empty() {
		return this.clear();
	}

	ext() {
		return path.extname(this._parent._path);
	}

	name() {
		return path.basename(this._parent._path, this.ext());
	}

	pipe(stream) {
		fs.createReadStream(this._parent._path).pipe(stream);

		return this._parent;
	}

	read({encoding, flag} = {}) {
		let data = fs.readFileSync(this._parent._path, {encoding, flag});

		if(!Buffer.isBuffer(data)) data = Buffer.from(data);

		return data;
	}

	load(opts) {
		return this.read(opts);
	}

	remove() {
		this._data.data = undefined;
		
		return super.remove();
	}

	truncate(length) {
		fs.truncateSync(this._parent._path, length);

		return this._parent;
	}

	type() {
		return this.ext();
	}

	write(data, {encoding, mode, flag} = {}) {
		fs.writeFileSync(this._parent._path, data, {encoding, mode, flag});

		return this._parent;
	}
}

module.exports = file_sync;