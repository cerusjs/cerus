var cerus = require("../index")();

cerus.use(require("cerus-uuid")());
console.log(cerus.uuid());
cerus.use(require("cerus-sessions")());

// TEST //
cerus.router().route("/test/")
.on("request", function(req, res) {
	console.log(res.sessions());

	if(Object.keys(res.sessions()).length === 0) {
		res.sessions()["test"] = "It works!";
	}

	res.send("Test");
});

cerus.server().start();