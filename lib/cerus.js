var core = require("cerus-core")();

/**
 * This is the main class for the cerus module. It isn't really a class since it creates an 
 * instantiation of the core class and adds some plugins to the core. This class also adds a root
 * function to cerus and some of the plugins that are added can also be found in this package.
 * @class cerus
 * @nofunction
 */
module.exports = function() {
	core.use((function() {
		var core = {};
		var root_ = process.cwd().replace(/\\/g, "/") + "/";

		core.name = "cerus";
		core.version = "0.1.0";

		/**
		 * This is the setter and getter for the project's root location. By default this root is a
		 * fixed version of process.cwd(). The fix that is applied is replacing all '\\' with '/' 
		 * to add support all platforms. The default root also contains a slash at the end to let 
		 * every platform know it is definitely a folder.
		 * @example
		 * // with as project env "C:\\project\\example.js"
		 * console.log(cerus.root());
		 * // -> will return "C:/project/"
		 * @param {String} (root) The new path for the root.
		 * @return {String} The root path.
		 * @function root
		 */
		core.root = function(root) {
			if(typeof root === "string") {
				root_ = root;
			}

			return root_;
		};

		return core;
	})());

	core.use(require("cerus-promise")());
	core.use(require("cerus-server")());
	core.use(require("cerus-fs")());
	core.use(require("cerus-compression")());
	core.use(require("cerus-router")());
	core.use(require("cerus-api")());

	core.use(require("./autoroute")());
	core.use(require("./require")());

	return core;
};
