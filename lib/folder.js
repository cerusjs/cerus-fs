var folder = function(cerus, path) {
	if(typeof path !== "string") {
		throw new TypeError("argument path must be a string");
	}
	
	var self = {};
	var path_ = require('path');
	var fs = require("fs");

	self.files = function() {
		return cerus.promise(function(event) {
			fs.readdir(path, function(err, files) {
				if(err) {
					event("error");
					return;
				}

				files.forEach(function(filename, index) {
					event("file", cerus.file(path + filename), (index === (files.length - 1)));

					if(index == (files.length - 1)) {
						event("finish");
					}
				});
			});
		});
	}

	self.clone = function() {
		var folder_ = new folder(cerus, path);
		folder_.data(self.data());
		return folder_;
	}

	self.file = function(filename) {
		var path__ = path;

		if(!path.endsWith("/")) {
			path__ += "/";
		}

		return cerus.file(path__ + filename);
	}

	self.move = self.rename = function(new_) {
		if(typeof new_ !== "string") {
			throw new TypeError("argument new_ must be a string");
		}

		return cerus.promise(function(event) {
			fs.rename(path, new_, function(err) {
				if(err) {
					event("error", err);
					return;
				}

				event("renamed", self);
			});
		});
	}

	self.relative = function(second) {
		if(typeof second !== "string") {
			throw new TypeError("argument second must be a string");
		}

		return path_.relative(path, second);
	}

	self.separate = function() {
		return path.split(path_.sep);
	}

	self.realpath = function(second) {
		if(typeof second !== "string") {
			throw new TypeError("argument second must be a string");
		}

		return cerus.promise(function(event) {
			fs.realpath(path, second, function(err) {
				if(err) {
					event("error", err);
					return;
				}

				event("path", self);
			});
		});
	}

	self.chmod = function(mode, follow) {
		if(typeof mode !== "number") {
			throw new TypeError("argument mode must be a number");
		}

		return cerus.promise(function(event) {
			follow = (follow === undefined) ? true : follow;

			if(follow) {
				fs.chmod(path, mode, function(err) {
					if(err) {
						event("error", err);
						return;
					}

					event("success");
				});
			}
			else {
				fs.lchmod(path, mode, function(err) {
					if(err) {
						event("error", err);
						return;
					}

					event("success");
				});
			}
		});
	}

	self.chown = function(uid, gid, follow) {
		return cerus.promise(function(event) {
			follow = (follow === undefined) ? true : follow;

			if(follow) {
				fs.chown(path, uid, gid, function(err) {
					if(err) {
						event("error", err);
						return;
					}

					event("success");
				});
			}
			else {
				fs.lchown(path, uid, gid, function(err) {
					if(err) {
						event("error", err);
						return;
					}

					event("success");
				});
			}
		});
	}

	self.clear = function() {
		self.files()
		.on("file", function(file) {
			file.remove();
		});
	}

	self.create = function(mode) {
		return cerus.promise(function(event) {
			fs.mkdir(path, mode, function(err) {
				if(err) {
					event("error", err);
					return;
				}

				event("created");
			});
		});
	}

	self.remove = function() {
		return cerus.promise(function(event) {
			fs.rmdir(path, function(err) {
				if(err) {
					event("error", err);
					return;
				}

				event("removed");
			});
		});
	}

	self.size = function() {
		return cerus.promise(function(event) {
			fs.stat(path, function(err, stats) {
				if(err) {
					event("error", err);
					return;
				}

				event("stats", stats.size);
			});
		});
	}

	self.truncate = function(lenght) {
		return cerus.promise(function(event) {
			length = length || 0;

			fs.truncate(path, length, function(err) {
				if(err) {
					event("error", err);
					return;
				}

				event("truncated");
			});
		});
	}

	self.modes = function() {
		var self_ = {};

		self_.owner = function() {
			var self__ = {};

			self__.readable = function() {
				return fs.constants.S_IRUSR;
			}

			self__.writable = function() {
				return fs.constants.S_IWUSR;
			}

			self__.executable = function() {
				return fs.constants.S_IXUSR;
			}

			self__.all = function() {
				return fs.constants.S_IRWXU;
			}

			return self__;
		}

		self_.group = function() {
			var self__ = {};

			self__.readable = function() {
				return fs.constants.S_IRGRP;
			}

			self__.writable = function() {
				return fs.constants.S_IWGRP;
			}

			self__.executable = function() {
				return fs.constants.S_IXGRP;
			}

			self__.all = function() {
				return fs.constants.S_IRWXG;
			}

			return self__;
		}

		self_.others = function() {
			var self__ = {};

			self__.readable = function() {
				return fs.constants.S_IROTH;
			}

			self__.writable = function() {
				return fs.constants.S_IWOTH;
			}

			self__.executable = function() {
				return fs.constants.S_IXOTH;
			}

			self__.all = function() {
				return fs.constants.S_IRWXO;
			}

			return self__;
		}

		return self_;
	}

	self.dates = function() {
		var self_ = {};

		self_.birth = function() {
			return cerus.promise(function(event) {
				fs.stat(path, function(err, stats) {
					if(err) {
						event("error", err);
						return;
					}

					event("stats", stats.birthtime);
				});
			});
		}

		self_.access = function() {
			return cerus.promise(function(event) {
				fs.stat(path, function(err, stats) {
					if(err) {
						event("error", err);
						return;
					}

					event("stats", stats.atime);
				});
			});
		}

		self_.modifcation = function() {
			return cerus.promise(function(event) {
				fs.stat(path, function(err, stats) {
					if(err) {
						event("error", err);
						return;
					}

					event("stats", stats.mtime);
				});
			});
		}

		self_.change = function() {
			return cerus.promise(function(event) {
				fs.stat(path, function(err, stats) {
					if(err) {
						event("error", err);
						return;
					}

					event("stats", stats.changed);
				});
			});
		}

		return self_;
	}

	self.access = function() {
		var self_ = {};

		self_.read = function() {
			return cerus.promise(function(event) {
				fs.access(path, fs.constants.R_OK, function(err) {
					event("done", err ? false : true);
				});
			});
		}

		self_.write = function() {
			return cerus.promise(function(event) {
				fs.access(path, fs.constants.W_OK, function(err) {
					event("done", err ? false : true);
				});
			});
		}

		self_.visible = function() {
			return cerus.promise(function(event) {
				fs.access(path, fs.constants.F_OK, function(err) {
					event("done", err ? false : true);
				});
			});
		}

		self_.executable = function() {
			return cerus.promise(function(event) {
				fs.access(path, fs.constants.X_OK, function(err) {
					event("done", err ? false : true);
				});
			});
		}

		return self_;
	}

	self.stats = function() {
		var self_ = {};

		self_.uid = function() {
			return cerus.promise(function(event) {
				fs.stat(path, function(err, stats) {
					if(err) {
						event("error", err);
						return;
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
						return;
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
						return;
					}

					event("stats", stats.mode);
				});
			});
		}

		self_.dev = function() {
			return cerus.promise(function(event) {
				fs.stat(path, function(err, stats) {
					if(err) {
						event("error", err);
						return;
					}

					event("stats", stats.dev);
				});
			});
		}

		self_.ino = function() {
			return cerus.promise(function(event) {
				fs.stat(path, function(err, stats) {
					if(err) {
						event("error", err);
						return;
					}

					event("stats", stats.ino);
				});
			});
		}

		self_.nlink = function() {
			return cerus.promise(function(event) {
				fs.stat(path, function(err, stats) {
					if(err) {
						event("error", err);
						return;
					}

					event("stats", stats.nlink);
				});
			});
		}

		self_.blksize = function() {
			return cerus.promise(function(event) {
				fs.stat(path, function(err, stats) {
					if(err) {
						event("error", err);
						return;
					}

					event("stats", stats.blksize);
				});
			});
		}

		self_.blocks = function() {
			return cerus.promise(function(event) {
				fs.stat(path, function(err, stats) {
					if(err) {
						event("error", err);
						return;
					}

					event("stats", stats.blocks);
				});
			});
		}

		self_.rdev = function() {
			return cerus.promise(function(event) {
				fs.stat(path, function(err, stats) {
					if(err) {
						event("error", err);
						return;
					}

					event("stats", stats.rdev);
				});
			});
		}

		return self_;
	}

	return self;
}

module.exports = folder;