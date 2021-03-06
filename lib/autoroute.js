var path_ = require("path");

/**
 * This is the autoroute class. It is used to easily route views, assets and your favicon. If you 
 * don't know what these are you can take look at each of the functions.
 * @class autoroute
 */
class autoroute {
	constructor(cerus) {
		this.name = "cerus-autoroute";
		this.version = "0.1.0";
		this._folders = new folders();
		this._cerus = cerus;
	}

	/**
	 * This function will return the folders class for this module. With it you can change the 
	 * folders the views and assets should be stored in.
	 * @summary Returns the folders class.
	 * @return {Class} The autoroute.folders class.
	 * @function folders
	 */
	folders() {
		return folders;
	}

	/**
	 * With the favicon function you can easily route the favicon of your site. The favicon is the 
	 * image a browser will request to use as icon for the site. There is no folder where the icon 
	 * is meant to be stored, so the path that is used will start from the root if the path isn't 
	 * absolute. If it is absolute it'll directly be used. Before usage the path is fixed by 
	 * replacing all \\\\ with / to add support for all platforms.
	 * @example
	 * // with as project root "C:/project/"
	 * cerus.autoroute().favicon("favicon.png");
	 * // -> will load and route "C:/project/favicon.png" to the "/favicon.ico" url
	 * @emits file When the specified file has been loaded. With the file as first parameter.
	 * @emits request When the favicon is requested. With the request as first parameter and 
	 * response as second.
	 * @emits error When there was an error while loading the file. With the error as first 
	 * parameter.
	 * @summary Loads and routes the favicon.
	 * @param {String} path The path to the icon.
	 * @param {Object} (options={}) The object of options.
	 * @param {Boolean} (options.absolute) If the inserted path is absolute.
	 * @param {String} (options.url="/favicon.ico") The url to route the favicon to.
	 * @param {String} (options.type) The MIME type of the favicon. By default this is automatically selected.
	 * @return {Promise} This function will return a promise.
	 * @function favicon
	 */
	favicon(path, options={}) {
		if(typeof path !== "string") {
			throw new TypeError("argument path must be a string");
		}

		if(typeof options !== "object") {
			throw new TypeError("argument options must be an object");
		}

		// Fix the url by replacing \\ with / to support all platforms
		var fixed_path = path.replace(/\\/g,"/");

		// Append the root path if the path isn't absolute
		if(!path_.isAbsolute(path) && !options.absolute) {
			fixed_path = this._cerus.root() + fixed_path;
		}

		return this._cerus.promise(function(event) {
			this._cerus.file(fixed_path).read()
			.then(function(data, file) {
				event("file", file);

				this._cerus.router().get(typeof options.url === "string" ? options.url : "/favicon.ico")
				.then(function(req, res) {
					event("request", req, res);

					if(typeof options.type === "string") {
						res.type(options.type);
					}

					res.file(file);
				});
			}.bind(this))
			.catch(function(err) {
				event("error", err);
			});
		}.bind(this));
	}

	/**
	 * This function is used to easily route a view. Views are often .html files, but can be 
	 * generalized as a markup file. If you want to learn more about views you can read the 
	 * tutorial about it. By default views are stored in the views folder, but you can change this 
	 * with the .folders().views() function or by using an absolute path. When your path isn't 
	 * absolute it is prefixed by the root and the views folder. If it is absolute the specified 
	 * path won't be prefixed. All paths do however get fixed, all \\ are changed to a / to support
	 * all platforms. The files also get suffixed by default. The suffix can be removed or changed 
	 * with the ext parameter. The view will be routed to the specified url.
	 * @example
	 * // with as project env "C:\\project\\example.js"
	 * cerus.autoroute().view("/home", "example");
	 * // -> will load and route "C:/project/views/example.html" to "/home"
	 * @emits file When the specified view has been loaded. With the file as first parameter.
	 * @emits request When the view is requested. With the request as first parameter and 
	 * response as second.
	 * @emits error When there was an error while loading the file. With the error as first 
	 * parameter.
	 * @emits finish When it is finished loading and routing the file. This event has no 
	 * parameters.
	 * @summary Loads and routes a view.
	 * @param {String} url The url the view will be routed to.
	 * @param {String} filename The filename or path of the view.
	 * @param {Object} (options={}) The object of options.
	 * @param {String} (options.ext=".html") The extension of the view.
	 * @param {Boolean} (options.absolute) If the inserted path is absolute.
	 * @param {String} (options.type) The MIME type of the favicon. By default this is automatically selected.
	 * @return {Promise} This function will return a promise.
	 * @function view
	 */
	view(url, filename, options={}) {
		if(typeof url !== "string") {
			throw new TypeError("argument url must be a string");
		}
		if(typeof filename !== "string") {
			throw new TypeError("argument filename must be a string");
		}
		if(typeof options !== "object") {
			throw new TypeError("argument options must be an object");
		}

		var options_ = Object.assign({}, options);

		if(typeof options_.ext !== "string") {
			options_.ext = ".html";
		}

		var path = "";

		// Fix the filename by replacing \\ with / to support all platforms
		var filename_ = filename.replace(/\\/g,"/");

		if(path_.isAbsolute(filename_) || options_.absolute) {
			path = filename_ + (filename_.endsWith(options_.ext) ? "" : options_.ext);
		}
		else {
			path = this._cerus.root() + this._folders._views + "/" + filename_ + (filename_.endsWith(options_.ext) ? "" : options_.ext);
		}

		return this._cerus.promise(function(event) {
			this._cerus.file(path).read()
			.then(function(data, file) {
				event("file", file);

				this._cerus.router().get(url)
				.then(function(req, res) {
					event("request", req, res);

					if(typeof options_.type === "string") {
						res.type(options_.type);
					}

					res.file(file);
				});

				event("finish");
			}.bind(this))
			.catch(function(err) {
				event("error", err);
			});
		}.bind(this));
	}

	/**
	 * With this function you can route assets. Assets are folders containing a certain type of 
	 * "assets", e.g. stylesheets, scripts, images, etc. If you want to learn more about how to use
	 * assets take a look at the assets tutorial. By default all the assets are stored in the 
	 * assets folder. You can change this folder with .folder().assets(). You can also use an 
	 * absolute path. When using an absolute path the default prefix, the root and assets folder,
	 * won't be used. This path is also fixed (\\\\ is changed to /) before being used to support 
	 * all the platforms. The assets will be routed to /{FOLDER}/{FILE}, for example: "styles.css" 
	 * from folder "css" will routed to "/css/styles.css". You can also override the type that will
	 * be send with the request by using the type parameter.
	 * @example
	 * // with as project env "C:\\project\\example.js" and folder "C:\\project\\assets\\css\\" containing two files:
	 * // "example1.css" and "example2.css"
	 * cerus.autoroute().assets("css");
	 * // -> will load and route "example1.css" to "/css/example1.css" and "example2.css" to "/css/example2.css"
	 * @emits file When one of the assets has been loaded. With the file as first parameter.
	 * @emits request When an asset is requested. With the request as first parameter and response 
	 * as second.
	 * @emits error When there was an error while loading the file. With the error as first 
	 * parameter.
	 * @emits finish When it is finished loading and routing all the assets. This event has no 
	 * parameters.
	 * @summary Loads and routes an assets folder.
	 * @param {String} folder The assets folder that will be routed.
	 * @param {Object} (options={}) The object of options.
	 * @param {Boolean} (options.absolute) If the inserted path is absolute.
	 * @param {String} (options.type) The MIME type of the favicon. By default this is automatically selected.
	 * @return {Promise} This function will return a promise.
	 * @function assets
	 */
	assets(folder, options={}) {
		if(typeof folder !== "string") {
			throw new TypeError("argument folder must be a string");
		}
		if(typeof options !== "object") {
			throw new TypeError("argument options must be an object");
		}

		// Fix the filename by replacing \\ with / to support all platforms
		var folder_ = folder.replace(/\\/g,"/");

		var path = "";

		if(path_.isAbsolute(folder_) || options.absolute) {
			path = folder_ + "/";
			folder_ = folder_.substring(folder_.lastIndexOf(this._folders._assets) + this._folders._assets.length + 1, folder_.length);
		}
		else {
			path = this._cerus.root() + this._folders._assets + "/" + folder_ + "/";
		}

		return this._cerus.promise(function(event) {
			this._cerus.folder(path).files()
			.on("file", function(file, last) {
				file.read()
				.then(function() {
					event("file", file);

					this._cerus.router().get("/" + folder_ + "/" + file.base())
					.then(function(req, res) {
						event("request", req, res);
						
						res.type(options.type || file.type());

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
				}.bind(this))
				.catch(function(err) {
					event("error", err);
				});
			}.bind(this))
			.catch(function(err) {
				event("error", err);
			});
		}.bind(this));
	}
}

module.exports = function() {
	var plugin = {};
	var autoroute_;

	plugin.name = "cerus-autoroute";
	plugin.version = "0.2.0";
	plugin.dependencies = [
		"cerus",
		"cerus-router",
		"cerus-fs"
	];

	plugin._init = function(cerus) {
		autoroute_ = new autoroute(cerus);
	};

	plugin.autoroute = function() {
		return autoroute_;
	};

	plugin.favicon = function(path) {
		return autoroute_.favicon(path);
	};

	plugin.view = function(url, filename, ext) {
		return autoroute_.view(url, filename, ext);
	};

	plugin.assets = function(folder, type) {
		return autoroute_.assets(folder, type);
	};

	return plugin;
};

/**
 * This class contains the folder settings for the autoroute module. With this class you can change
 * the folders where the views and assets are stored in.
 * @class autoroute.folders
 */
class folders {
	constructor() {
		this._views = "views";
		this._assets = "assets";
	}

	/**
	 * This is the getter and setter for the views folder. This is the folder where the views 
	 * should be put in. By default this path is "views". See {@link autoroute.view} to learn what 
	 * a view is. This path is also fixed (\\\\ is changed to /) before being used to support all 
	 * the platforms.
	 * @summary The getter/setter for the views folder.
	 * @param {String} (path) The new path for the views folder.
	 * @return {String} The path for the views folder.
	 * @function views
	 */
	views(path) {
		if(typeof path === "string") {
			this._views = path.replace(/\\/g,"/");
		}

		return this._views;
	}

	/**
	 * This is the getter and setter for the assets folder. This is the folder where the assets 
	 * classes should be put in. By default this path is "assets". See {@link autoroute.assets} for
	 * what a assets is. This path is also fixed (\\\\ is changed to /) before being used to 
	 * support all the platforms.
	 * @summary The getter/setter for the assets folder.
	 * @param {String} (path) The new path for the assets folder.
	 * @return {String} The path for the assets folder.
	 * @function assets
	 */
	assets(path) {
		if(typeof path === "string") {
			this._assets = path.replace(/\\/g,"/");
		}

		return this._assets;
	}
}