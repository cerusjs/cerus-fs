var fs = require("fs");
var fsextra = require("fs-extra");
var path = require("path");

class abstract_sync {
	constructor(cerus, parent) {
		this._cerus = cerus;
		this._parent = parent;
	}

	access() {
		return new access(this._parent);
	}

	base() {
		return path.basename(this._parent._path);
	}

	chmod(mode) {
		fs.chmodSync(this._parent._path, mode);

		return this._parent;
	}

	chown(uid, gid) {
		fs.chmodSync(this._parent._path, uid, gid);

		return this._parent;
	}

	copy(dest, {overwrite, error_on_exist, dereference, preserve_timestamps, filter} = {}) {
		const options = {
			overwrite,
			errorOnExist: error_on_exist,
			dereference,
			preserveTimestamps: preserve_timestamps,
			filter
		};

		fsextra.copySync(this._parent._path, dest, options);

		return this._parent;
	}

	clone(dest, options) {
		return this.copy(dest, options);
	}

	dates() {
		return new dates(this._parent);
	}

	exists() {
		return fs.existsSync(this._parent._path);
	}

	modes() {
		return new modes();
	}

	path(path) {
		if(path === undefined) return this._parent._path;
		
		return this._parent._path = path;
	}

	realpath() {
		return fs.realpathSync(this._parent._path);
	}

	resolve() {
		return this.realpath();
	}

	rename(newpath, {overwrite} = {}) {
		fsextra.moveSync(this._parent._path, newpath, {overwrite});

		return this._parent;
	}

	move(newpath, options) {
		return this.rename(newpath, options);
	}

	cut(newpath, options) {
		return this.rename(newpath, options);
	}

	remove() {
		fsextra.removeSync(this._parent._path);

		return this._parent;
	}

	delete() {
		return this.remove();
	}

	relative(to) {
		return path.relative(this._parent._path, to);
	}

	separate() {
		return this._parent._path.split(path.sep);
	}

	link(newpath) {
		fs.linkSync(this._parent._path, newpath);

		return this._parent;
	}

	shortcut(newpath) {
		return this.link(newpath);
	}

	size() {
		return fs.statSync(this._parent._path).size;
	}

	stats() {
		return new stats(this._parent);
	}
}

module.exports = abstract_sync;

class access {
	constructor(parent) {
		this._parent = parent;
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
		try {
			fs.accessSync(this._parent._path, type);
		} 
		catch(e) {
			return false;
		}
			
		return true;
	}
}

class dates {
	constructor(parent) {
		this._parent = parent;
	}

	access() {
		return fs.statSync(this._parent._path).atime;
	}

	modification() {
		return fs.statSync(this._parent._path).mtime;
	}

	change() {
		return fs.statSync(this._parent._path).ctime;
	}

	birth() {
		return fs.statSync(this._parent._path).birthtime;
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
	constructor(parent) {
		this._parent = parent;
	}

	uid() {
		return fs.statSync(this._parent._path).uid;
	}

	gid() {
		return fs.statSync(this._parent._path).gid;
	}

	mode() {
		return fs.statSync(this._parent._path).mode;
	}

	dev() {
		return fs.statSync(this._parent._path).dev;
	}

	ino() {
		return fs.statSync(this._parent._path).ino;
	}

	nlink() {
		return fs.statSync(this._parent._path).nlink;
	}

	blocks() {
		return fs.statSync(this._parent._path).blocks;
	}

	rdev() {
		return fs.statSync(this._parent._path).rdev;
	}

	blksize() {
		return fs.statSync(this._parent._path).blksize;
	}

	is() {
		if(this._is === undefined) {
			this._is = new is(this._parent);
		}

		return this._is;
	}
}

class is {
	constructor(parent) {
		this._parent = parent;
	}

	blockdevice() {
		return fs.statSync(this._parent._path).isBlockDevice();
	}

	characterdevice() {
		return fs.statSync(this._parent._paths).isCharacterDevice();
	}

	directory() {
		return fs.statSync(this._parent._path).isDirectory();	
	}

	fifo() {
		return fs.statSync(this._parent._path).isFIFO();
	}

	file() {
		return fs.statSync(this._parent._path).isFile();
	}

	socket() {
		return fs.statSync(this._parent._path).isSocket();
	}

	link() {
		return fs.lstatSync(this._parent._path).isSymbolicLink();
	}
}