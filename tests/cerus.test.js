var expect = require("chai").expect;
var cerus = require("../index")();
cerus.settings().root(cerus.settings().root() + "tests/");
cerus.use(require("cerus-request")());
var throw_ = function(err) {
	throw err;
}

describe("cerus", function() {
	describe("#model", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					cerus.model();
				}

				expect(func).to.throw();
			});
		});

		context("call it once", function() {
			context("with a relative path", function() {
				it("should load just fine", function() {
					expect(cerus.model("model")()).to.equal("model");
				});
			});

			context("with an absolute path", function() {
				it("should load just fine", function() {
					expect(cerus.model(__dirname + "/models/model")()).to.equal("model");
				});
			});
		});

		context("call it two times", function() {
			context("with a relative path", function() {
				it("should load just fine", function() {
					expect(cerus.model("model")()).to.equal("model");
					expect(cerus.model("model")()).to.equal("model");
				});
			});

			context("with an absolute path", function() {
				it("should load just fine", function() {
					expect(cerus.model(__dirname + "/models/model")()).to.equal("model");
					expect(cerus.model(__dirname + "/models/model")()).to.equal("model");
				});
			});
		});
	});

	describe("#library", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					cerus.library();
				}

				expect(func).to.throw();
			});
		});

		context("call it once", function() {
			context("with a relative path", function() {
				it("should load just fine", function() {
					expect(cerus.library("library")()).to.equal("library");
				});
			});

			context("with an absolute path", function() {
				it("should load just fine", function() {
					expect(cerus.library(__dirname + "/libraries/library")()).to.equal("library");
				});
			});
		});

		context("call it two times", function() {
			context("with a relative path", function() {
				it("should load just fine", function() {
					expect(cerus.library("library")()).to.equal("library");
					expect(cerus.library("library")()).to.equal("library");
				});
			});

			context("with an absolute path", function() {
				it("should load just fine", function() {
					expect(cerus.library(__dirname + "/libraries/library")()).to.equal("library");
					expect(cerus.library(__dirname + "/libraries/library")()).to.equal("library");
				});
			});
		});
	});

	describe("#helper", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					cerus.helper();
				}

				expect(func).to.throw();
			});
		});

		context("call it once", function() {
			context("with a relative path", function() {
				it("should load just fine", function() {
					expect(cerus.helper("helper")).to.equal("helper");
				});
			});

			context("with an absolute path", function() {
				it("should load just fine", function() {
					expect(cerus.helper(__dirname + "/helpers/helper")).to.equal("helper");
				});
			});
		});

		context("call it two times", function() {
			context("with a relative path", function() {
				it("should load just fine", function() {
					expect(cerus.helper("helper")).to.equal("helper");
					expect(cerus.helper("helper")).to.equal("helper");
				});
			});

			context("with an absolute path", function() {
				it("should load just fine", function() {
					expect(cerus.helper(__dirname + "/helpers/helper")).to.equal("helper");
					expect(cerus.helper(__dirname + "/helpers/helper")).to.equal("helper");
				});
			});
		});
	});

	describe("#favicon", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					cerus.favicon();
				}

				expect(func).to.throw();
			});
		});

		context("with a non-existant file", function() {
			it("should throw an error", function() {
				cerus.favicon("icon/notfavicon.png")
				.catch(function(err) {
					var func = function() {
						throw err;
					}

					expect(func).to.throw()
				});
			});
		});

		context("before starting the server", function() {
			context("with a relative path", function() {
				it("should route just fine", function(done) {
					cerus.favicon("icon/favicon.png").catch(throw_);
					cerus.server().start()
					.then(function() {
						cerus.request()
						.port(cerus.settings().port())
						.expect("body", "ICON")
						.send(function() {
							cerus.server().stop()
							.then(function() {
								done();
							});
						});
					});
				});
			});

			context("with an absolute path", function() {
				it("should route just fine", function(done) {
					cerus.favicon(__dirname + "/icon/favicon.png").catch(throw_);
					cerus.server().start()
					.then(function() {
						cerus.request()
						.port(cerus.settings().port())
						.expect("body", "ICON")
						.send(function() {
							cerus.server().stop()
							.then(function() {
								done();
							});
						});
					});
				});
			});
		});

		context("after starting the server", function() {
			context("with a relative path", function() {
				it("should route just fine", function(done) {
					cerus.server().start()
					.then(function() {
						cerus.favicon("icon/favicon.png").catch(throw_);
						cerus.request()
						.port(cerus.settings().port())
						.expect("body", "ICON")
						.send(function() {
							cerus.server().stop()
							.then(function() {
								done();
							});
						});
					});
				});
			});

			context("with an absolute path", function() {
				it("should route just fine", function(done) {
					cerus.server().start()
					.then(function() {
						cerus.favicon(__dirname + "/icon/favicon.png").catch(throw_);
						cerus.request()
						.port(cerus.settings().port())
						.expect("body", "ICON")
						.send(function() {
							cerus.server().stop()
							.then(function() {
								done();
							});
						});
					});
				});
			});
		});
	});

	describe("#view", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					cerus.view();
				}

				expect(func).to.throw();
			});
		});

		context("with a non-existant file", function() {
			it("should throw an error", function() {
				cerus.view("/", "notview")
				.catch(function(err) {
					var func = function() {
						throw err;
					}

					expect(func).to.throw()
				});
			});
		});

		context("before starting the server", function() {
			context("with a relative path", function() {
				it("should route just fine", function(done) {
					cerus.view("/", "view").catch(throw_);
					cerus.server().start()
					.then(function() {
						cerus.request()
						.port(cerus.settings().port())
						.expect("body", "<h1>Hello World!</h1>")
						.send(function() {
							cerus.server().stop()
							.then(function() {
								done();
							});
						});
					});
				});
			});

			context("with an absolute path", function() {
				it("should route just fine", function(done) {
					cerus.view("/", __dirname + "/views/view").catch(throw_);
					cerus.server().start()
					.then(function() {
						cerus.request()
						.port(cerus.settings().port())
						.expect("body", "<h1>Hello World!</h1>")
						.send(function() {
							cerus.server().stop()
							.then(function() {
								done();
							});
						});
					});
				});
			});
		});

		context("after starting the server", function() {
			context("with a relative path", function() {
				it("should route just fine", function(done) {
					cerus.server().start()
					.then(function() {
						cerus.view("/", "view").catch(throw_);
						cerus.request()
						.port(cerus.settings().port())
						.expect("body", "<h1>Hello World!</h1>")
						.send(function() {
							cerus.server().stop()
							.then(function() {
								done();
							});
						});
					});
				});
			});

			context("with an absolute path", function() {
				it("should route just fine", function(done) {
					cerus.server().start()
					.then(function() {
						cerus.view("/", __dirname + "/views/view").catch(throw_);
						cerus.request()
						.port(cerus.settings().port())
						.expect("body", "<h1>Hello World!</h1>")
						.send(function() {
							cerus.server().stop()
							.then(function() {
								done();
							});
						});
					});
				});
			});
		});
	});

	describe("#assets", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					cerus.assets();
				}

				expect(func).to.throw();
			});
		});

		context("with a single file", function() {
			context("with a relative path", function() {
				it("should route just fine", function(done) {
					cerus.assets("css").catch(throw_);
					cerus.server().start()
					.then(function() {
						cerus.request()
						.port(cerus.settings().port())
						.path("/css/styles.css")
						.expect("body", "body{margin:0;}")
						.send(function() {
							cerus.server().stop()
							.then(function() {
								done();
							});
						});
					});
				});
			});

			context("with an absolute path", function() {
				it("should route just fine", function(done) {
					cerus.assets(__dirname + "/assets/css").catch(throw_);
					cerus.server().start()
					.then(function() {
						cerus.request()
						.port(cerus.settings().port())
						.path("/css/styles.css")
						.expect("body", "body{margin:0;}")
						.send(function() {
							cerus.server().stop()
							.then(function() {
								done();
							});
						});
					});
				});
			});
		});

		context("with multiple files", function() {
			context("with a relative path", function() {
				it("should route just fine", function(done) {
					cerus.assets("js").catch(throw_);
					cerus.server().start()
					.then(function() {
						cerus.request()
						.port(cerus.settings().port())
						.path("/js/script1.js")
						.expect("body", "console.log();")
						.send(function() {
							cerus.request()
							.port(cerus.settings().port())
							.path("/js/script2.js")
							.expect("body", "window.log();")
							.send(function() {
								cerus.server().stop()
								.then(function() {
									done();
								});
							});
						});
					});
				});
			});

			context("with an absolute path", function() {
				it("should route just fine", function(done) {
					cerus.server().start()
					.then(function() {
						cerus.assets(__dirname + "/assets/js").catch(throw_);
						cerus.request()
						.port(cerus.settings().port())
						.path("/js/script1.js")
						.expect("body", "console.log();")
						.send(function() {
							cerus.request()
							.port(cerus.settings().port())
							.path("/js/script2.js")
							.expect("body", "window.log();")
							.send(function() {
								cerus.server().stop()
								.then(function() {
									done();
								});
							});
						});
					});
				});
			});
		});
	});
});