var core = require("cerus-core")();
var zlib = require("zlib");

module.exports = function() {
	core.use((function() {
		var core = {};
		var root_ = process.cwd().replace(/\\/g, "/") + "/";

		core.name = "cerus";
		core.version = "0.1.0";

		core.root = function(root) {
			if(typeof root === "string") {
				root_ = root;
			}

			return root_;
		}

		return core;
	})());

	core.use(require("cerus-settings")()); // Needs to be removed (but is still depended on in cerus-api)

	core.use(require("cerus-promise")());
	core.use(require("cerus-server")());
	core.use(require("cerus-fs")());
	core.use(require("cerus-compression")());
	core.use(require("cerus-router")());
	core.use(require("cerus-api")());

	core.use(require("./autoroute")());
	core.use(require("./require")());

	return core;
}
