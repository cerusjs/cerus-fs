var sync = require("./folder/sync");
var async = require("./folder/async");

class folder {
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

add_properties(require("./abstract/sync").prototype, folder.prototype, "_sync");
add_properties(sync.prototype, folder.prototype, "_sync");
add_properties(require("./abstract/async").prototype, folder.prototype, "_async");
add_properties(async.prototype, folder.prototype, "_async");

module.exports = folder;