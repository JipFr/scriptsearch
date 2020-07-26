
const fs = require("fs");
const subSearch = require("./subSearch");

console.log("Imported modules, creating store");

const store = d => {
	console.log(d);
	fs.writeFileSync(`results/${d.query}.json`, JSON.stringify(d, null, "\t"));
};

console.log("Starting search");
subSearch("tt0056751", "Doctor Who").then(store);
console.log("Started search");