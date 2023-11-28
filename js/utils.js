// Declare global variables
var pattern = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"],
	patternRev = ["a", "b", "ArrowRight", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowDown", "ArrowDown", "ArrowUp", "ArrowUp"],
	current = 0,
	currentRev = 0,
	patternOn = false,
	patternRevOn = false;

// Keydown handler for normal konami
const keyHandler = (event) => {
	if (pattern.indexOf(event.key) < 0 || event.key !== pattern[current]) {
		current = 0;
		return;
	}
	current++;
	if (pattern.length === current && patternOn === false) {
		// Reset the pattern index
		current = 0;
		// Prevent the keydown handler from triggering again
		patternOn = true;

		// Pause the audio
		playing = true;
		playPause();

		// Add the song to the end of song list
		songs.push("audio/Gimkit.mp3");

		// Set index to the last item in song list
		songIndex = songs.length - 1;
		player.src = songs[songIndex];

		// Play the song
		playing = false;
		playPause();

		// Add easter egg bypass to local storage
		localStorage.setItem("gkEaster", true);

		// Add event listener for reverse konami if it isn't already triggered - fixes a bug where you can't do the reverse after doing the normal
		if (patternRevOn === false) {
			document.addEventListener("keydown", keyHandlerRev, false);
		}
	}
};

// Keydown handler for reverse konami
var keyHandlerRev = (event) => {
	// If the first key is not correct, reset the pattern
	if (patternRev.indexOf(event.key) < 0 || event.key !== patternRev[currentRev]) {
		currentRev = 0;
		return;
	}
	// Else, increment the index for next key
	currentRev++;

	// If the pattern is complete and it hasn't been done yet
	if (patternRev.length === currentRev && patternRevOn === false) {
		// Reset the pattern index
		currentRev = 0;
		// Prevent the keydown handler from triggering again
		patternRevOn = true;

		// Pause the audio
		playing = true;
		playPause();

		// Add the song to the end of song list
		songs.push("audio/Kahoot.mp3");

		// Set index to the last item in song list
		songIndex = songs.length - 1;
		player.src = songs[songIndex];

		// Play the song
		playing = false;
		playPause();

		// Add easter egg bypass to local storage
		localStorage.setItem("ktEaster", true);

		// Add event listener for normal konami if it isn't already triggered - fixes a bug where you can't do the normal after doing the reverse
		if (patternOn === false) {
			document.addEventListener("keydown", keyHandler, false);
		}
	}
};

// Add konami and reverse konami code key detection to the page if they haven't been discovered yet
if (localStorage.getItem("gkEaster") !== true) {
	document.addEventListener("keydown", keyHandler, false);
}
if (localStorage.getItem("ktEaster") !== true) {
	document.addEventListener("keydown", keyHandlerRev, false);
}
