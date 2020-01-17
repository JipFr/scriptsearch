
const get_subtitles = require("./get_subtitle");
const find_in_subs = require("./find_in_subs");

const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");

async function fetchData(id, season = 1, seasons = {}) {
	let res = await fetch(`https://www.imdb.com/title/${id}/episodes?season=${season}`)
	let d = await res.text();

	const { document } = (new JSDOM(d)).window;

	let season_opts = [...document.querySelectorAll("#bySeason option")].map(opt => Number(opt.value));
	
	if(season_opts.find(item => item === season + 1)) {
		await fetchData(id, season + 1, seasons);
	}

	let ep_links = [...document.querySelectorAll(".info")];
	seasons[season] = ep_links.length;

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
			let sub = await get_subtitles(id, season, episode);
			
			subs[season.toString()][episode] = sub;

		}
	}


	let results = find_in_subs(subs, query);
	return results;

}

subSearch("tt7203552", "Not you").then(console.log);            // The morning show				
subSearch("tt1839578", "the government has").then(console.log); // Person of Interest
subSearch("tt9850952", "English").then(console.log);            // Medical Police