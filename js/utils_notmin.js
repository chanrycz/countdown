var pattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
var patternRev = ['a', 'b', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowDown', 'ArrowUp', 'ArrowUp'];
var current = 0;
var currentRev = 0;
var patternOn = false;
var patternRevOn = false;

var keyHandler = function (event) {
	if (pattern.indexOf(event.key) < 0 || event.key !== pattern[current]) {
		current = 0;
		return;
	}
	current++;
	if (pattern.length === current && patternOn === false) {
		current = 0;
		patternOn = true;
		document.getElementById("player").pause();
		document.getElementById("player").src = "audio/Gimkit.mp3";
		document.getElementById("play-pause").src = "img/pause.png";
		document.getElementById("player").play();
		playing = true;
		songs.push("audio/Gimkit.mp3");
		songIndex = (songs.length - 1);
		localStorage.setItem('schoolCountSongNum', songIndex);
		localStorage.setItem('gkEaster', true);
		if (patternRevOn === false) {
		    document.addEventListener('keydown', keyHandlerRev, false);
		}
	}
};

var keyHandlerRev = function (event) {
	if (patternRev.indexOf(event.key) < 0 || event.key !== patternRev[currentRev]) {
		currentRev = 0;
		return;
	}
	currentRev++;
	if (patternRev.length === currentRev && patternRevOn === false) {
		currentRev = 0;
		patternRevOn = true;
		document.getElementById("player").pause();
		document.getElementById("player").src = "audio/Kahoot.mp3";
		document.getElementById("play-pause").src = "img/pause.png";
		document.getElementById("player").play();
		playing = true;
		songs.push("audio/Kahoot.mp3");
		songIndex = (songs.length - 1);
		localStorage.setItem('schoolCountSongNum', songIndex);
		localStorage.setItem('ktEaster', true);
		if (patternOn === false) {
		    document.addEventListener('keydown', keyHandler, false);
		}
	}
};
if (localStorage.getItem('gkEaster') != 'true') {
    document.addEventListener('keydown', keyHandler, false);
}
if (localStorage.getItem('ktEaster') == 'true') {
    document.addEventListener('keydown', keyHandlerRev, false);
}