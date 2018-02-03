var folders = require("./autoroute/folders");
var path_ = require("path");

class autoroute {
	constructor(cerus) {
		this.name = "cerus-autoroute";
		this.version = "0.1.0";
		this._folders = new folders();
		this._cerus = cerus;
	}

	folders() {
		return folders;
	}

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
			path = filename_ + ext;
		}
		else {
			path = this._cerus.root() + this._folders._views + "/" + filename_ + ext;							// the file + the extension
		}

		return this._cerus.promise(function(event) {
			this._cerus.file(path).read()
			.then(function(file) {
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

					this._cerus.router().get("/" + folder_ + "/" + file.name())
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
		return autoroute_.favicon(url, filename, ext);
	};

	plugin.assets = function(folder, type) {
		return autoroute_.favicon(folder, type);
	};

	return plugin;
};
