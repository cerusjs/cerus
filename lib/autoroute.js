// Pre-require the needed files
var folders = require("./autoroute.folders");

/**
 * 
 * @class autoroute
 */
var autoroute = module.exports = function() {
	// Initialize the plugin variables
	this.name = "cerus-autoroute";
	this.version = "0.1.0";

	// Initialize the local variables
	this._folders = {
		views: "views",
		assets: "assets"
	};

	// Initialze variables that don't need reloading
	folders = folders(this._folders);
}

/**
 *
 * @function autoroute.folders
 */
autoroute.prototype.folders = function() {
	return folders;
}