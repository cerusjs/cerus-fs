module.exports = function() {
	var self = {};

	var package = require("./package.json");
	
	self.name = package["name"];
	self.version = package["version"];
	self.dependencies = [
		"cerus-promise"
	];

	var cerus;
	var file = require("./lib/file");
	var folder = require("./lib/folder");

	self._init = function(cerus_) {
		cerus = cerus_;
	}

	self.file = function(path) {
		return file(cerus, path);
	}

	self.folder = function(path) {
		return folder(cerus, path);
	}

	return self;
}