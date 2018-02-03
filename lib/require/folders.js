class folders {
	constructor() {
		this._helpers = "helpers";
		this._libraries = "libraries";
		this._models = "models";
	}

	helpers(path) {
		if(typeof path === "string") {
			this._helpers = path;
		}

		return this._helpers;
	}

	libraries(path) {
		if(typeof path === "string") {
			this._libraries = path;
		}

		return this._libraries;
	}

	models(path) {
		if(typeof path === "string") {
			this._models = path;
		}

		return this._models;
	}
}

module.exports = folders;
