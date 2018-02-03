class folders {
	constructor() {
		this._views = "views";
		this._assets = "assets";
	}

	views(path) {
		if(typeof path === "string") {
			this._views = path;
		}

		return this._views;
	}

	assets(path) {
		if(typeof path === "string") {
			this._assets = path;
		}

		return this._assets;
	}
}

module.exports = folders;
