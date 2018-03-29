var sync = require("./folder/sync");
var async = require("./folder/async");

class folder {
	constructor(cerus, path) {
		if(typeof path !== "string") {
			throw new TypeError("the argument path must be a string");
		}

		this._obj = this;
		
		this._sync = new sync(cerus, path, this._obj);
		this._async = new async(cerus, path, this._obj);
	}

	sync() {
		return this._sync;
	}

	async() {
		return this._async;
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

	files(...args) {
		return this._async.files(...args);
	}

	create(...args) {
		return this._async.create(...args);
	}

	mkdir(...args) {
		return this._async.mkdir(...args);
	}

	clear(...args) {
		return this._async.clear(...args);
	}

	empty(...args) {
		return this._async.empty(...args);
	}
}

module.exports = folder;