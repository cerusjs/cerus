var path_ = require("path");

/**
 * This class is used to easily require models, helpers and libraries. These class types are an 
 * important part of the cerus-ecosystem. Each type is explained in the corresponding function. 
 * When requiring a new class it is also cached to ensure higher loading speeds. You can also set 
 * the folder where the classes are loaded from.
 * @class require
 */
class require_ {
	constructor(cerus) {
		this._folders = new folders();
		this._cerus = cerus;
		this._helpers = {};
		this._libraries = {};
		this._models = {};
	}

	/**
	 * This function returns the folders class for this module. With this class you can set the 
	 * folders where the helpers, models and libraries are loaded from.
	 * @summary Returns the folders class.
	 * @return {Class} The require.folders class.
	 * @function folders
	 */
	folders() {
		return this._folders;
	}

	/**
	 * This function loads helpers for you. A helper is class that contains functions that help you
	 * with a certain job. More information about helpers can be found in the tutorial about it. 
	 * The helper that is loaded is specified by it's name. When a helper is loaded for a second 
	 * time it will load faster since the class is cached when it's first loaded. The name can also
	 * be an absolute path if you don't want to use the default routing. You can change the name of
	 * the folder where helper classes should be stored with .folders().helpers(). The path is 
	 * fixed (\\\\ is changed to /) before it is used to ensure support for all platforms. This 
	 * function can also be called directly using cerus.helper(). A helper class differs from a 
	 * model since the helper is initialized when it's first loaded and a model is returned 
	 * uninitialized.
	 * @example
	 * // with as project env "C:\\project\\example.js"
	 * cerus.autoroute().helper("example");
	 * // -> will load "C:/project/helpers/example.js"
	 * @example
	 * // with as project env "C:\\project\\example.js" and using an absolute path
	 * cerus.autoroute().helper("D:\\project\\example");
	 * // -> will load "D:/project/example.js"
	 * @summary Loads a helper class.
	 * @param {String} name The name of the helper.
	 * @param {Object} (options={}) The object of options.
	 * @param {Boolean} (options.absolute) If the inserted path is absolute.
	 * @param {Boolean} (options.override) If the helper should be overridden.
	 * @return {Class} The specified (initialized) helper class.
	 * @function helper
	 */
	helper(name, options = {}) {
		if(typeof name !== "string") {
			throw new TypeError("argument name must be a string");
		}
		if(typeof options !== "object") {
			throw new TypeError("argument options must be an object");
		}

		if(this._helpers[name] === undefined || options.override) {
			var path = name;

			path = path.replace(/\\/g,"/");

			if(options.absolute || path_.isAbsolute(path)) {
				return this._helpers[name.substring(name.lastIndexOf("/") + 1, name.length)] = require(path)(this._cerus);
			}

			return this._helpers[name] = require(this._cerus.root() + this._folders._helpers + "/" + name)(this._cerus);
		}

		return this._helpers[name];
	}

	/**
	 * This function is used to load libraries. In CerusJS a library is a third-party class. For 
	 * more information about libraries you can read the tutorial about it. You can specify the 
	 * library that is loaded using the name parameter. When loading a library for a second time 
	 * it'll load faster since libraries are cached when they're first loaded. You can also use an 
	 * absolute path if you don't want to use the default routing. You can change the name of the 
	 * folder where the libraries should be stored with .folders().libraries(). The path is fixed 
	 * (\\\\ is changed to /) before it is used to ensure support for all platforms. This function 
	 * can also be called directly using cerus.library().
	 * @example
	 * // with as project env "C:\\project\\example.js"
	 * cerus.autoroute().library("example");
	 * // -> will load "C:/project/libraries/example.js"
	 * @example
	 * // with as project env "C:\\project\\example.js" and using an absolute path
	 * cerus.autoroute().library("D:\\project\\example");
	 * // -> will load "D:/project/example.js"
	 * @summary Loads a library.
	 * @param {String} name The name of the library.
	 * @param {Object} (options={}) The object of options.
	 * @param {Boolean} (options.absolute) If the inserted path is absolute.
	 * @param {Boolean} (options.override) If the library should be overridden.
	 * @return {Class} The specified library.
	 * @function library
	 */
	library(name, options = {}) {
		if(typeof name !== "string") {
			throw new TypeError("argument name must be a string");
		}
		if(typeof options !== "object") {
			throw new TypeError("argument options must be an object");
		}

		if(this._libraries[name] === undefined || options.override) {
			var path = name;

			path = path.replace(/\\/g,"/");

			if(options.absolute || path_.isAbsolute(path)) {
				return this._libraries[name.substring(name.lastIndexOf("/") + 1, name.length)] = require(path);
			}

			return this._libraries[name] = require(this._cerus.root() + this._folders._libraries + "/" + name);
		}

		return this._libraries[name];
	}

	/**
	 * With this function you can load a model. A model is, just like MVC, a class that is used for
	 * storing (and sometimes loading) data. For more information about models you can read the 
	 * tutorial that is written about it. You can specify the model you want to load using the name
	 * parameter. When the model is loaded for a second time it will be loaded faster since when 
	 * it's loaded first it is cached. Just like the other methods you can use an absolute path 
	 * when you don't want to use the default routing. You can also change the name of the folder 
	 * where the model classes should be stored with .folders().models(). The path is fixed (\\\\ 
	 * is changed to /) before it is used to ensure support for all platforms. This function can 
	 * also be called directly using cerus.model().
	 * @example
	 * // with as project env "C:\\project\\example.js"
	 * cerus.autoroute().model("example");
	 * // -> will load "C:/project/models/example.js"
	 * @example
	 * // with as project env "C:\\project\\example.js" and using a absolute path
	 * cerus.autoroute().model("D:\\project\\example");
	 * // -> will load "D:/project/example.js"
	 * @summary Loads a model class.
	 * @param {String} name The name of the model.
	 * @param {Object} (options={}) The object of options.
	 * @param {Boolean} (options.absolute) If the inserted path is absolute.
	 * @param {Boolean} (options.override) If the model should be overridden.
	 * @return {Class} The specified model class.
	 * @function model
	 */
	model(name, options = {}) {
		if(typeof name !== "string") {
			throw new TypeError("argument name must be a string");
		}
		if(typeof options !== "object") {
			throw new TypeError("argument options must be an object");
		}

		if(this._models[name] === undefined || options.override) {
			var path = name;

			path = path.replace(/\\/g,"/");

			if(options.absolute || path_.isAbsolute(path)) {
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

/**
 * This class contains the folder settings for the require module. With this class you can change
 * the folders where the helpers, libraries and models should be stored in.
 * @class require.folders
 */
class folders {
	constructor() {
		this._helpers = "helpers";
		this._libraries = "libraries";
		this._models = "models";
	}

	/**
	 * This is the getter and setter for the helper folder. This is the folder where the helper 
	 * classes should be put in. By default this path is "helpers". See {@link require.helper} for
	 * what a helper is. This path is also fixed (\\\\ is changed to /) before being used to 
	 * support all the platforms.
	 * @summary The getter/setter for the helper folder.
	 * @param {String} (path) The new path for the helpers folder.
	 * @return {String} The path for the helpers folder.
	 * @function helpers
	 */
	helpers(path) {
		if(typeof path === "string") {
			this._helpers = path.replace(/\\/g,"/");
		}

		return this._helpers;
	}

	/**
	 * This is the getter and setter for the libraries folder. This is the folder where the library 
	 * classes should be put in. By default this path is "libraries". See {@link require.library} 
	 * for what a library is. This path is also fixed (\\\\ is changed to /) before being used to 
	 * support all the platforms.
	 * @summary The getter/setter for the library folder.
	 * @param {String} (path) The new path for the libraries folder.
	 * @return {String} The path for the libraries folder.
	 * @function libraries
	 */
	libraries(path) {
		if(typeof path === "string") {
			this._libraries = path.replace(/\\/g,"/");
		}

		return this._libraries;
	}

	/**
	 * This is the getter and setter for the model folder. This is the folder where the model 
	 * classes should be put in. By default this path is "model". See {@link require.model} for
	 * what a model is. This path is also fixed (\\\\ is changed to /) before being used to 
	 * support all the platforms.
	 * @summary The getter/setter for the model folder.
	 * @param {String} (path) The new path for the models folder.
	 * @return {String} The path for the models folder.
	 * @function models
	 */
	models(path) {
		if(typeof path === "string") {
			this._models = path.replace(/\\/g,"/");
		}

		return this._models;
	}
}