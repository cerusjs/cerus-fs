const fsextra = require("fs-extra");
const fs = require("fs");

class abstract_async {
	constructor(cerus, parent) {
		this._cerus = cerus;
		this._parent = parent;
	}

	access() {
		return new access(this);
	}

	chmod(mode) {
		return this._cerus.promisify(fs.chmod)(this._parent._path, mode)
		.then(() => this._parent, {passthrough: true});
	}

	chown(uid, gid) {
		return this._cerus.promisify(fs.chown)(this._parent._path, uid, gid)
		.then(() => this._parent, {passthrough: true});
	}

	copy(dest, {overwrite, error_on_exist, dereference, preserve_timestamps, filter} = {}) {
		const options = {
			overwrite,
			errorOnExist: error_on_exist,
			dereference,
			preserveTimestamps: preserve_timestamps,
			filter
		};

		return this._cerus.promise(fsextra.copy(this._parent._path, dest, options))
		.then(() => this._parent, {passthrough: true});
	}

	clone(dest, options) {
		return this.copy(dest, options);
	}

	dates() {
		return new dates(this.stats());
	}

	realpath({encoding} = {}) {
		return this._cerus.promisify(fs.realpath)(this._parent._path, {encoding})
		.then(() => this._parent, {passthrough: true});
	}

	resolve(options) {
		return this.realpath(options);
	}

	remove() {
		return this._cerus.promise(fsextra.remove(this._parent._path))
		.then(() => this._parent, {passthrough: true});
	}

	delete() {
		return this.remove();
	}

	move(newpath, {overwrite} = {}) {
		return this._cerus.promise(fsextra.move(this._parent._path, newpath, {overwrite}))
		.then(() => this._parent, {passthrough: true});
	}

	rename(newpath, opts) {
		return this.move(newpath, opts);
	}

	cut(newpath, opts) {
		return this.rename(newpath, opts);
	}

	link(newpath) {
		return this._cerus.promisify(fs.link)(this._parent._path, newpath)
		.then(() => this._parent, {passthrough: true});
	}

	shortcut(newpath) {
		return this.link(newpath);
	}

	stats() {
		return new stats(this);
	}
}

module.exports = abstract_async;

class access {
	constructor(abstract_async) {
		this._cerus = abstract_async._cerus;
		this._parent = abstract_async._parent;
	}

	read() {
		return this._has_access(fs.constants.R_OK);
	}

	write() {
		return this._has_access(fs.constants.W_OK);
	}

	visible() {
		return this._has_access(fs.constants.F_OK);
	}

	executable() {
		return this._has_access(fs.constants.X_OK);
	}

	_has_access(type) {
		return this._cerus.promisify(fs.access)(this._parent._path, type)
		.then(() => [true, this._parent], {passthrough: true, multi: true})
		.catch(() => [false, this._parent], {passthrough: true, multi: true});
	}
}

class dates {
	constructor(stats) {
		this._stats = stats;
	}

	access() {
		return this._stats._get_stat("atime");
	}

	modification() {
		return this._stats._get_stat("atime");
	}

	change() {
		return this._stats._get_stat("atime");
	}

	birth() {
		return this._stats._get_stat("atime");
	}
}

class stats {
	constructor(abstract_async) {
		this._cerus = abstract_async._cerus;
		this._parent = abstract_async._parent;
	}

	uid() {
		return this._get_stat("uid");
	}

	gid() {
		return this._get_stat("gid");
	}

	mode() {
		return this._get_stat("mode");
	}

	dev() {
		return this._get_stat("dev");
	}

	ino() {
		return this._get_stat("ino");
	}

	nlink() {
		return this._get_stat("nlink");
	}

	blocks() {
		return this._get_stat("blocks");
	}

	rdev() {
		return this._get_stat("rdev");
	}

	blksize() {
		return this._get_stat("blksize");
	}

	size() {
		return this._get_stat("size");
	}

	is() {
		if(this._is !== undefined) return this._is;

		return this._is = new is(this);
	}

	_get_stat(key, {is_func = false, type = "stat"} = {}) {
		return this._cerus.promisify(fs[type])(this._parent._path)
		.then(stats => {
			if(is_func) return [stats[key](), this._parent];

			return [stats[key], this._parent];
		}, {passthrough: true, multi: true})
	}
}

class is {
	constructor(stats) {
		this._stats = stats;
	}

	blockdevice() {
		return this._stats._get_stat("isBlockDevice", {is_func: true});
	}

	characterdevice() {
		return this._stats._get_stat("isCharacterDevice", {is_func: true});
	}

	directory() {
		return this._stats._get_stat("isDirectory", {is_func: true});
	}

	fifo() {
		return this._stats._get_stat("isFIFO", {is_func: true});
	}

	file() {
		return this._stats._get_stat("isFile", {is_func: true});
	}

	socket() {
		return this._stats._get_stat("isSocket", {is_func: true});
	}

	link() {
		return this._stats._get_stat("isSymbolicLink", {is_func: true, type: "lstat"});
	}
}