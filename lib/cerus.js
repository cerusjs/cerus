module.exports = function() {
	// Require all the private modules
	var core = require("cerus-core")();
	var zlib = require("zlib");

	// Import the most important modules
	core.use({
		name: "cerus",
		version: "0.0.1"
	});
	core.use(require("cerus-settings")());

	// Set all of the settings
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

	// Import the remaining modules
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
	 * @id autoroute
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
		var folders = {
			views: "views",
			assets: "assets"
		};

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
			// Check if the path exists
			if(typeof path !== "string") {
				throw new TypeError("argument path must be a string");
			}

			// Fix the url by replacing \\ with / to support all platforms
			path = path.replace(/\\/g,"/");

			// Check if the path is the root
			if(!path.startsWith(cerus.settings().root())) {
				path = cerus.settings().root() + path;
			}

			return cerus.promise(function(event) {
				// Read the specified path
				cerus.file(path).read()
				.then(function(file) {
					event("file", file);

					// Route the image to the favicon.ico
					cerus.router().get("/favicon.ico")
					.then(function(req, res) {
						event("request", req, res);

						// Send the file
						res.file(file);
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
			// Check if the url and the filename exist
			if(typeof url !== "string") {
				throw new TypeError("argument url must be a string");
			}
			if(typeof filename !== "string") {
				throw new TypeError("argument filename must be a string");
			}

			var path = "";

			// Fix the filename by replacing \\ with / to support all platforms
			filename = filename.replace(/\\/g,"/");

			// Set the full path by checking if it starts with the root and then appending the rest
			if(filename.startsWith(cerus.settings().root())) {
				path = filename + ".html";
			}
			else {
				path = cerus.settings().root() + 
					cerus.settings().directories().views() + "/" + 
					filename + ".html";
			}

			return cerus.promise(function(event) {
				// Read the specified path
				cerus.file(path).read()
				.then(function(file) {
					event("file", file);

					// Route the view to the specified url
					cerus.router().get(url)
					.then(function(req, res) {
						event("request", req, res);

						// Send the file
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
	
	/**
	 * This is the require module. With it you can require things like helpers, libraries and 
	 * models. All the required files are cached to make the loading process faster. This module 
	 * is not accessable with the .autoroute function, since all the functions in this class are 
	 * directly accessable from the cerus object.
	 * @class require
	 * @id require
	 */
	core.use(function() {
		var self = {};

		var helpers = {};
		var libraries = {};
		var models = {};

		self.name = "cerus-require";
		self.version = "0.0.1";

		var cerus;

		self.init_ = function(cerus_) {
			cerus = cerus_;
		}

		/**
		 * With the helper function you can require helpers. A helper is a javascript file that is 
		 * initialized when it is first loaded, but not after that. A helper contains functions 
		 * that help you with API calls for example. By default the helpers are located in the 
		 * "helpers" folder.
		 * @param {String} name The name of the helper.
		 * @return {Class} The helper class.
		 * @function helper
		 */
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

		/**
		 * The library function is used to require libraries. When using this function the 
		 * returned class isn't initialized yet. Just like the helper function the loaded class is 
		 * cached to speed up the loading process. By default the libraries are located in the 
		 * "libraries" folder.
		 * @param {String} name The name of the library.
		 * @return {Class} The library class.
		 * @function library
		 */
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

		/**
		 * This function is used to require models. Just like the library function the returned 
		 * class isn't initialized yet and the loaded classes are cached. By default the models 
		 * are loacted in the "models" folder.
		 * @param {String} name The name of the model.
		 * @return {Class} The model class.
		 * @function model
		 */
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