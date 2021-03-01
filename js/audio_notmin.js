function generateNum(max) {
  return Math.floor(Math.random() * max);
}

const song = document.getElementById("player");
var songIndex = 0;
var playing = false;
var looping = false;
var shuffling = false;
song.pause();
function playPause() {
  if (playing == false) {
    song.play();
    document.getElementById("play-pause").src = "img/pause.png";
    playing = true;
    localStorage.setItem('schoolCountSongNum', songIndex);
  } else if (playing == true) {
    song.pause();
    document.getElementById("play-pause").src = "img/play.png";
    playing = false;
    localStorage.setItem('schoolCountSongNum', songIndex);
  }
}
function changeLoop() {
  if (looping == false) {
    song.loop = true;
    document.getElementById("loop").src = "img/loop_1.png";
    looping = true;
    localStorage.setItem('schoolCountLoop', true);
  } else if (looping == true) {
    song.loop = false;
    document.getElementById("loop").src = "img/loop_all.png";
    looping = false;
    localStorage.setItem('schoolCountLoop', false);
  }
}
function changeShuffle() {
  if (shuffling == false) {
    document.getElementById("shuffle").src = "img/shuffle-on.png";
    shuffling = true;
    localStorage.setItem('schoolCountShuffle', true);
  } else if (shuffling == true) {
    document.getElementById("shuffle").src = "img/shuffle-off.png";
    shuffling = false;
    localStorage.setItem('schoolCountShuffle', false);
  }
}
function next() {
  if (shuffling == false) {
    songIndex++;
    if (songIndex > (songs.length - 1)) {
      songIndex = 0;
    }
  } else {
    randomNumber = generateNum(songs.length);
    if (randomNumber != songIndex) {
      songIndex = randomNumber;
    }
  }
  song.src = songs[songIndex];
  playing = false;
  playPause();
}
function previous() {
  if (shuffling == false) {
    songIndex--;
    if (songIndex < 0) {
      songIndex = (songs.length - 1);
    }
  } else {
    randomNumber = generateNum(songs.length);
    if (randomNumber != songIndex) {
      songIndex = randomNumber;
    }
  }
  song.src = songs[songIndex];
  playing = false;
  playPause();
}
if (song) {
  song.addEventListener('ended', function () {
    next();
  });
}
var volSlider = document.getElementById("volume");
volSlider.value = 100;
volSlider.addEventListener("input", function () {
  song.volume = (volSlider.value / 100);
  localStorage.setItem('schoolCountVolume', volSlider.value);
}, false);
window.onload = function () {
  if (localStorage.getItem('schoolCountVolume') != null) {
    volSlider.value = parseInt(localStorage.getItem('schoolCountVolume'));
    song.volume = (volSlider.value / 100);
  }
  if (localStorage.getItem('schoolCountLoop') == 'true') {
    looping = false;
    changeLoop();
  }
  if (localStorage.getItem('schoolCountShuffle') == 'true') {
    shuffling = false;
    changeShuffle();
  }
  if (localStorage.getItem('schoolCountSongNum') != null) {
    if (localStorage.getItem('gkEaster') == 'true') {
        songs.push("audio/Gimkit.mp3");
    }
    if (localStorage.getItem('ktEaster') == 'true') {
        songs.push("audio/Kahoot.mp3");
    }
    if (parseInt(localStorage.getItem("schoolCountSongNum")) > songs.length) {
        localStorage.setItem('schoolCountSongNum', 0);
    }
    songIndex = parseInt(localStorage.getItem('schoolCountSongNum'));
    song.src = songs[songIndex];
  }
};