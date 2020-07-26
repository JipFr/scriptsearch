
const get_subtitles = require("./get_subtitle");
const find_in_subs = require("./find_in_subs");

const fetch = require("node-fetch");
require("colors");
const { JSDOM } = require("jsdom");

async function fetchData(id, season = 1, seasons = {}) {
	console.log(`Getting season data for season ${season} of ${id}`.bold.green);
	let res = await fetch(`https://www.imdb.com/title/${id}/episodes?season=${season}`)
	let d = await res.text();

	const { document } = (new JSDOM(d)).window;

	let season_opts = [...document.querySelectorAll("#bySeason option")].map(opt => Number(opt.value));
	
	if(season_opts.find(item => item === season + 1)) {
		await fetchData(id, season + 1, seasons);
	}

	let ep_links = [...document.querySelectorAll(".info")];
    seasons[season] = ep_links.length;
    console.log("Season", season, "of", id, "has", ep_links.length, "episodes".bold.gray);

	return seasons;

}

async function subSearch(id, query) {
	let seasons = (Object.entries(await fetchData(id))).map(entry => {
		return entry[1] > 1 ? [Number(entry[0]), entry[1]] : null;
	}).filter(Boolean);

	let subs = Object.fromEntries(seasons.map(entry => [entry[0], {}]));

	for(let entry of seasons) {
		let season = entry[0];
		let episodes = entry[1];
		for(let episode = 1; episode <= episodes; episode++) {
			console.log(`Getting S${season} E${episode} of ${id}`.bold.green);
			let sub = await get_subtitles(id, season, episode);
			
			subs[season.toString()][episode] = sub;

		}
	}


	let results = find_in_subs(subs, query);
	return results;

}

module.exports = subSearch;