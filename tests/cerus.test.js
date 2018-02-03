var expect = require("chai").expect;
var cerus = require("../index")();
cerus.root(cerus.root() + "tests/");
cerus.use(require("cerus-request")());
var throw_ = function(err) {
	throw err;
}

describe("cerus", function() {
	describe("#require", function() {
		describe("#model", function() {
			context("with no parameters", function() {
				it("should throw a TypeError", function() {
					var func = function() {
						cerus.require().model();
					}

					expect(func).to.throw();
				});
			});

			context("call it once", function() {
				context("with a relative path", function() {
					it("should load just fine", function() {
						expect(cerus.require().model("model")()).to.equal("model");
					});
				});

				context("with an absolute path", function() {
					it("should load just fine", function() {
						expect(cerus.require().model(__dirname + "/models/model")()).to.equal("model");
					});
				});
			});

			context("call it two times", function() {
				context("with a relative path", function() {
					it("should load just fine", function() {
						expect(cerus.require().model("model")()).to.equal("model");
						expect(cerus.require().model("model")()).to.equal("model");
					});
				});

				context("with an absolute path", function() {
					it("should load just fine", function() {
						expect(cerus.require().model(__dirname + "/models/model")()).to.equal("model");
						expect(cerus.require().model(__dirname + "/models/model")()).to.equal("model");
					});
				});
			});
		});

		describe("#library", function() {
			context("with no parameters", function() {
				it("should throw a TypeError", function() {
					var func = function() {
						cerus.require().library();
					}

					expect(func).to.throw();
				});
			});

			context("call it once", function() {
				context("with a relative path", function() {
					it("should load just fine", function() {
						expect(cerus.require().library("library")()).to.equal("library");
					});
				});

				context("with an absolute path", function() {
					it("should load just fine", function() {
						expect(cerus.require().library(__dirname + "/libraries/library")()).to.equal("library");
					});
				});
			});

			context("call it two times", function() {
				context("with a relative path", function() {
					it("should load just fine", function() {
						expect(cerus.require().library("library")()).to.equal("library");
						expect(cerus.require().library("library")()).to.equal("library");
					});
				});

				context("with an absolute path", function() {
					it("should load just fine", function() {
						expect(cerus.require().library(__dirname + "/libraries/library")()).to.equal("library");
						expect(cerus.require().library(__dirname + "/libraries/library")()).to.equal("library");
					});
				});
			});
		});

		describe("#helper", function() {
			context("with no parameters", function() {
				it("should throw a TypeError", function() {
					var func = function() {
						cerus.require().helper();
					}

					expect(func).to.throw();
				});
			});

			context("call it once", function() {
				context("with a relative path", function() {
					it("should load just fine", function() {
						expect(cerus.require().helper("helper")).to.equal("helper");
					});
				});

				context("with an absolute path", function() {
					it("should load just fine", function() {
						expect(cerus.require().helper(__dirname + "/helpers/helper")).to.equal("helper");
					});
				});
			});

			context("call it two times", function() {
				context("with a relative path", function() {
					it("should load just fine", function() {
						expect(cerus.require().helper("helper")).to.equal("helper");
						expect(cerus.require().helper("helper")).to.equal("helper");
					});
				});

				context("with an absolute path", function() {
					it("should load just fine", function() {
						expect(cerus.require().helper(__dirname + "/helpers/helper")).to.equal("helper");
						expect(cerus.require().helper(__dirname + "/helpers/helper")).to.equal("helper");
					});
				});
			});
		});
	});

	describe("#autoroute", function() {
		describe("#favicon", function() {
			context("with no parameters", function() {
				it("should throw a TypeError", function() {
					var func = function() {
						cerus.autoroute().favicon();
					}

					expect(func).to.throw();
				});
			});

			context("with a non-existant file", function() {
				it("should throw an error", function() {
					cerus.autoroute().favicon("icon/notfavicon.png")
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
						cerus.autoroute().favicon("icon/favicon.png").catch(throw_);
						cerus.server().start()
						.then(function() {
							cerus.request()
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
						cerus.autoroute().favicon(__dirname + "/icon/favicon.png").catch(throw_);
						cerus.server().start()
						.then(function() {
							cerus.request()
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
							cerus.autoroute().favicon("icon/favicon.png").catch(throw_);
							cerus.request()
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
							cerus.autoroute().favicon(__dirname + "/icon/favicon.png").catch(throw_);
							cerus.request()
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
						cerus.autoroute().view();
					}

					expect(func).to.throw();
				});
			});

			context("with a non-existant file", function() {
				it("should throw an error", function() {
					cerus.autoroute().view("/", "notview")
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
						cerus.autoroute().view("/", "view").catch(throw_);
						cerus.server().start()
						.then(function() {
							cerus.request()
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
						cerus.autoroute().view("/", __dirname + "/views/view").catch(throw_);
						cerus.server().start()
						.then(function() {
							cerus.request()
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
							cerus.autoroute().view("/", "view").catch(throw_);
							cerus.request()
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
							cerus.autoroute().view("/", __dirname + "/views/view").catch(throw_);
							cerus.request()
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
						cerus.autoroute().assets();
					}

					expect(func).to.throw();
				});
			});

			context("with a single file", function() {
				context("with a relative path", function() {
					it("should route just fine", function(done) {
						cerus.autoroute().assets("css").catch(throw_);
						cerus.server().start()
						.then(function() {
							cerus.request()
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
						cerus.autoroute().assets(__dirname + "/assets/css").catch(throw_);
						cerus.server().start()
						.then(function() {
							cerus.request()
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
						cerus.autoroute().assets("js").catch(throw_);
						cerus.server().start()
						.then(function() {
							cerus.request()
							.path("/js/script1.js")
							.expect("body", "console.log();")
							.send(function() {
								cerus.request()
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
							cerus.autoroute().assets(__dirname + "/assets/js").catch(throw_);
							cerus.request()
							.path("/js/script1.js")
							.expect("body", "console.log();")
							.send(function() {
								cerus.request()
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
});