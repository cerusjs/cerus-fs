var fsextra = require("fs-extra");
var fs = require("fs");

class abstract_async {
	constructor(cerus, path) {
		this._cerus = cerus;
		this._path = path;
	}

	access() {
		if(this._access === undefined) {
			this._access = new access(this._cerus, this._path);
		}

		return this._access;
	}

	chmod(mode) {
		if(typeof mode !== "number") {
			throw new TypeError("the argument mode must be a number");
		}

		return this._cerus.promise(function(event) {
			fs.chmod(this._path.path, mode, function(err) {
				if(err) {
					return event("error", err);
				}

				event("done");
			});
		}.bind(this));
	}

	chown(uid, gid) {
		if(typeof uid !== "number") {
			throw new TypeError("the argument uid must be a number");
		}

		if(typeof gid !== "number") {
			throw new TypeError("the argument gid must be a number");
		}

		return this._cerus.promise(function(event) {
			fs.chown(this._path.path, uid, gid, function(err) {
				if(err) {
					return event("error", err);
				}

				event("done");
			});
		}.bind(this));
	}

	copy(dest, opts = {}) {
		if(typeof dest !== "string") {
			throw new TypeError("the argument dest must be a string");
		}

		var opts_ = {
			overwrite: opts["overwrite"],
			errorOnExist: opts["error_on_exist"],
			dereference: opts["dereference"],
			preserveTimestamps: opts["preserve_timestamps"],
			filter: opts["filter"]
		};

		return this._cerus.promise(function(event) {
			fsextra.copy(this._path.path, dest, opts_, function(err) {
				if(err) {
					return event("error", err);
				}

				event("done");
			});
		}.bind(this));
	}

	dates() {
		if(this._dates === undefined) {
			this._dates = new dates(this._cerus, this._path);
		}

		return this._dates;
	}

	realpath() {
		return this._cerus.promise(function(event) {
			fs.realpath(this._path.path, function(err) {
				if(err) {
					return event("error", err);
				}

				event("done");
			});
		}.bind(this));
	}

	resolve() {
		return this.realpath();
	}

	remove() {
		return this._cerus.promise(function(event) {
			fsextra.remove(this._path.path, function(err) {
				if(err) {
					return event("error", err);
				}

				event("done");
			});
		}.bind(this));
	}

	delete() {
		return this.remove();
	}

	rename(newpath, opts = {}) {
		if(typeof newpath !== "string") {
			throw new TypeError("the argument newpath must be a string");
		}

		return this._cerus.promise(function(event) {
			fsextra.move(this._path.path, newpath, opts, function(err) {
				if(err) {
					return event("error", err);
				}

				event("done");
			});
		}.bind(this));
	}

	move(newpath, opts) {
		return this.rename(newpath, opts);
	}

	cut(newpath, opts) {
		return this.rename(newpath, opts);
	}

	shortcut(newpath) {
		if(typeof newpath !== "string") {
			throw new TypeError("the argument newpath must be a string");
		}

		return this._cerus.promise(function(event) {
			fs.link(this._path.path, newpath, function(err) {
				if(err) {
					return event("error", err);
				}

				event("done");
			});
		}.bind(this));
	}

	link(newpath) {
		return this.shortcut(newpath);
	}

	size() {
		return get_stat("size", this._path.path, this._cerus);
	}

	stats() {
		if(this._stats === undefined) {
			this._stats = new stats(this._cerus, this._path);
		}

		return this._stats;
	}
}

module.exports = abstract_async;

class access {
	constructor(cerus, path) {
		this._cerus = cerus;
		this._path = path;
	}

	read() {
		return this._cerus.promise(function(event) {
			fs.access(this._path.path, fs.constants.R_OK, function(err) {
				event("done", err ? false : true);
			});
		}.bind(this));
	}

	write() {
		return this._cerus.promise(function(event) {
			fs.access(this._path.path, fs.constants.W_OK, function(err) {
				event("done", err ? false : true);
			});
		}.bind(this));
	}

	visible() {
		return this._cerus.promise(function(event) {
			fs.access(this._path.path, fs.constants.F_OK, function(err) {
				event("done", err ? false : true);
			});
		}.bind(this));
	}

	executable() {
		return this._cerus.promise(function(event) {
			fs.access(this._path.path, fs.constants.X_OK, function(err) {
				event("done", err ? false : true);
			});
		}.bind(this));
	}
}

class dates {
	constructor(cerus, path) {
		this._cerus = cerus;
		this._path = path;
	}

	access() {
		return get_stat("atime", this._path.path, this._cerus);
	}

	modification() {
		return get_stat("mtime", this._path.path, this._cerus);
	}

	change() {
		return get_stat("ctime", this._path.path, this._cerus);
	}

	birth() {
		return get_stat("birthtime", this._path.path, this._cerus);
	}
}

class stats {
	constructor(path) {
		this._path = path;
	}

	uid() {
		return get_stat("uid", this._path.path, this._cerus);
	}

	gid() {
		return get_stat("gid", this._path.path, this._cerus);
	}

	mode() {
		return get_stat("mode", this._path.path, this._cerus);
	}

	dev() {
		return get_stat("dev", this._path.path, this._cerus);
	}

	ino() {
		return get_stat("ino", this._path.path, this._cerus);
	}

	nlink() {
		return get_stat("nlink", this._path.path, this._cerus);
	}

	blocks() {
		return get_stat("blocks", this._path.path, this._cerus);
	}

	rdev() {
		return get_stat("rdev", this._path.path, this._cerus);
	}

	blksize() {
		return get_stat("blksize", this._path.path, this._cerus);
	}
}

var get_stat = function(key, path, cerus) {
	return cerus.promise(function(event) {
		fs.stat(path, function(err, stats) {
			if(err) {
				return event("error");
			}

			event("done", stats[key]);
		});
	});
};