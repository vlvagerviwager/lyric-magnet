$(function() {
	$( "#magnet" ).draggable();
});

function createMagnet(text) {
	// Create new magnet and set styling
	var newMagnet = document.createElement("p");	
	newMagnet.appendChild(text);
	$(newMagnet).draggable();
	return newMagnet;
}

function generateMagnets() {
	var maxMagnets = $("#max").val();	

	for(var i = 0; i < maxMagnets; i++) {
		// Get the text and append to each magnet
		var words = scrapeSongsByArtist(maxMagnets);
		
		if(typeof words == 'undefined' || words.length < 1 ) {
			console.log("No lyrics found - check artist entered");
			return;
		}

		for(var j = 0; j < words.length; j++) {
			var text = document.createTextNode(words[j]);
			var newMagnet = createMagnet(text);
		}
	
		// Stick magnets to fridge
		$("#fridge").append(newMagnet);
	}
}

// Capitalize each word and remove white spaces from artist input
function prepareArtistInput(artist) {
	var result = artist;
	var words = artist.split(/\s+/);

	if (words.length > 0) {
	 	result = "";
		words.forEach(function(word) {
		    result += word.charAt(0).toUpperCase() + word.slice(1);
			result += " ";
		});
 	}
 	return result.replace(/\s+/g, "_");
}

function getSite() {
	return $("#site").val();
}

function getLyricsPage() {
	var site = getSite();
	var artist = prepareArtistInput($("#artist").val());

	if(!artist) {
		console.log("Usage: node lyrics_scrape.js [artist]");
		return;
	}

	var baseUrl = site + "/" + artist;
}

// Get a list of songs from artist lyric page
// jsfiddle.net/jalbertbowdenii/zxkax/
function scrapeSongsByArtist(max) {

	var baseUrl = getLyricsPage();
	var songs = new Array();
	
	$.ajax({
	    url: baseUrl,
		type: "GET",
	    success: function(data) {

            // load the response into jquery element
            // form tags are needed to get the entire html, head, and body
            $foop = $('<form>' + data.responseText + '</form>');
            //console.log(data.responseText);

            // find links
            $.each($foop.find('a[href]'), function(idx, item) {
                lnk = $(item).attr("href");
                console.log(lnk);
                // TODO DO SOME FILTERING HERE BEFORE PUSHING - ONLY PUSH SONGS
                songs.push(lnk);
            });

			scrapeLyricsFromSongs(songs, max);
	    },

		error: function(status) {
			console.log("Request error: " + status + " " + url);
		}
	});

	songs.push("telethon");	// TODO for testing

	return songs;
}

// Get rid of duplicates, sort randomly (if more than max), and only return max number of words
function pruneWords(words, max) {
	words = words.filter(function(elem, index, self) {
    	return index == self.indexOf(elem);
	});

	if(words.length > max) {
		// sort randomly and only return the amount of max
	}

	return words;
}

// Get a list of words from the lyrics of all songs by an artist
function scrapeLyricsFromSongs(songUrls, max) {

	var words = new Array();
	
	for(var i = 0; i < songs.length; i++) {
		var songUrl = getSite() + songUrls[i];
		words.push(scrapeLyricsFromSong(songUrl));
	}

	return pruneWords(words, max);
}

// TODO Get a list of words from a song lyric page
function scrapeLyricsFromSong(songUrl) {

	var lyrics = new Array();
	
	$.ajax({
	    url: songUrl,
		type: "GET",
	    success: function(data) {

            // load the response into jquery element
            // form tags are needed to get the entire html, head, and body
            $foop = $('<form>' + data.responseText + '</form>');
            //console.log(data.responseText);

            // grab all lyrics, push each word
            $.each($foop.find('a[href]'), function(idx, item) {
                lnk = $(item).attr("href");
                console.log(lnk);
                lyrics.push("");
            });
	    },

		error: function(status) {
			console.log("Request error: " + status + " " + url);
		}
	});

	return lyrics;
}

function exportFridge() {
	html2canvas($("#fridge"), {
		onrendered: function(canvas) {
		theCanvas = canvas;
			document.body.appendChild(canvas);
			// Convert and download as image 
			Canvas2Image.saveAsPNG(canvas); 
			$("#export").append(canvas);
		
			// Clean up 
			document.body.removeChild(canvas);
		}
	});		
}
