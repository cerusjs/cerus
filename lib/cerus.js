module.exports = function() {
	var core = require("cerus-core")();
	var zlib = require("zlib");

	core.use({
		name: "cerus",
		version: "0.0.1"
	});
	core.use(require("cerus-settings")());

	core.settings().setting("port", 8080);
	core.settings().setting("root", process.cwd().replace(/\\/g,"/") + "/");
	core.settings().setting("directories.locales", "locales");
	core.settings().setting("directories.helpers", "helpers");
	core.settings().setting("directories.models", "models");
	core.settings().setting("directories.logs", "logs");
	core.settings().setting("directories.libraries", "libraries");
	core.settings().setting("directories.api", "api");
	core.settings().setting("directories.policies", "policies");
	core.settings().setting("directories.assets", "assets");
	core.settings().setting("directories.views", "views");
	core.settings().setting("urls.api", "api");

	core.use(require("cerus-promise")());
	core.use(require("cerus-server")());
	core.use(require("cerus-fs")());
	core.use(require("cerus-compression")());
	core.use(require("cerus-router")());
	core.use(require("cerus-api")());

	/**
	 * This is the autoroute module. It contains functions that make it much easier to route things
	 * like views, assets and the favicon. This module is not accessable with the .autoroute 
	 * function, since all the functions in this class are directly accessable from the cerus 
	 * object.
	 * @class autoroute
	 */
	core.use(function() {
		var self = {};

		self.name = "cerus-autoroute";
		self.version = "0.0.1";
		self.dependencies = [
			"cerus",
			"cerus-router",
			"cerus-settings",
			"cerus-fs"
		];

		var cerus;

		self.init_ = function(cerus_) {
			cerus = cerus_;
		}

		/**
		 * With this function you can route the favicon. This means it will route the specified
		 * path to the "/favicon.ico" URL. A favicon is the icon that the browser will request to 
		 * display as the icon that "comes" with the icon.
		 * @example
		 * // With a relative path
		 * cerus.favicon("./favicon.png");
		 * @example
		 * // With an absolute path
		 * cerus.favicon("C://favicon.png");
		 * @param {String} path The path that contains the favicon.
		 * @return {Promise} It will return a promise. The promise can receive two events: "file" 
		 * when the file was loaded and "request" when the favicon was requested.
		 * @function favicon
		 */
		self.favicon = function(path) {
			if(typeof path !== "string") {
				throw new TypeError("argument path must be a string");
			}

			path = path.replace(/\\/g,"/");

			if(!path.startsWith(cerus.settings().root())) {
				path = cerus.settings().root() + path;
			}

			return cerus.promise(function(event) {
				cerus.file(path).read()
				.then(function(file) {
					event("file", file);

					cerus.router().get("/favicon.ico")
					.then(function(req, res) {
						event("request", req, res);

						res.file(file.data());
					});
				})
				.catch(function(err) {
					event("error", err);
				});
			});
		}

		/**
		 * With the view function you can route a view. A view is a html file that is located in 
		 * the "views" folder. The file located at the specified path will be routed to the 
		 * specified URL.
		 * @example
		 * // With a relative path
		 * cerus.view("/", "index.html");
		 * @example
		 * // With an absolute path
		 * cerus.view("/", "C://index.html");
		 * @param {String} url The URL the view will be routed to.
		 * @param {String} filename The filename of the view that will be routed.
		 * @return {Promise} It will return a promise. The promise can receive three events: "file" 
		 * when the file was loaded, "request" when the favicon was requested and "finish" when 
		 * everything is finished.
		 * @function view
		 */
		self.view = function(url, filename) {
			if(typeof url !== "string") {
				throw new TypeError("argument url must be a string");
			}

			if(typeof filename !== "string") {
				throw new TypeError("argument filename must be a string");
			}

			var path = "";

			filename = filename.replace(/\\/g,"/");

			if(filename.startsWith(cerus.settings().root())) {
				path = filename + ".html";
			}
			else {
				path = cerus.settings().root() + 
					cerus.settings().directories().views() + "/" + 
					filename + ".html";
			}

			return cerus.promise(function(event) {
				cerus.file(path).read()
				.then(function(file) {
					event("file", file);

					cerus.router().get(url)
					.then(function(req, res) {
						event("request", req, res);

						res.file(file);
					});

					event("finish");
				})
				.catch(function(err) {
					event("error", err);
				});
			});
		}

		/**
		 * With the assets folder you can route assets. Assets are a group of files like 
		 * stylesheets, scripts and images. The folder you specify will be located under the 
		 * "assets" folder, unless the folder is changed. You can also specify a type. This type 
		 * will be send with the response. The files are routed to the URL "/FOLDER/FILE".
		 * @example
		 * // With a relative path
		 * cerus.assets("/stylesheets", "css");
		 * @example
		 * // With an absolute path
		 * cerus.assets("C://stylesheets", "css");
		 * @param {String} folder The folder the assets are located in.
		 * @param {String} (type) The type that will be send with response. Use the "image" type 
		 * to send binary files.
		 * @return {Promise} It will return a promise. The promise can receive three events: "file" 
		 * when the file was loaded, "request" when the favicon was requested and "finish" when 
		 * everything is finished.
		 * @function assets
		 */
		self.assets = function(folder, type) {
			if(typeof folder !== "string") {
				throw new TypeError("argument folder must be a string");
			}

			folder = folder.replace(/\\/g,"/");

			var path = "";

			if(folder.startsWith(cerus.settings().root())) {
				path = folder + "/";
				folder = folder.substring(folder.lastIndexOf("assets/") + 7, folder.length);
			}
			else {
				path = cerus.settings().root() + cerus.settings().directories().assets() + "/" + folder + "/";
			}

			return cerus.promise(function(event) {
				cerus.folder(path).files()
				.on("file", function(file, last) {
					file.read()
					.then(function() {
						event("file", file);

						cerus.router().get("/" + folder + "/" + file.name())
						.then(function(req, res) {
							event("request", req, res);
							
							res.type(type || file.type());

							if(res.type().startsWith("image")) {
								res.send(file.data(), "binary");
							}
							else {
								res.file(file);
							}
						});

						if(last) {
							event("finish");
						}
					})
					.catch(function(err) {
						event("error", err);
					});
				});
			});
		}

		return self;
	}());
	
	core.use(function() {
		var self = {};

		var helpers = {};

		self.name = "cerus-helpers";
		self.version = "0.0.2";

		var cerus;

		self.init_ = function(cerus_) {
			cerus = cerus_;
		}

		self.helper = function(name) {
			if(name === undefined) {
				throw new TypeError("argument name must be a string");
			}

			if(helpers[name] === undefined) {
				var path = name;
				path = path.replace(/\\/g,"/");

				if(path.startsWith(cerus.settings().root())) {
					return helpers[name.substring(name.lastIndexOf("/") + 1, name.length)] = require(path)(core);
				}
				else {
					return helpers[name] = require(
						core.settings().root() +
						core.settings().directories().helpers() + "/" +
						name
					)(core);
				}
			}
			else {
				return helpers[name];
			}
		}

		return self;
	}());

	core.use(function() {
		var self = {};

		var libraries = {};

		self.name = "cerus-libraries";
		self.version = "0.0.2";

		var cerus;

		self.init_ = function(cerus_) {
			cerus = cerus_;
		}

		self.library = function(name) {
			if(name === undefined) {
				throw new TypeError("argument name must be a string");
			}

			if(libraries[name] === undefined) {
				var path = name;
				path = path.replace(/\\/g,"/");

				if(path.startsWith(cerus.settings().root())) {
					return libraries[name.substring(name.lastIndexOf("/") + 1, name.length)] = require(path);
				}
				else {
					return libraries[name] = require(
						core.settings().root() +
						core.settings().directories().libraries() + "/" +
						name
					);
				}
			}
			else {
				return libraries[name];
			}
		}

		return self;
	}());

	core.use(function() {
		var self = {};

		var models = {};

		self.name = "cerus-models";
		self.version = "0.0.2";

		var cerus;

		self.init_ = function(cerus_) {
			cerus = cerus_;
		}

		self.model = function(name) {
			if(name === undefined) {
				throw new TypeError("argument name must be a string");
			}

			if(models[name] === undefined) {
				var path = name;
				path = path.replace(/\\/g,"/");

				if(path.startsWith(cerus.settings().root())) {
					return models[name.substring(name.lastIndexOf("/") + 1, name.length)] = require(path);
				}
				else {
					return models[name] = require(
						core.settings().root() +
						core.settings().directories().models() + "/" +
						name
					);
				}
			}
			else {
				return models[name];
			}
		}

		return self;
	}());

	return core;
}