
const subSearch = require("./subSearch");

function examples() {
	subSearch("tt7203552", "Not you").then(console.log);                 // The morning show				
	subSearch("tt1839578", "the government has").then(console.log);      // Person of Interest
	subSearch("tt9850952", "English").then(console.log);                 // Medical Police
	subSearch("tt4158110", "oh shit").then(console.log);                 // Mr. Robot
	subSearch("tt3107288", "bitch").then(d => console.log(d.data));      // The Flash
}

examples();