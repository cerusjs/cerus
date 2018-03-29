var folders = require("./autoroute/folders");
var path_ = require("path");

/**
 * This is the autoroute class. It is used to easily route views, assets and your favicon. If you 
 * don't know what these are you can take look at each of the functions or at the tutorials for 
 * this class.
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
	 * With the favicon function you can easily route the favicon of your site. If you don't know 
	 * what a favicon is: it is the image that a browser will request to use as icon. There is no 
	 * folder where the icon is meant to be stored. If the path isn't absolute it is just added 
	 * after the root. If it is absolute it'll directly be used. Before usage the path is fixed. 
	 * Meaning that all \\\\ are replaced with a / to support all platforms. When the file is 
	 * loaded a file event will be called on the returned promise. This event will be supplied with
	 * the file object. When the favicon was requested there will be a request event, with as 
	 * arguments the request and response objects.
	 * @example
	 * // with as project env "C:\\project\\example.js"
	 * cerus.autoroute().favicon("favicon.png");
	 * // -> will load and route "C:/project/favicon.png" to "/favicon.ico"
	 * @summary Loads and routes the favicon.
	 * @param {String} path The path to the icon.
	 * @return {Promise} This function will return a promise.
	 * @function favicon
	 */
	favicon(path) {
		if(typeof path !== "string") {
			throw new TypeError("argument path must be a string");
		}

		// Fix the url by replacing \\ with / to support all platforms
		var _path = path.replace(/\\/g,"/");

		// Append the root path if the path isn't absolute
		if(!path_.isAbsolute(path)) {
			_path = this._cerus.root() + _path;
		}

		return this._cerus.promise(function(event) {
			this._cerus.file(_path).read()
			.then(function(file) {
				event("file", file);

				this._cerus.router().get("/favicon.ico")
				.then(function(req, res) {
					event("request", req, res);

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
	 * with the ext parameter. The view will be routed to specified url. The promise this function 
	 * returns emits a file event the view was loaded, a request event when the view was requested
	 * and a finish event when the view has finished routing.
	 * @example
	 * // with as project env "C:\\project\\example.js"
	 * cerus.autoroute().view("/home", "example");
	 * // -> will load and route "C:/project/views/example.html" to "/home"
	 * @summary Loads and routes a view.
	 * @param {String} url The url the view will be routed to.
	 * @param {String} filename The filename or path of the view.
	 * @param {String} (ext = ".html") The extension of the view.
	 * @return {Promise} This function will return a promise.
	 * @function view
	 */
	view(url, filename, ext = ".html") {
		if(typeof url !== "string") {
			throw new TypeError("argument url must be a string");
		}
		if(typeof filename !== "string") {
			throw new TypeError("argument filename must be a string");
		}

		var path = "";

		// Fix the filename by replacing \\ with / to support all platforms
		var filename_ = filename.replace(/\\/g,"/");

		if(path_.isAbsolute(filename_)) {
			path = filename_ + (filename_.endsWith(ext) ? "" : ext);
		}
		else {
			path = this._cerus.root() + this._folders._views + "/" + filename_ + (filename_.endsWith(ext) ? "" : ext);
		}

		return this._cerus.promise(function(event) {
			this._cerus.file(path).read()
			.then(function(data, file) {
				event("file", file);

				this._cerus.router().get(url)
				.then(function(req, res) {
					event("request", req, res);

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
	 * all the platforms. The assets will be routed to /{FOLDER}/{FILE}. You can also override the 
	 * type that will be send with the request by using the type parameter. This function will a 
	 * promise that emits the following events: file when a new file is loaded, request when a file
	 * has been requested and finish when all files in the folder are loaded and routed.
	 * @example
	 * // with as project env "C:\\project\\example.js" and folder "C:\\project\\assets\\css\\" containing two files:
	 * // "example1.css" and "example2.css"
	 * cerus.autoroute().assets("css");
	 * // -> will load and route "example1.css" to "/css/example1.css" and "example2.css" to "/css/example2.css"
	 * @summary Loads and routes an assets folder.
	 * @param {String} folder The assets folder that will be routed.
	 * @param {String} (type) The type that will be used for the response.
	 * @return {Promise} This function will return a promise.
	 * @function assets
	 */
	assets(folder, type) {
		if(typeof folder !== "string") {
			throw new TypeError("argument folder must be a string");
		}

		// Fix the filename by replacing \\ with / to support all platforms
		var folder_ = folder.replace(/\\/g,"/");

		var path = "";

		if(path_.isAbsolute(folder_)) {
			path = folder_ + "/";
			folder_ = folder_.substring(folder_.lastIndexOf(this._folders._assets) + this._folders._assets.length, folder_.length);
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
				}.bind(this))
				.catch(function(err) {
					event("error", err);
				});
			}.bind(this));
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
