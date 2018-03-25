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

module.exports = folders;
