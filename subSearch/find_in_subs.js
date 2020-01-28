module.exports = (data, query) => {
	query = query.trim().toLowerCase();
	
	let results = [];

	for(let season in data) {
		for(let episode in data[season]) {
		
			let sub = data[season][episode];

            if(sub) {
                let lines = sub.split("\n\n");
			
    			lines.forEach(line => {
    				
    				line = line.split("\n");
    				let times = line.splice(0, 1)[0];
    				let sentence = line.join(" \n");
    				line = line.join(" ");
    				
    				if(clearup(sentence).includes(clearup(query))) {
    					results.push({
    						line,
    						times,
    						meta: {
    							season: Number(season),
    							episode: Number(episode)
    						}
    					});
    				}

    			});

            }

			
		}
	}

	return {
		data: results,
		query
	}

}

function clearup(str) {
	str = str.toLowerCase();
	let allowed = " abcdefghijklmnopqrstuvwxyz";

	let cleared = "";
	str.split("").forEach(char => {
		if(allowed.includes(char)) {
			cleared += char;
		}
	});
	return cleared;
}