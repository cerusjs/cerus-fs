module.exports = function(cerus, path) {
	var self = {};
	var fs = require("fs");

	self.create = function() {
		//TODO: Add this function, that creates a folder.
	}

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

	self.remove = function() {
		//TODO: Add this function, that removes a folder.
	}

	self.copy = function() {
		//TODO: Add this function, that copies a folder from one folder to another folder.
	}

	self.empty = function() {
		//TODO: Add this function, that checks if the folder is empty.
	}

	self.realpath = function() {
		//TODO: Add this function, that gets the real path of this folder.
	}

	self.rename = function() {
		//TODO: Add this function, that renames this folder.
	}

	self.watch = function() {
		//TODO: Add this function, that watches this folder.
	}

	return self;
}