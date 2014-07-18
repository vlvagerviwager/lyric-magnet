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

function generateMagnets() {
	var maxMagnets = $("#max").val();	

	for(var i = 0; i < maxMagnets; i++) {
		// Get the text and append to each magnet
		var words = scrapeLyricsByArtist(maxMagnets);
		
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

// Get and return array of text for magnets
// jsfiddle.net/jalbertbowdenii/zxkax/
function scrapeLyricsByArtist(max) {
	var site = $("#site").val();
	var artist = prepareArtistInput($("#artist").val());

	if(!artist) {
		console.log("Usage: node lyrics_scrape.js [artist]");
		return;
	}

	var baseUrl = site + artist;
	var lyrics = new Array();
	
	$.ajax({
	    url: baseUrl,
		type: "GET",
	    success: function(data) {
	    	console.log(data.responseText);
	        var songs = $("div").html(data)[0].getElementsByTagName("ol")[0].getElementsByTagName("li");
	        if(songs.length > 0) { 
				for(var i = 0; i < songs.length; i++) {
					// var theText = songs[i].firstChild.nodeValue;
					console.log(songs[i]);
				}
	        }
	    },

		error: function(status) {
			console.log("Request error: " + status + " " + url);
		}
	});

	lyrics.push("telethon");	// TODO for testing

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
