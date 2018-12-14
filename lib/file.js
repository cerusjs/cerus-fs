var sync = require("./file/sync");
var async = require("./file/async");

class file {
	constructor(cerus, path) {
		this._path = path;
		this._sync = new sync(cerus, this);
		this._async = new async(cerus, this);
	}

	sync() {
		return this._sync;
	}

	async() {
		return this._async;
	}
}

let add_properties = function(from, to, name) {
	Object.getOwnPropertyNames(from).forEach(property => {
		if(property === "constructor") return;

		to[property] = function(...args) {
			return this[name][property](...args);
		};
	});
};

add_properties(require("./abstract/sync").prototype, file.prototype, "_sync");
add_properties(sync.prototype, file.prototype, "_sync");
add_properties(require("./abstract/async").prototype, file.prototype, "_async");
add_properties(async.prototype, file.prototype, "_async");

module.exports = file;
