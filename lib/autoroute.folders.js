/**
 *
 * @class autoroute.folders
 */
var folders = module.exports = function(folders) {
	// Check if the arguments are correct
	if(typeof folders !== "object") {
		throw new TypeError("the folders argument must be an object");
	}

	// Intialize the local variables
	this._folders = folders;
}

/**
 * 
 * @function autoroute.folders.views
 */
folders.prototype.views = function(path) {
	if(path !== undefined) {
		this._folders.views = path;
	}

	return path;

/**
 * 
 * @function autoroute.folders.assets
 */
folders.prototype.assets = function(path) {
	if(path !== undefined) {
		this._folders.assets = path;
	}

	return path;
}