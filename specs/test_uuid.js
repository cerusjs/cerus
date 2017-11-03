var cerus = require("../index")();
cerus.use(require("cerus-uuid")());

// TEST //
var uuid = cerus.uuid();

var uuid1 = uuid.generate();
console.log("UUIDs 1:", uuid.uuids());

var uuid2 = uuid.generate();
console.log("UUIDs 2:", uuid.uuids());

console.log("Check:", uuid.check(uuid1));
console.log("Test:", uuid.test(uuid1));

uuid.remove(uuid1);
console.log("UUIDs 3:", uuid.uuids());

uuid.add(uuid1);
console.log("UUIDs 4:", uuid.uuids());

uuid.clear();
console.log("UUIDs 5:", uuid.uuids());