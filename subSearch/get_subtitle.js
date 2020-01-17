
require("dotenv").config();

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

	if(fs.existsSync(path)) {

		let file = fs.readFileSync(path, "utf-8");
		return file;

	} else {
		let results = await OS.search({
			sublanguageid: "eng",
			imdbid: id,
			season,
			episode,
			gzip: false
		});
		let sub_res = await fetch(results.en.vtt);
		let sub = await sub_res.text();

		fs.writeFileSync(path, sub);
		
		return sub;
	}

}

function get_file_name(id, season, episode) {
	return `${id}${season ? `-${season.toString().padStart(2, 0)}-${episode.toString().padStart(2, 0)}` : ""}.txt`;
}