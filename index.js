module.exports = function() {
	var plugin = {};
	var cerus;
	var file = require("./lib/file");
	var folder = require("./lib/folder");
	var package = require("./package.json");
	
	plugin.name = package["name"];
	plugin.version = package["version"];
	plugin.dependencies = [
		"cerus-promise"
	];

	plugin._init = function(cerus_) {
		cerus = cerus_;
	}

	plugin.file = function(path) {
		return new file(cerus, path);
	}

	plugin.folder = function(path) {
		return new folder(cerus, path);
	}

	return plugin;
}