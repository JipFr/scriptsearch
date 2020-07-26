
const fs = require("fs");
const subSearch = require("./subSearch");

const store = d => {
	console.log(d);
	fs.writeFileSync(`results/${d.query}.json`, JSON.stringify(d, null, "\t"));
};

subSearch("tt0056751", "Doctor Who").then(store);