module.exports = function() {
	var core = require("cerus-core")();

	core.use(require("cerus-settings")());

	core.settings().setting("port", 8080);
	core.settings().setting("root", process.env.PWD);
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

	if(core.settings().root() === undefined) {
		core.settings().root(process.cwd() + "/");
	}

	core.use(function() {
		var self = {};

		var helpers = {};

		self.name = "cerus-helpers";
		self.version = "0.0.1";

		self.helper = function(name) {
			if(name === undefined) {
				return {};
			}

			if(helpers[name] === undefined) {
				return helpers[name] = require(
					core.settings().root() +
					core.settings().directories().helpers() + "/" +
					name
				)(core);
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
		self.version = "0.0.1";

		self.library = function(name) {
			if(name === undefined) {
				return {};
			}

			if(libraries[name] === undefined) {
				return libraries[name] = require(
					core.settings().root() +
					core.settings().directories().libraries() + "/" +
					name
				);
			}
			else {
				return libraries[name];
			}
		}

		return self;
	}());

	return core;
}