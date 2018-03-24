var fs = require("fs");
var fsextra = require("fs-extra");
var path = require("path");

class abstract_sync {
	constructor(path, obj) {
		this._path = path;
		this._obj = obj;
	}

	access() {
		if(this._access === undefined) {
			this._access = new access(this._path);
		}

		return this._access;
	}

	base() {
		return path.basename(this._path.path);
	}

	chmod(mode) {
		if(typeof mode !== "number") {
			throw new TypeError("the argument mode must be a number");
		}

		fs.chmodSync(this._path.path, mode);

		return this._obj;
	}

	chown(uid, gid) {
		if(typeof uid !== "number") {
			throw new TypeError("the argument uid must be a number");
		}

		if(typeof gid !== "number") {
			throw new TypeError("the argument gid must be a number");
		}

		fs.chmodSync(this._path.path, uid, gid);

		return this._obj;
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

		fsextra.copySync(this._path.path, dest, opts_);

		return this._obj;
	}

	dates() {
		if(this._dates === undefined) {
			this._dates = new dates(this._path.path);
		}

		return this._dates;
	}

	modes() {
		if(this._modes === undefined) {
			this._modes = new modes();
		}

		return this._modes;
	}

	path(path) {
		if(typeof path === "string") {
			this._path.path = path;
		}

		return this._path.path;
	}

	realpath() {
		return fs.realpathSync(this._path.path);
	}

	resolve() {
		return this.realpath();
	}

	rename(newpath, opts = {}) {
		if(typeof newpath !== "string") {
			throw new TypeError("the argument newpath must be a string");
		}

		fsextra.moveSync(this._path.path, newpath, opts);

		return this._obj;
	}

	move(newpath, opts) {
		return this.rename(newpath, opts);
	}

	cut(newpath, opts) {
		return this.rename(newpath, opts);
	}

	remove() {
		fsextra.removeSync(this._path.path);

		return this._obj;
	}

	delete() {
		return this.remove();
	}

	relative(to) {
		return path.relative(this._path.path, to);
	}

	separate() {
		return this._path.split(path.sep);
	}

	shortcut(newpath) {
		if(typeof newpath !== "string") {
			throw new TypeError("the argument newpath must be a string");
		}

		fs.linkSync(this._path.path, newpath);

		return this._obj;
	}

	link(newpath) {
		return this.shortcut(newpath);
	}

	size() {
		return fs.statSync(this._path.path).size;
	}

	stats() {
		if(this._stats === undefined) {
			this._stats = new stats(this._path.path);
		}

		return this._stats;
	}
}

module.exports = abstract_sync;

class access {
	constructor(path) {
		this._path = path;
	}

	read() {
		try {
			fs.accessSync(this._path.path, fs.constants.R_OK);
			
			return true;
		} 
		catch(e) {
			return false;
		}
		
	}

	write() {
		try {
			fs.accessSync(this._path.path, fs.constants.W_OK);
			
			return true;
		} 
		catch(e) {
			return false;
		}
	}

	visible() {
		try {
			fs.accessSync(this._path.path, fs.constants.F_OK);
			
			return true;
		} 
		catch(e) {
			return false;
		}
	}

	executable() {
		try {
			fs.accessSync(this._path.path, fs.constants.X_OK);
			
			return true;
		} 
		catch(e) {
			return false;
		}
	}
}

class dates {
	constructor(path) {
		this._path = path;
	}

	access() {
		return fs.statSync(this._path.path).atime;
	}

	modification() {
		return fs.statSync(this._path.path).mtime;
	}

	change() {
		return fs.statSync(this._path.path).ctime;
	}

	birth() {
		return fs.statSync(this._path.path).birthtime;
	}
}

class modes {
	constructor() {
		this._group = new group();
		this._owner = new owner();
		this._others = new others();
	}

	group() {
		return this.group;
	}

	owner() {
		return this.owner;
	}

	others() {
		return this.others;
	}
}

class group {
	readable() {
		return fs.S_IRGRP;
	}

	writable() {
		return fs.S_IWGRP;
	}

	executable() {
		return fs.S_IXGRP;
	}

	all() {
		return fs.S_IRWXG;
	}
}

class owner {
	readable() {
		return fs.S_IRUSR;
	}

	writable() {
		return fs.S_IWUSR;
	}

	executable() {
		return fs.S_IXUSR;
	}

	all() {
		return fs.S_IRWXU;
	}
}

class others {
	readable() {
		return fs.S_IROTH;
	}

	writable() {
		return fs.S_IWOTH;
	}

	executable() {
		return fs.S_IXOTH;
	}

	all() {
		return fs.S_IRWXO;
	}
}

class stats {
	constructor(path) {
		this._path = path;
	}

	uid() {
		return fs.statSync(this._path.path).uid;
	}

	gid() {
		return fs.statSync(this._path.path).gid;
	}

	mode() {
		return fs.statSync(this._path.path).mode;
	}

	dev() {
		return fs.statSync(this._path.path).dev;
	}

	ino() {
		return fs.statSync(this._path.path).ino;
	}

	nlink() {
		return fs.statSync(this._path.path).nlink;
	}

	blocks() {
		return fs.statSync(this._path.path).blocks;
	}

	rdev() {
		return fs.statSync(this._path.path).rdev;
	}

	blksize() {
		return fs.statSync(this._path.path).blksize;
	}
}