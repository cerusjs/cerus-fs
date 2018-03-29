var sync = require("./file/sync");
var async = require("./file/async");

class file {
	constructor(cerus, path) {
		if(typeof path !== "string") {
			throw new TypeError("the argument path must be a string");
		}

		this._data = {data: ""};
		this._path = {path};
		this._obj = this;

		this._sync = new sync(cerus, this._path, this._data, this._obj);
		this._async = new async(cerus, this._path, this._data, this._obj);
	}

	sync() {
		return this._sync;
	}

	async() {
		return this._async;
	}

	append(...args) {
		return this._async.append(...args);
	}

	clone(...args) {
		return this._async.clone(...args);
	}

	clear(...args) {
		return this._async.clear(...args);
	}

	empty(...args) {
		return this._async.empty(...args);
	}

	exists(...args) {
		return this._async.exists(...args);
	}

	create(...args) {
		return this._async.create(...args);
	}

	read(...args) {
		return this._async.read(...args);
	}

	truncate(...args) {
		return this._async.truncate(...args);
	}

	write(...args) {
		return this._async.write(...args);
	}

	access(...args) {
		return this._async.access(...args);
	}

	chmod(...args) {
		return this._async.chmod(...args);
	}

	chown(...args) {
		return this._async.chown(...args);
	}

	copy(...args) {
		return this._async.copy(...args);
	}

	dates(...args) {
		return this._async.dates(...args);
	}

	realpath(...args) {
		return this._async.realpath(...args);
	}

	resolve(...args) {
		return this._async.resolve(...args);
	}

	remove(...args) {
		return this._async.remove(...args);
	}

	delete(...args) {
		return this._async.delete(...args);
	}

	rename(...args) {
		return this._async.rename(...args);
	}

	move(...args) {
		return this._async.move(...args);
	}

	cut(...args) {
		return this._async.cut(...args);
	}

	shortcut(...args) {
		return this._async.shortcut(...args);
	}

	link(...args) {
		return this._async.link(...args);
	}

	size(...args) {
		return this._async.size(...args);
	}

	stats(...args) {
		return this._async.stats(...args);
	}

	base(...args) {
		return this._sync.base(...args);
	}

	modes(...args) {
		return this._sync.modes(...args);
	}

	path(...args) {
		return this._sync.path(...args);
	}

	relative(...args) {
		return this._sync.relative(...args);
	}

	separate(...args) {
		return this._sync.separate(...args);
	}

	ext(...args) {
		return this._sync.ext(...args);
	}

	type(...args) {
		return this._sync.type(...args);
	}

	data(...args) {
		return this._sync.data(...args);
	}

	dir(...args) {
		return this._sync.dir(...args);
	}

	directory(...args) {
		return this._sync.directory(...args);
	}

	name(...args) {
		return this._sync.name(...args);
	}

	pipe(...args) {
		return this._sync.pipe(...args);
	}

	unwatch(...args) {
		return this._sync.unwatch(...args);
	}

	watch(...args) {
		return this._sync.watch(...args);
	}
}

module.exports = file;
