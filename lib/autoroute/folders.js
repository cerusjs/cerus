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
	 * a view is.
	 * @summary The getter/setter for the views folder.
	 * @param {String} (path) The new path for the views folder.
	 * @return {String} The path for the views folder.
	 * @function views
	 */
	views(path) {
		if(typeof path === "string") {
			this._views = path;
		}

		return this._views;
	}

	/**
	 * This is the getter and setter for the assets folder. This is the folder where the assets 
	 * classes should be put in. By default this path is "assets". See {@link autoroute.assets} for
	 * what a assets is.
	 * @summary The getter/setter for the assets folder.
	 * @param {String} (path) The new path for the assets folder.
	 * @return {String} The path for the assets folder.
	 * @function assets
	 */
	assets(path) {
		if(typeof path === "string") {
			this._assets = path;
		}

		return this._assets;
	}
}

module.exports = folders;
