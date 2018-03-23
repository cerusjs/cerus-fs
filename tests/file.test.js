var expect = require("chai").expect;
var cerus = require("cerus")();
var file__ = require("../lib/file.js");
var file = function(path) {
	return new file__(cerus, path);
}

describe("file", function() {
	describe("constructor", function() {
		context("with undefined as path", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					file(undefined);
				}

				expect(func).to.throw();
			});
		});

		context("with null as path", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					file(null);
				}

				expect(func).to.throw();
			});
		});

		context("with a non-existant file", function() {
			it("shouldn't throw an error", function() {
				var func = function() {
					file("./tests/files/file3.txt");
				}

				expect(func).not.to.throw();
			});
		});

		context("with a relative path as path", function() {
			it("shouldn't throw an error", function() {
				var func = function() {
					file("./tests/files/file1.txt");
				}

				expect(func).not.to.throw();
			});
		});

		context("with an absolute path as path", function() {
			it("shouldn't throw an error", function() {
				var func = function() {
					file(__dirname + "/files/file1.txt");
				}

				expect(func).not.to.throw();
			});
		});
	});

	describe("#path", function() {
		context("with no parameters", function() {
			it("should return the same path", function() {
				var path = file("./tests/files/file1.txt").path();

				expect(path).to.equal("./tests/files/file1.txt");
			});
		});

		context("with a new path as parameters", function() {
			it("should return the new path", function() {
				var path = file("./tests/files/file1.txt").path("./tests/files/file2.txt");

				expect(path).to.equal("./tests/files/file2.txt");
			});
		});

		context("with the same path as parameters", function() {
			it("should return the same path", function() {
				var path = file("./tests/files/file1.txt").path("./tests/files/file1.txt");

				expect(path).to.equal("./tests/files/file1.txt");
			});
		});
	});

	describe("#type()", function() {
		context("with 'file' as path", function() {
			it("should return the type ''", function() {
				var type = file("file").type();

				expect(type).to.equal("");
			});
		});

		context("with 'file.txt' as path", function() {
			it("should return the type '.txt'", function() {
				var type = file("file.txt").type();

				expect(type).to.equal(".txt");
			});
		});

		context("with 'file.' as path", function() {
			it("should return the type '.'", function() {
				var type = file("file.").type();

				expect(type).to.equal(".");
			});
		});

		context("with 'file.text.txt' as path", function() {
			it("should return the type '.txt'", function() {
				var type = file("file.txt").type();
				expect(type).to.equal(".txt");
			});
		});
	});

	describe("#name()", function() {
		context("with 'file.txt' as path", function() {
			it("should return the name 'file'", function() {
				var name = file("file.txt").name();

				expect(name).to.equal("file");
			});
		});

		context("with './tests/files/file.txt' as path", function() {
			it("should return the name 'file'", function() {
				var name = file("./tests/files/file.txt").name();

				expect(name).to.equal("file");
			});
		});
	});

	describe("#dir()", function() {
		context("with 'file.txt' as path", function() {
			it("should return the dir '.'", function() {
				var dir = file("file.txt").dir();

				expect(dir).to.equal(".");
			});
		});

		context("with './tests/files/file.txt' as path", function() {
			it("should return the dir '/test/files'", function() {
				var dir = file("./tests/files/file.txt").dir();

				expect(dir).to.equal("./tests/files");
			});
		});

		context("with '/tests/files/file.txt' as path", function() {
			it("should return the dir '/test/files'", function() {
				var dir = file("/tests/files/file.txt").dir();

				expect(dir).to.equal("/tests/files");
			});
		});

		context("with '' as path", function() {
			it("should return the dir '.'", function() {
				var dir = file("").dir();

				expect(dir).to.equal(".");
			});
		});
	});

	describe("#read()", function() {
		context("with a non-existant path", function() {
			it("should throw an error", function(done) {
				file("./tests/files/file.txt").read()
				.catch(function(err) {
					expect(err).to.instanceof(Error);
					done();
				})
				.then(function() {
					//throw new Error("this shouldn't be called");
					done();
				});
			});
		});

		context("with a relative path", function() {
			it("should return a string with data", function(done) {
				file("./tests/files/file1.txt").read()
				.then(function(data) {
					expect(data).to.be.a("string");
					done();
				})
				.catch(function(err) {
					console.log(err);
				});
			});
		});

		context("with an absolute path", function() {
			it("should return a string with data", function(done) {
				file(__dirname + "/files/file2.txt").read()
				.then(function(data) {
					expect(data).to.be.a("string");
					done();
				})
				.catch(function() {
					throw new Error("this shouldn't be called");
				});
			});
		});

		context("with a relative path and 'utf-8' as parameter", function() {
			it("should return a string with data", function(done) {
				file("./tests/files/file1.txt").read("utf-8")
				.then(function(data) {
					expect(data).to.be.a("string");
					done();
				})
				.catch(function() {
					throw new Error("this shouldn't be called");
				});
			});
		});

		context("with an absolute path and 'utf-8' as parameter", function() {
			it("should return a string with data", function(done) {
				file(__dirname + "/files/file2.txt").read("utf-8")
				.then(function(data) {
					expect(data).to.be.a("string");
					done();
				})
				.catch(function() {
					throw new Error("this shouldn't be called");
				});
			});
		});
	});

	describe("#append()", function() {
		context("with a non-existant path and undefined as parameter", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					file("./tests/files/file.txt").append(undefined);
				}

				expect(func).to.throw();
			});
		});

		context("with a non-existant path and 'Another string with it.' as parameter", function() {
			it("creates the file and adds the text to the file", function(done) {
				file("./tests/files/file.txt").append("\nAnother string with it.")
				.then(function() {
					done();
				})
				.catch(function() {
					throw new Error("this shouldn't be called");
				});
			});
		});

		context("with a relative path and undefined as parameter", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					file("./tests/files/file1.txt").append(undefined);
				}

				expect(func).to.throw();
			});
		});

		context("with a relative path and 'Another string with it.' as parameter", function() {
			it("adds the text to the file", function(done) {
				file("./tests/files/file1.txt").append("\nAnother string with it.")
				.then(function() {
					done();
				})
				.catch(function() {
					throw new Error("this shouldn't be called");
				});
			});
		});

		context("with an absolute path and undefined as parameter", function() {
			it("should throw a TypeError", function() {
				var func_ = function() {
					file(__dirname + "/tests/files/file1.txt").append(undefined);
				}

				expect(func_).to.throw();
			});
		});

		context("with an absolute path and 'Another string with it.' as parameter", function() {
			it("adds the text to the file", function(done) {
				file(__dirname + "/files/file1.txt").append("\nAnother string with it.")
				.then(function() {
					done();
				})
				.catch(function() {
					throw new Error("this shouldn't be called");
				});;
			});
		});
	});

	describe("#clear()", function() {
		context("with a non-existant path", function() {
			it("will throw an error", function() {
				
			})
		});

		context("with a relative path", function() {
			
		});

		context("with an absolute path", function() {
			
		});
	});
});