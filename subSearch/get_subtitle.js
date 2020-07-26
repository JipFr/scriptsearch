
require("dotenv").config();
require("colors");

const fetch = require("node-fetch");
const fs = require("fs");

const OpenSubtitles = require("opensubtitles-api");
const OS = new OpenSubtitles({
	useragent: process.env.os_useragent,
	username: process.env.os_username,
	password: process.env.os_password
});

module.exports = async (id, season, episode) => {

	let file_name = get_file_name(id, season, episode);
	let path = `${__dirname}/subs/${file_name}`;

	console.log(`Starting S${season} E${episode} of ${id}`.bold.gray);

	if(fs.existsSync(path)) {

        console.log(`Local S${season} E${episode} of ${id}`.bold.yellow);
		let file = fs.readFileSync(path, "utf-8");
		return file;

	} else {
		console.log(`Fetching S${season} E${episode} of ${id}`.bold.green);
		let results = await OS.search({
			sublanguageid: "eng",
			imdbid: id,
			season,
			episode,
			gzip: false
		});
        
        
        if(results.en && results.en.vtt) {
            let sub_res = await fetch(results.en.vtt);
			let sub = await sub_res.text();
			
			if(!sub.includes("Sorry, maximum download count for IP")) {
				fs.writeFileSync(path, sub);
            	console.log(`Saved S${season} E${episode} of ${id}`.bold.green);
    		
    			return sub;
			} else {
				console.log("Rate limited".bold.red);
				return null;
			}
        } else {
			console.log(JSON.stringify(results, null, "\t".bold.red));
            return null;
        }
		
	}

}

function get_file_name(id, season, episode) {
	return `${id}${season ? `-${season.toString().padStart(2, 0)}-${episode.toString().padStart(2, 0)}` : ""}.txt`;
}