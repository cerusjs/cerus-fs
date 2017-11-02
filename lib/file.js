module.exports = function(cerus, path) {
	var self = {};
	var data = null;
	var path_ = require('path');
	var fs = require('fs');
	var type = path_.extname(path);

	self.data = function(data_) {
		if(data_ != null) {
			data = data_;
		}

		return data;
	}

	self.path = function(path_) {
		if(path_ != null) {
			path = path_;
		}

		return path;
	}

	self.type = function() {
		return type;
	}

	self.name = function() {
		return path_.basename(path);
	}

	self.pipe = function(response) {
		var stream = fs.createReadStream(path);
		stream.pipe(response);
	}

	self.append = function(data_) {
		if(typeof data_ !== "string") {
			throw new TypeError("argument data_ must be a string");
		}

		return cerus.promise(function(event) {
			fs.appendFile(path, data_, function(err) {
				if(err) {
					event("error", err);
				}

				data += data_;

				event("appended", self);
			});
		});
	}

	self.read = function() {
		return cerus.promise(function(event) {
			fs.readFile(path, 'binary', function(err, data_) {
				if(err) {
					event("error", err);
				}

				data = data_;
				type = path_.extname(path);

				event("loaded", self);
			});
		});
	}

	self.mkdir = function() {
		return cerus.promise(function(event) {
			fs.mkdir(path, function(err) {
				if(err) {
					event("error", err);
				}

				event("created", self);
			});
		});
	}

	self.clear = function() {
		return cerus.promise(function(event) {
			fs.writeFile(path, "", function(err) {
				if(err) {
					event("error", err);
				}

				event("cleared", self);
			});
		});
	}

	self.copy = function() {
		//TODO: Add this function, that copies a file from one file to another file.
	}

	self.empty = function() {
		//TODO: Add this function, that checks if the file is empty.
	}

	self.realpath = function() {
		//TODO: Add this function, that gets the real path of this file.
	}

	self.rename = function() {
		//TODO: Add this function, that renames this file.
	}

	self.watch = function() {
		//TODO: Add this function, that watches this file.
	}

	self.stats = function() {
		var self_ = {};

		self_.size = function() {
			return cerus.promise(function(event) {
				fs.stat(path, function(err, stats) {
					if(err) {
						event("error", err);
					}

					event("stats", stats.size);
				});
			});
		}

		self_.uid = function() {
			return cerus.promise(function(event) {
				fs.stat(path, function(err, stats) {
					if(err) {
						event("error", err);
					}

					event("stats", stats.uid);
				});
			});
		}

		self_.gid = function() {
			return cerus.promise(function(event) {
				fs.stat(path, function(err, stats) {
					if(err) {
						event("error", err);
					}

					event("stats", stats.gid);
				});
			});
		}

		self_.mode = function() {
			return cerus.promise(function(event) {
				fs.stat(path, function(err, stats) {
					if(err) {
						event("error", err);
					}

					event("stats", stats.mode);
				});
			});
		}

		self_.creation = function() {
			return cerus.promise(function(event) {
				fs.stat(path, function(err, stats) {
					if(err) {
						event("error", err);
					}

					event("stats", stats.birthtime);
				});
			});
		}

		self_.accessed = function() {
			return cerus.promise(function(event) {
				fs.stat(path, function(err, stats) {
					if(err) {
						event("error", err);
					}

					event("stats", stats.atime);
				});
			});
		}

		self_.modified = function() {
			return cerus.promise(function(event) {
				fs.stat(path, function(err, stats) {
					if(err) {
						event("error", err);
					}

					event("stats", stats.mtime);
				});
			});
		}

		self_.changed = function() {
			return cerus.promise(function(event) {
				fs.stat(path, function(err, stats) {
					if(err) {
						event("error", err);
					}

					event("stats", stats.changed);
				});
			});
		}

		self_.dev = function() {
			return cerus.promise(function(event) {
				fs.stat(path, function(err, stats) {
					if(err) {
						event("error", err);
					}

					event("stats", stats.dev);
				});
			});
		}

		return self_;
	}

	return self;
}