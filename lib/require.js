var folders = require("./require/folders");
var path_ = require("path");

class require_ {
	constructor(cerus) {
		this._folders = new folders();
		this._cerus = cerus;
		this._helpers = {};
		this._libraries = {};
		this._models = {};
	}

	folders() {
		return this._folders;
	}

	helper(name) {
		if(typeof name !== "string") {
			throw new TypeError("argument name must be a string");
		}

		if(this._helpers[name] === undefined) {
			var path = name;

			path = path.replace(/\\/g,"/");

			if(path_.isAbsolute(path)) {
				return this._helpers[name.substring(name.lastIndexOf("/") + 1, name.length)] = require(path)(this._cerus);
			}

			return this._helpers[name] = require(this._cerus.root() + this._folders._helpers + "/" + name)(this._cerus);
		}

		return this._helpers[name];
	}

	library(name) {
		if(typeof name !== "string") {
			throw new TypeError("argument name must be a string");
		}

		if(this._libraries[name] === undefined) {
			var path = name;

			path = path.replace(/\\/g,"/");

			if(path_.isAbsolute(path)) {
				return this._libraries[name.substring(name.lastIndexOf("/") + 1, name.length)] = require(path);
			}

			return this._libraries[name] = require(this._cerus.root() + this._folders._libraries + "/" + name);
		}

		return this._libraries[name];
	}

	model(name) {
		if(typeof name !== "string") {
			throw new TypeError("argument name must be a string");
		}

		if(this._models[name] === undefined) {
			var path = name;

			path = path.replace(/\\/g,"/");

			if(path_.isAbsolute(path)) {
				return this._models[name.substring(name.lastIndexOf("/") + 1, name.length)] = require(path);
			}

			return this._models[name] = require(this._cerus.root() + this._folders._models + "/" + name);
		}

		return this._models[name];
	}
}

module.exports = function() {
	var plugin = {};
	var require__;

	plugin.name = "cerus-require";
	plugin.version = "0.1.0";

	plugin._init = function(cerus) {
		require__ = new require_(cerus);
	};

	plugin.require = function() {
		return require__;
	};

	plugin.library = function(name) {
		return require__.library(name);
	};

	plugin.helper = function(name) {
		return require__.helper(name);
	};

	plugin.model = function(name) {
		return require__.model(name);
	};

	return plugin;
};