	var request = require("request"); // npm install request
	var cheerio = require("cheerio"); // npm install cheerio
	
	var artist = process.argv[2].replace(/ /g,"_");
	var track = process.argv[3] && process.argv[3].replace(/\s+/g, "_");
	
	console.log(artist);

	if(!artist || !track) {
		console.log("Usage: node lyrics_scrape.js [artist] [track]");
		process.exit(1);
	}
	
	var url = "http://lyrics.wikia.com/" + artist + ":" + track;

	console.log(url);

	request(url, function(err, response, html) {
		if(err) return console.error(err);
		var $ = cheerio.load(html);
		$("div.lyricbox > .rtMatcher, div.lyricbox > .lyricsbreak").remove();
		$("div.lyricbox > br").replaceWith("\n");
		var lyrics = $("div.lyricbox").text();
		console.log(lyrics.split("\n"));
		process.exit(0);
	});

	