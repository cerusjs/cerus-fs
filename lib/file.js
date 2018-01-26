var file = function(cerus, path) {
	if(typeof path !== "string") {
		throw new TypeError("argument path must be a string");
	}

	var self = {};
	var data = null;
	var path_ = require('path');
	var fs = require('fs');
	var listeners = [];

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
		return path_.extname(path);
	}

	self.folder = self.dir = function() {
		return path_.dirname(path);
	}

	self.name = function(ext) {
		return path_.basename(path, ext);
	}

	self.pipe = function(response) {
		if(response === undefined) {
			throw new TypeError("argument response must be a response");
		}

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
					return;
				}

				data += data_;

				event("appended", self);
			});
		});
	}

	self.read = function(type) {
		return cerus.promise(function(event) {
			type = type || "binary";

			fs.readFile(path, type, function(err, data_) {
				if(err) {
					event("error", err);
					return;
				}

				data = data_;

				event("loaded", self);
			});
		});
	}

	self.clear = function() {
		return cerus.promise(function(event) {
			fs.writeFile(path, "", function(err) {
				if(err) {
					event("error", err);
					return;
				}

				event("cleared", self);
			});
		});
	}

	self.write = function(data) {
		if(typeof data !== "string") {
			throw new TypeError("argument data must be a string");
		}

		return cerus.promise(function(event) {
			fs.writeFile(path, data, function(err) {
				if(err) {
					event("error", err);
					return;
				}

				event("cleared", self);
			});
		});
	}

	self.copy = function(dest, override) {
		if(typeof dest !== "string") {
			throw new TypeError("argument dest must be a string");
		}

		return cerus.promise(function(event) {
			override = override ? fs.constants.COPYFILE_EXCL : 0;

			fs.copyFile(path, dest, override, function(err) {
				if(err) {
					event("error", err);
					return;
				}

				event("copied", self);
			});
		});
	}

	self.create = function(override, mode) {
		return cerus.promise(function(event) {
			override = override ? "w" : "a";

			fs.open(path, override, mode, function(err) {
				if(err) {
					event("error", err);
					return;
				}

				event("created", self);
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

	self.remove = function() {
		return cerus.promise(function(event) {
			fs.unlink(path, function(err) {
				if(err) {
					event("error", err);
					return;
				}

				event("removed", self);
			});
		});
	}

	self.resolve = function() {
		return cerus.promise(function(event) {
			fs.readlink(path, function(err, link) {
				if(err) {
					event("error", err);
					return;
				}

				event("resolved", link);
			});
		});
	}

	self.watch = function(options) {
		return cerus.promise(function(event) {
			options = options || {};
			options["persistent"] = options["persistent"] || true;
			options["recursive"] = options["recursive"] || false;

			var i = listeners.length;
			
			fs.watch(path, options, listeners[i] = function(event_) {
				event(event_);
			});

			return i;
		});
	}

	self.unwatch = function(code) {
		fs.unwatchFile(path, listeners[code]);
	}

	self.sync = function() {
		return cerus.promise(function(event) {
			fs.open(path, "r", function(err, fd) {
				if(err) {
					event("error", err);
					return;
				}

				fs.fdatasync(fd, function(err) {
					if(err) {
						event("error", err);
						return;
					}

					event("synced", self);
				});
			});
		});
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

	self.shortcut = function(new_) {
		if(typeof new_ !== "string") {
			throw new TypeError("argument new_ must be a string");
		}

		return cerus.promise(function(event) {
			fs.link(path, new_, function(err) {
				if(err) {
					event("error", err);
					return;
				}

				event("created", self);
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
					event("success");
				});
			}
			else {
				fs.lchmod(path, mode, function(err) {
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
					event("success");
				});
			}
			else {
				fs.lchown(path, uid, gid, function(err) {
					event("success");
				});
			}
		});
	}

	self.clone = function() {
		var file_ = new file(cerus, path);
		file_.data(self.data());
		return file_;
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

module.exports = file;