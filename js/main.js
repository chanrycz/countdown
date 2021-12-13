var songs, eventMessage, events_data, dateParse, dateFormatted, deadline, endmessage, snowing, fireworks, clock_loop, rainbow_loop1, rainbow_loop2, snow_loop, playing, looping, shuffling, bypass_hashchange;
var songIndex = 0;
var song = document.getElementById("player");
bypass_hashchange = playing = looping = shuffling = false;
song.pause();

function generateNum(max) {
	return Math.floor(Math.random() * max);
}

function playPause() {
	if (playing === false) {
		song.play();
		document.getElementById("play-pause").src = "img/pause.png";
		playing = true;
		localStorage.setItem("schoolCountSongNum_" + current_theme, songIndex);
	} else if (playing === true) {
		song.pause();
		document.getElementById("play-pause").src = "img/play.png";
		playing = false;
		localStorage.setItem("schoolCountSongNum_" + current_theme, songIndex);
	}
}

function changeLoop() {
	if (looping === false) {
		song.loop = true;
		document.getElementById("loop").src = "img/loop_1.png";
		looping = true;
		localStorage.setItem("schoolCountLoop", true);
	} else if (looping === true) {
		song.loop = false;
		document.getElementById("loop").src = "img/loop_all.png";
		looping = false;
		localStorage.setItem("schoolCountLoop", false);
	}
}

function changeShuffle() {
	if (shuffling === false) {
		document.getElementById("shuffle").src = "img/shuffle-on.png";
		shuffling = true;
		localStorage.setItem("schoolCountShuffle", true);
	} else if (shuffling === true) {
		document.getElementById("shuffle").src = "img/shuffle-off.png";
		shuffling = false;
		localStorage.setItem("schoolCountShuffle", false);
	}
}

function next() {
	if (shuffling === false) {
		songIndex++;
		if (songIndex > (songs.length - 1)) {
			songIndex = 0;
		}
	} else {
		var randomNumber = generateNum(songs.length);
		if (randomNumber != songIndex) {
			songIndex = randomNumber;
		}
	}
	song.src = songs[songIndex];
	playing = false;
	playPause();
}

function previous() {
	if (shuffling === false) {
		songIndex--;
		if (songIndex < 0) {
			songIndex = (songs.length - 1);
		}
	} else {
		var randomNumber = generateNum(songs.length);
		if (randomNumber != songIndex) {
			songIndex = randomNumber;
		}
	}
	song.src = songs[songIndex];
	playing = false;
	playPause();
}
if (song) {
	song.addEventListener("ended", function() {
		next();
	});
}
var volSlider = document.getElementById("volume");
volSlider.value = 100;
volSlider.addEventListener("input", function() {
	song.volume = (volSlider.value / 100);
	localStorage.setItem("schoolCountVolume", volSlider.value);
}, false);

function refreshIndex() {
	if (localStorage.getItem("schoolCountSongNum_" + current_theme) !== null) {
		if (localStorage.getItem("gkEaster") == "true") {
			songs.push("audio/Gimkit.mp3");
		}
		if (localStorage.getItem("ktEaster") == "true") {
			songs.push("audio/Kahoot.mp3");
		}
		if (parseInt(localStorage.getItem("schoolCountSongNum_" + current_theme)) > songs.length) {
			localStorage.setItem("schoolCountSongNum_" + current_theme, 0);
		}
		songIndex = parseInt(localStorage.getItem("schoolCountSongNum_" + current_theme));
		song.src = songs[songIndex];
	}
}

function change_theme(theme_name) {
	var theme_ajax = new XMLHttpRequest();
	theme_ajax.overrideMimeType("application/json");
	theme_ajax.onreadystatechange = function() {
		try {
			if (theme_ajax.readyState == 4 && theme_ajax.status == 200) {
				current_theme = theme_name;
				localStorage.setItem("schoolCountTheme_" + current_events, theme_name);
				var ajax_data = JSON.parse(theme_ajax.responseText);
				songs = ajax_data.songs;
				song.src = ajax_data.songs[0];
				refreshIndex();
				document.querySelector('meta[name="theme-color"]').setAttribute('content',  ajax_data.css[0][1]);
				for (var css_arr of ajax_data.css) {
					document.documentElement.style.setProperty('--' + css_arr[0], css_arr[1]);
				}
				if (ajax_data.hammer_sickle === true) {
					if (!document.getElementById("hammer-sickle")) {
						document.getElementById("clockdiv").insertAdjacentHTML('beforebegin', '<div id="hammer-sickle"><svg xmlns="http://www.w3.org/2000/svg" width="331pt" height="331pt" viewBox="0 0 331 331"><rect width="331" height="331" fill="#de2910" /><path d="m165.49 15.47c30.28 10.787 58.307 27.796 81.948 49.566 22.675 21.132 41.915 47.019 51.072 76.93 6.2062 19.233 4.9292 40.017 0.82663 59.543-4.0982 18.189-12.101 35.528-23.755 50.119 13.217 12.923 26.307 25.974 39.558 38.863-1.7648 6.603-4.4693 13.351-9.8987 17.802-4.5399 3.9187-10.352 5.8133-16.072 7.2378-12.941-13.445-25.948-26.823-38.896-40.261-16.129 11.019-35.594 16.827-55.031 17.685-24.481 1.0821-48.954-6.8092-68.929-20.826-10.771-7.4027-20.48-16.254-29.387-25.794-1.5255 1.5006-3.1903 2.847-4.9022 4.1295 0.42452 3.2013 0.88448 6.3985 1.3259 9.6005-3.3426 0.19229-6.6797 1.0096-9.4884 2.8931-8.6657 5.4918-14.683 14.017-20.834 22.02-7.6271 9.9016-14.482 20.892-25.111 27.906-6.4414 3.9792-15.973 2.2974-19.918-4.3912-4.1259-6.5622-1.7458-15.032 2.6981-20.789 10.861-15.963 30.253-22.786 42.394-37.492 3.1577-3.9512 5.5457-8.5309 6.7303-13.461 3.101 0.19817 6.2023 0.39974 9.3044 0.60175 2.6274-2.6649 5.2677-5.3163 7.8851-7.9898 2.9183-0.0754 5.8923 0.23651 8.7736-0.32607 3.0076-2.6527 5.4052-5.9141 8.1214-8.8522 2.9751 0.8335 4.6657 3.6241 6.8187 5.617 13.307 12.12 28.525 22.682 45.869 28.068 22.179 7.1054 46.889 4.8481 67.694-5.4908-41.672-42.905-83.205-85.947-124.82-128.91-9.3317 9.8253-18.627 19.688-28.092 29.385-11.559-11.792-23.231-23.473-34.849-35.207 21.898-21.92 44.042-43.594 66.061-65.393 19.037 5.1825 38.049 10.456 57.103 15.577-13.021 11.821-26.257 23.403-39.323 35.173 43.419 42.566 86.622 85.358 130.11 127.86 10.498-12.773 16.407-29.037 17.21-45.504 1.4809-21.788-3.5608-43.463-10.743-63.901-10.152-26.973-29.562-49.179-50.658-68.282-13.185-11.72-26.774-23.002-40.801-33.701z" fill="#ffd600"/></svg></div>');
					}
				} else {
					if (document.getElementById("hammer-sickle")) {
						document.getElementById("hammer-sickle").remove();
					}
				}
				if (ajax_data.rainbow === true) {
					if (!rainbow_loop1) {
						rainbow_loop1 = setInterval(function() {
							document.documentElement.style.setProperty('--rainbow-color', ("#" + Math.floor(Math.random() * 16777215).toString(16)));
						}, 125);
					}
					if (!rainbow_loop2) {
						rainbow_loop2 = setInterval(function() {
							document.documentElement.style.setProperty('--rainbow-color-2', ("#" + Math.floor(Math.random() * 16777215).toString(16)));
						}, 125);
					}
				} else {
					if (rainbow_loop1) {
						clearInterval(rainbow_loop1);
						rainbow_loop1 = null;
					}
					if (rainbow_loop2) {
						clearInterval(rainbow_loop2);
						rainbow_loop2 = null;
					}
				}
			}
		} catch(err) {
			change_theme("default");
			console.log("Error: " + err);
		}
	};
	theme_ajax.onerror = function(){
		change_theme("default");
		console.log("Error: " + theme_ajax.statusText);
	};
	theme_ajax.open("GET", "json/themes/" + theme_name + ".json", true);
	theme_ajax.send();
}

function change_event(events_name) {
	var events_ajax = new XMLHttpRequest();
	events_ajax.overrideMimeType("application/json");
	events_ajax.onreadystatechange = function() {
		try {
			if (events_ajax.readyState == 4 && events_ajax.status == "200") {
				current_events = events_name;
				if (events_name != "default") {
					bypass_hashchange = true;
					window.location.hash = events_name;
				} else {
					bypass_hashchange = true;
					history.pushState("", document.title, window.location.pathname);
				}
				var data = JSON.parse(events_ajax.responseText);
				deadline = new Date(data.countDate).getTime();
				endmessage = data.mainEndMessage;
				snowing = data.snowingMode;
				fireworks = data.endFireworks;
				if (snowing === true) {
					if (!snow_loop) {
						snow_loop = setInterval(function() {
							var snow_flake = document.createElement('i');
							snow_flake.classList.add('fas');
							snow_flake.classList.add('fa-snowflake');
							snow_flake.style.left = Math.random() * window.innerWidth + 'px';
							snow_flake.style.animationDuration = Math.random() * 3 + 2 + 's'; // between 2 - 4 seconds
							snow_flake.style.opacity = Math.random();
							snow_flake.style.fontSize = Math.random() * 10 + 10 + 'px';
							document.body.appendChild(snow_flake);
							setTimeout(function() {
								snow_flake.remove();
							}, 5000);
						}, 150);
					}
				} else {
					if (snow_loop) {
						clearInterval(snow_loop);
						snow_loop = null;
					}
				}
				if (data.otherEvents.length !== 0) {
					eventMessage = data.otherEventsTitle;
					events_data = data.otherEvents;
					for (var config of events_data) {
						if (config.hasOwnProperty("date")) {
							if (config.hasOwnProperty("separator")) {
								dateParse = config.date;
								dateFormatted = new Date(dateParse).toLocaleDateString("en-US", {
									month: 'short',
									day: 'numeric'
								});
								eventMessage += "<br>" + config.name + config.separator + dateFormatted;
							} else {
								dateParse = config.date;
								dateFormatted = new Date(dateParse).toLocaleDateString("en-US", {
									month: 'short',
									day: 'numeric'
								});
								eventMessage += "<br>" + config.name + " &mdash; " + dateFormatted;
							}
						} else {
							if (config.hasOwnProperty("separator")) {
								eventMessage += "<br>" + config.name + config.separator + config.text;
							} else {
								eventMessage += "<br>" + config.name + " &mdash; " + config.text;
							}
						}
					}
				} else {
					eventMessage = data.otherEventsTitle;
					events_data = "";
				}
				var now;
				if (sync_mode) {
					now = ServerDate.now();
				} else {
					now = new Date().getTime();
				}
				var time_diff = deadline - now;
				var days = Math.floor(time_diff / (1000 * 60 * 60 * 24));
				var hours = Math.floor((time_diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				var minutes = Math.floor((time_diff % (1000 * 60 * 60)) / (1000 * 60));
				var seconds = Math.floor((time_diff % (1000 * 60)) / 1000);
				if (days >= 100) {
					document.getElementById("day").innerHTML = days;
				} else {
					document.getElementById("day").innerHTML = ("0" + days).slice(-2);
				}
				document.getElementById("hour").innerHTML = ("0" + hours).slice(-2);
				document.getElementById("minute").innerHTML = ("0" + minutes).slice(-2);
				document.getElementById("second").innerHTML = ("0" + seconds).slice(-2);
				if (time_diff < 0) {
					clearInterval(clock_loop);
					document.getElementById("day").innerHTML = "00";
					document.getElementById("hour").innerHTML = "00";
					document.getElementById("minute").innerHTML = "00";
					document.getElementById("second").innerHTML = "00";
					document.getElementById("day").classList.add("blinking");
					document.getElementById("hour").classList.add("blinking");
					document.getElementById("minute").classList.add("blinking");
					document.getElementById("second").classList.add("blinking");
					document.getElementById("endtext").innerHTML = endmessage;
					if (fireworks === true) {
						if (!document.getElementById("firework-css")) {
							var fireworkCSS = document.createElement("link");
							fireworkCSS.id = "firework-css";
							fireworkCSS.setAttribute("rel", "stylesheet");
							fireworkCSS.setAttribute("href", "css/fireworks.min.css");
							document.getElementsByTagName("head")[0].appendChild(fireworkCSS);
						}
						if (!document.getElementById("pyro")) {
							var pyroDiv = document.createElement("div");
							pyroDiv.classList.add("pyro");
							pyroDiv.id = "pyro";
							document.body.appendChild(pyroDiv);
						}
					} else {
						if (document.getElementById("pyro")) {
							document.getElementById("pyro").remove();
						}
					}
				}
				clock_loop = setInterval(function() {
					if (sync_mode) {
						now = ServerDate.now();
					} else {
						now = new Date().getTime();
					}
					var time_diff = deadline - now;
					var days = Math.floor(time_diff / (1000 * 60 * 60 * 24));
					var hours = Math.floor((time_diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
					var minutes = Math.floor((time_diff % (1000 * 60 * 60)) / (1000 * 60));
					var seconds = Math.floor((time_diff % (1000 * 60)) / 1000);
					if (days >= 100) {
						document.getElementById("day").innerHTML = days;
					} else {
						document.getElementById("day").innerHTML = ("0" + days).slice(-2);
					}
					document.getElementById("hour").innerHTML = ("0" + hours).slice(-2);
					document.getElementById("minute").innerHTML = ("0" + minutes).slice(-2);
					document.getElementById("second").innerHTML = ("0" + seconds).slice(-2);
					if (time_diff < 0) {
						clearInterval(clock_loop);
						document.getElementById("day").innerHTML = "00";
						document.getElementById("hour").innerHTML = "00";
						document.getElementById("minute").innerHTML = "00";
						document.getElementById("second").innerHTML = "00";
						document.getElementById("day").classList.add("blinking");
						document.getElementById("hour").classList.add("blinking");
						document.getElementById("minute").classList.add("blinking");
						document.getElementById("second").classList.add("blinking");
						document.getElementById("endtext").innerHTML = endmessage;
						if (fireworks === true) {
							if (!document.getElementById("firework-css")) {
								var fireworkCSS = document.createElement("link");
								fireworkCSS.id = "firework-css";
								fireworkCSS.setAttribute("rel", "stylesheet");
								fireworkCSS.setAttribute("href", "css/fireworks.min.css");
								document.getElementsByTagName("head")[0].appendChild(fireworkCSS);
							}
							if (!document.getElementById("pyro")) {
								var pyroDiv = document.createElement("div");
								pyroDiv.classList.add("pyro");
								pyroDiv.id = "pyro";
								document.body.appendChild(pyroDiv);
							}
						} else {
							if (document.getElementById("pyro")) {
								document.getElementById("pyro").remove();
							}
						}
					}
				}, 500);
				document.getElementById("title").innerHTML = data.mainEvent;
				document.getElementById("endtext").innerHTML = eventMessage;
			}
		} catch(err) {
			change_theme("default");
			console.log("Error: " + err);
		}
	};
	events_ajax.onerror = function(){
		change_event("default");
		console.log("Error: " + events_ajax.statusText);
	};
	events_ajax.open("GET", "json/events/" + events_name + ".json", true);
	events_ajax.send();
	if (localStorage.getItem("schoolCountTheme_" + events_name) !== null) {
		change_theme(localStorage.getItem("schoolCountTheme_" + events_name));
	} else {
		localStorage.setItem("schoolCountTheme_" + events_name, current_theme);
	}
}
if (localStorage.getItem("schoolCountVolume") !== null) {
	volSlider.value = parseInt(localStorage.getItem("schoolCountVolume"));
	song.volume = (volSlider.value / 100);
}
if (localStorage.getItem("schoolCountLoop") === true) {
	looping = false;
	changeLoop();
}
if (localStorage.getItem("schoolCountShuffle") === true) {
	shuffling = false;
	changeShuffle();
}
if (window.location.hash && window.location.hash != "#") {
	current_events = window.location.hash.substr(1);
}
if (localStorage.getItem("schoolCountTheme_" + current_events) !== null) {
	current_theme = localStorage.getItem("schoolCountTheme_" + current_events);
}
change_event(current_events);
window.addEventListener("hashchange", function() {
	if (!bypass_hashchange && window.location.hash != "#") {
		change_event(window.location.hash.substr(1));
	} else {
		bypass_hashchange = false;
	}
});