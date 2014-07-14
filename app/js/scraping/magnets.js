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
	})

	if(words.length > max) {
		// sort randomly and only return the amount of max
	}

	return words;
}

// Get and return array of text for magnets
function scrapeLyricsByArtist(max) {
	var site = $("#site").val();
	var artist = $("#artist").val().replace(/\s+/g, "_");

	// http://mikeygee.com/blog/scrape2.html
	// http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs
	// http://scotch.io/tutorials/javascript/scraping-the-web-with-node-js
	// http://mherman.org/blog/2013/10/20/handling-ajax-calls-with-node-dot-js-and-express-scraping-craigslist/#.U8Q7_LGTKsg
	
	if(!artist) {
		console.log("Usage: node lyrics_scrape.js [artist]");
		return;
	}

	var url = site + artist;
	
	// scrape.js

	var words = new Array();
	words.push("telethon");

	return words;
}


function generateMagnets() {
	var maxMagnets = $("#max").val();	

	for(var i = 0; i < maxMagnets; i++) {
		// Get the text and append to each magnet
		var words = scrapeLyricsByArtist(maxMagnets);	//TODO
		
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
