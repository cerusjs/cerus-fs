var expect = require("chai").expect;
var cerus = require("cerus")();
var fs = require("fs");
var fsextra = require("fs-extra");
var file_ = require("../lib/file.js");

var reset = function(path, opts = {}) {
	fsextra.emptyDirSync("./tests/files");
	fs.closeSync(fs.openSync("./tests/files/file.txt", "w", opts["file_mode"]));
	fs.mkdirSync("./tests/files/folder", opts["folder_mode"]);

	return new file_(cerus, opts["fullpath"] ? path : "./tests/files/" + path);
}

var read = function(path, opts = {}) {
	var data = fs.readFileSync("./tests/files/" + path, opts);

	if(Buffer.isBuffer(data)) {
		data = data.toString();
	}

	return data;
}

var write = function(path, data, opts) {
	fs.writeFileSync("./tests/files/" + path, data, opts)
}

var exists = function(path) {
	return fs.existsSync("./tests/files/" + path);
}

describe("file", function() {
	describe("constructor", function() {
		context("with non-string as path", function() {
			it("should throw a TypeError", function() {
				expect(function() {
					reset(1234, {fullpath: true});
				}).to.throw();
			});
		});

		context("with a non-existant file", function() {
			it("shouldn't throw an error", function() {
				expect(function() {
					reset("non-existant.txt");
				}).not.to.throw();
			});
		});

		context("with a relative path as path", function() {
			it("shouldn't throw an error", function() {
				expect(function() {
					reset("file.txt");
				}).not.to.throw();
			});
		});

		context("with an absolute path as path", function() {
			it("shouldn't throw an error", function() {
				expect(function() {
					reset(__dirname + "/files/file.txt", {fullpath: true});
				}).not.to.throw();
			});
		});
	});

	describe("#sync", function() {
		describe("#append", function() {
			context("with a non-string as parameter", function() {
				it("should throw an error", function() {
					expect(function() {
						reset("file.txt").sync().append(1234);
					}).to.throw();
				});
			});

			context("appending to a folder", function() {
				it("should throw an error", function() {
					expect(function() {
						reset("folder/").sync().append("Test line");
					}).to.throw();
				});
			});

			context("appending to a non-existant file", function() {
				it("should create that file", function() {
					reset("file.txt").sync().append("Test line");
					expect(exists("file.txt")).to.be.true;
				});
			});

			context("with a single line string as parameter", function() {
				it("should append the string to the file", function() {
					reset("file.txt").sync().append("Test line");
					expect(read("file.txt")).to.equal("Test line");
				});
			});

			context("with a dual line string as parameter", function() {
				it("should append the dual lines to the file", function() {
					reset("file.txt").sync().append("Test line 1\nTest line 2");
					expect(read("file.txt")).to.equal("Test line 1\nTest line 2");
				});
			});

			context("with two lines appended apart", function() {
				it("should append the dual lines to the file", function() {
					var file = reset("file.txt");
					file.sync().append("Test line 1\n");
					file.sync().append("Test line 2");
					expect(read("file.txt")).to.equal("Test line 1\nTest line 2");
				});
			});
		});

		describe("#clear", function() {
			context("trying to clear a folder", function() {
				it("should throw an error", function() {
					expect(function() {
						reset("folder/").sync().clear();
					}).to.throw();
				});
			});

			context("trying to clear a non-existant file", function() {
				it("should throw an error", function() {
					expect(function() {
						reset("non-existant.txt").sync().clear();
					}).to.throw();
				});
			});

			context("with the file already cleared", function() {
				it("should do nothing", function() {
					var file = reset("file.txt");
					file.sync().clear();
					expect(read("file.txt")).to.equal("");
				});
			});

			context("with a single line added to the file", function() {
				it("should clear the file", function() {
					var file = reset("file.txt");
					write("file.txt", "Test line");
					file.sync().clear();
					expect(read("file.txt")).to.equal("");
				});
			});

			context("with two lines added to the file", function() {
				it("should clear both lines", function() {
					var file = reset("file.txt");
					write("file.txt", "Test line 1");
					write("file.txt", "Test line 2");
					file.sync().clear();
					expect(read("file.txt")).to.equal("");
				});
			});
		});

		describe("#create", function() {
			context("with a folder as path", function() {
				it("should throw an error", function() {
					expect(function() {
						reset("folder/").sync().create();
					}).to.throw();
				});
			});

			context("with a non-existant file as path", function() {
				it("should create the file", function() {
					reset("new.txt").sync().create();
					expect(exists("new.txt")).to.be.true;
				});
			});

			context("with an file as path", function() {
				it("should create the file", function() {
					reset("file.txt").sync().create();
					expect(exists("file.txt")).to.be.true;
				});
			});
		});

		describe("#ext", function() {
			context("with the file 'file'", function() {
				it("should return ''", function() {
					expect(reset("file").sync().ext()).to.equal("");
				});
			});

			context("with the file 'file.txt'", function() {
				it("should return '.txt'", function() {
					expect(reset("file.txt").sync().ext()).to.equal(".txt");
				});
			});
			
			context("with the file 'file.test.txt'", function() {
				it("should return '.txt'", function() {
					expect(reset("file.test.txt").sync().ext()).to.equal(".txt");
				});
			});

			context("with the file '.gitignore'", function() {
				it("should return ''", function() {
					expect(reset(".gitignore").sync().ext()).to.equal("");
				});
			});
		});
	});
});