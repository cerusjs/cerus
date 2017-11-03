var cerus = require("../index")();

// TEST //
cerus.api().add("test/")
.on("request", function(req, json) {
	json.json()["test"] = "It worked!";
	json.emit();
});

cerus.server().start()
.then(function() {
	console.log("Started listening on port " + cerus.settings().port());

	require('request')("http://localhost:8080/api/test/", function(error, response, body) {
		if(error) {
			console.log(error);
		}
		else {
			console.log("url (" + response.request.method + "): " + response.request.uri.href);
			console.log("code: " + response.statusCode);
			console.log("type: " + response.headers['content-type']);
			console.log("body: " + body);
		}

		cerus.server().stop();
	});
})
.catch(console.log);