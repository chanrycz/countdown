var songs,
	currentTheme,
	currentEvents,
	rainbowLoop1,
	rainbowLoop2,
	config,
	snowLoop,
	now,
	deadline,
	clockLoop,
	otherItemsMessage,
	songIndex = 0,
	bypassHashChange = false,
	playing = false,
	looping = false,
	shuffling = false,
	currentEventIndex = 0,
	currentDateIndex = 0,
	serverDateOffset = 0,
	serverDateUncertainty = 0;

const player = document.getElementById("player");

// Pause player to prevent auto-play on page load
player.pause();

const errorMsg = (errorType, error) => {
	/*
		Displays an error message
		INPUT:	errorType (string) - the type of error
				error (string) - the error message
	*/

	console.error("%c%s Error", "font-weight:bold;text-decoration:underline;font-size:25px;", errorType);
	console.error("%c%s", "font-size:15px;", error);
};

const generateNum = (max) => {
	/*
		Generates a random number between 0 and max
		INPUT: max - the maximum number in range
	*/

	return Math.floor(Math.random() * max);
};

const playPause = () => {
	/*
		Plays or pauses the audio
	*/

	// Toggle playing status and image icons
	if (playing === false) {
		player.play();
		document.getElementById("play-pause").src = "img/pause.png";
		playing = true;
		localStorage.setItem("schoolCountSongNum_" + currentTheme, songIndex);
	} else if (playing === true) {
		player.pause();
		document.getElementById("play-pause").src = "img/play.png";
		playing = false;
		localStorage.setItem("schoolCountSongNum_" + currentTheme, songIndex);
	}
};

const changeLoop = () => {
	/*
		Changes the looping status of the audio
	*/

	// Toggle looping status and image icons
	if (looping === false) {
		player.loop = true;
		document.getElementById("loop").src = "img/loop_1.png";
		looping = true;
		localStorage.setItem("schoolCountLoop", true);
	} else if (looping === true) {
		player.loop = false;
		document.getElementById("loop").src = "img/loop_all.png";
		looping = false;
		localStorage.setItem("schoolCountLoop", false);
	}
};

const changeShuffle = () => {
	/*
		Changes the shuffling status of the audio
	*/

	// Toggle shuffling status and image icons
	if (shuffling === false) {
		document.getElementById("shuffle").src = "img/shuffle-on.png";
		shuffling = true;
		localStorage.setItem("schoolCountShuffle", true);
	} else if (shuffling === true) {
		document.getElementById("shuffle").src = "img/shuffle-off.png";
		shuffling = false;
		localStorage.setItem("schoolCountShuffle", false);
	}
};

const next = () => {
	/*
		Plays the next song in the playlist, loops after song array overflow unless shuffling is on
	*/

	// If shuffling is enabled, generate a random number between 0 and the song array length for new song index
	if (shuffling === false) {
		songIndex++;
		if (songIndex > songs.length - 1) {
			songIndex = 0;
		}
	} else {
		var randomNumber = generateNum(songs.length);
		if (randomNumber != songIndex) {
			songIndex = randomNumber;
		}
	}
	player.src = songs[songIndex];
	playing = false;
	playPause();
};

const previous = () => {
	/*
		Plays the previous song in the playlist, loops after song array underflow unless shuffling is on
	*/

	// If shuffling is enabled, generate a random number between 0 and the song array length for new song index
	if (shuffling === false) {
		songIndex--;
		if (songIndex < 0) {
			songIndex = songs.length - 1;
		}
	} else {
		var randomNumber = generateNum(songs.length);
		if (randomNumber != songIndex) {
			songIndex = randomNumber;
		}
	}
	player.src = songs[songIndex];
	playing = false;
	playPause();
};

// Auto switch next song
if (player) {
	player.addEventListener("ended", () => {
		next();
	});
}

// Add volume slider input detection
var volSlider = document.getElementById("volume");
volSlider.value = 100;
volSlider.addEventListener("input", () => {
	player.volume = volSlider.value / 100;
	localStorage.setItem("schoolCountVolume", volSlider.value);
});

const refreshIndex = () => {
	/*
		Refreshes the song index, changes audio source and adds easter egg songs when changing theme
	*/

	// Check if song index is stored in localStorage
	if (localStorage.getItem("schoolCountSongNum_" + currentTheme) !== null) {
		// Append easter egg songs if enabled in localStorage
		if (localStorage.getItem("gkEaster") === true && !songs.includes("audio/Gimkit.mp3")) {
			songs.push("audio/Gimkit.mp3");
		}
		if (localStorage.getItem("ktEaster") === true && !songs.includes("audio/Kahoot.mp3")) {
			songs.push("audio/Kahoot.mp3");
		}

		// If song index is stored in localStorage, set song index and audio source to stored value
		if (parseInt(localStorage.getItem("schoolCountSongNum_" + currentTheme)) > songs.length) {
			localStorage.setItem("schoolCountSongNum_" + currentTheme, 0);
		}
		songIndex = parseInt(localStorage.getItem("schoolCountSongNum_" + currentTheme));
		player.src = songs[songIndex];
	}
};

const changeTheme = (themeName, bypassChange) => {
	/*
		Changes the theme of the website
		INPUT: themeName - the name of the theme to change to
	*/

	if (currentTheme != themeName || bypassChange === true) {
		// Pause the audio before changing theme
		playing = true;
		playPause();

		// Fetch theme json config
		fetch(`json/themes/${themeName}.json`, { cache: "no-store" })
			.then((response) => response.json())
			.then((ajaxData) => {
				try {
					// Updates current theme and localStorage value
					currentTheme = themeName;
					localStorage.setItem("schoolCountTheme_" + currentEvents, themeName);

					// Update and refresh song array and audio source
					songs = ajaxData.songs;
					player.src = ajaxData.songs[0];
					refreshIndex();

					// Update and refresh theme colors for the website
					document.querySelector('meta[name="theme-color"]').setAttribute("content", ajaxData.css[0][1]);

					// Update root css variables
					for (var cssArr of ajaxData.css) {
						document.documentElement.style.setProperty("--" + cssArr[0], cssArr[1]);
					}

					// Check for communist theme - hammer and sickle decoration
					if (ajaxData.hammer_sickle === true) {
						if (!document.getElementById("hammer-sickle")) {
							document
								.getElementById("clockdiv")
								.insertAdjacentHTML(
									"beforebegin",
									'<div id="hammer-sickle"><svg xmlns="http://www.w3.org/2000/svg" width="331pt" height="331pt" viewBox="0 0 331 331"><rect width="331" height="331" fill="#de2910" /><path d="m165.49 15.47c30.28 10.787 58.307 27.796 81.948 49.566 22.675 21.132 41.915 47.019 51.072 76.93 6.2062 19.233 4.9292 40.017 0.82663 59.543-4.0982 18.189-12.101 35.528-23.755 50.119 13.217 12.923 26.307 25.974 39.558 38.863-1.7648 6.603-4.4693 13.351-9.8987 17.802-4.5399 3.9187-10.352 5.8133-16.072 7.2378-12.941-13.445-25.948-26.823-38.896-40.261-16.129 11.019-35.594 16.827-55.031 17.685-24.481 1.0821-48.954-6.8092-68.929-20.826-10.771-7.4027-20.48-16.254-29.387-25.794-1.5255 1.5006-3.1903 2.847-4.9022 4.1295 0.42452 3.2013 0.88448 6.3985 1.3259 9.6005-3.3426 0.19229-6.6797 1.0096-9.4884 2.8931-8.6657 5.4918-14.683 14.017-20.834 22.02-7.6271 9.9016-14.482 20.892-25.111 27.906-6.4414 3.9792-15.973 2.2974-19.918-4.3912-4.1259-6.5622-1.7458-15.032 2.6981-20.789 10.861-15.963 30.253-22.786 42.394-37.492 3.1577-3.9512 5.5457-8.5309 6.7303-13.461 3.101 0.19817 6.2023 0.39974 9.3044 0.60175 2.6274-2.6649 5.2677-5.3163 7.8851-7.9898 2.9183-0.0754 5.8923 0.23651 8.7736-0.32607 3.0076-2.6527 5.4052-5.9141 8.1214-8.8522 2.9751 0.8335 4.6657 3.6241 6.8187 5.617 13.307 12.12 28.525 22.682 45.869 28.068 22.179 7.1054 46.889 4.8481 67.694-5.4908-41.672-42.905-83.205-85.947-124.82-128.91-9.3317 9.8253-18.627 19.688-28.092 29.385-11.559-11.792-23.231-23.473-34.849-35.207 21.898-21.92 44.042-43.594 66.061-65.393 19.037 5.1825 38.049 10.456 57.103 15.577-13.021 11.821-26.257 23.403-39.323 35.173 43.419 42.566 86.622 85.358 130.11 127.86 10.498-12.773 16.407-29.037 17.21-45.504 1.4809-21.788-3.5608-43.463-10.743-63.901-10.152-26.973-29.562-49.179-50.658-68.282-13.185-11.72-26.774-23.002-40.801-33.701z" fill="#ffd600"/></svg></div>'
								);
						}
					} else {
						if (document.getElementById("hammer-sickle")) {
							document.getElementById("hammer-sickle").remove();
						}
					}

					// Check for rainbow theme - random changing color loop
					if (ajaxData.rainbow === true) {
						if (!rainbowLoop1) {
							rainbowLoop1 = setInterval(() => {
								document.documentElement.style.setProperty("--rainbow-color", "#" + Math.floor(Math.random() * 16777215).toString(16));
							}, 1);
						}
						if (!rainbowLoop2) {
							rainbowLoop2 = setInterval(() => {
								document.documentElement.style.setProperty("--rainbow-color-2", "#" + Math.floor(Math.random() * 16777215).toString(16));
							}, 1);
						}
					} else {
						if (rainbowLoop1) {
							clearInterval(rainbowLoop1);
							rainbowLoop1 = null;
						}
						if (rainbowLoop2) {
							clearInterval(rainbowLoop2);
							rainbowLoop2 = null;
						}
					}
				} catch (error) {
					// Default to default theme if an error occurs
					changeTheme("default", bypassChange);
					errorMsg("Theme", error);
				}
			})
			.catch((error) => {
				// Default to default theme if an error occurs
				changeTheme("default", bypassChange);
				errorMsg("Theme", error);
			});
	}
};

const eventCountdownReset = () => {
	/*
		Function called when countdown (re)starts
		Removes blinking effect, add snow effect (if enabled) and remove firework element (if exists)
		Changes title to event, changes deadline
	*/

	// Update countdown deadline
	deadline = new Date(config.mainEvents[currentEventIndex].dates[currentDateIndex]);

	// Clear blinking effect if exists
	if (document.getElementById("day").classList.contains("blinking")) {
		document.getElementById("day").classList.remove("blinking");
		document.getElementById("hour").classList.remove("blinking");
		document.getElementById("minute").classList.remove("blinking");
		document.getElementById("second").classList.remove("blinking");
	}

	// Add snow effect (if enabled)
	if (config.mainEvents[currentEventIndex].snowingMode === true) {
		if (!snowLoop) {
			snowLoop = setInterval(() => {
				var snowFlake = document.createElement("i");
				snowFlake.classList.add("fas");
				snowFlake.classList.add("fa-snowflake");
				snowFlake.style.left = Math.random() * window.innerWidth + "px";
				snowFlake.style.animationDuration = Math.random() * 3 + 2 + "s";
				snowFlake.style.opacity = Math.random();
				snowFlake.style.fontSize = Math.random() * 10 + 10 + "px";
				document.body.appendChild(snowFlake);
				setTimeout(() => {
					snowFlake.remove();
				}, 5000);
			}, 150);
		}
	} else {
		if (snowLoop) {
			clearInterval(snowLoop);
			snowLoop = null;
		}
	}

	// Delete firework element (if exists)
	if (document.getElementById("pyro")) {
		document.getElementById("pyro").remove();
	}

	// Update event title and other items message
	document.getElementById("endtext").innerHTML = otherItemsMessage;
	document.getElementById("title").innerHTML = config.mainEvents[currentEventIndex].title;

	// Start countdown loop
	eventCountdownLoop();
	clockLoop = setInterval(eventCountdownLoop, 500);
};

const eventCountdownLoop = () => {
	/*
		Updates countdown timer with new duration. When countdown reaches 0, loop is cleared and eventCountdownEnd is called
	*/

	// If server-sync mode is enabled, use the server's time, otherwise use the client's time
	now = new Date(Date.now() + serverDateOffset);

	// Calculate time difference between now and deadline into days, hours, minutes and seconds

	// If event is not fullDay
	if (!config.mainEvents[currentEventIndex].fullDay) {
		var timeDiff = deadline.getTime() - now.getTime();
	} else {
		// If event is fullDay
		var timeDiff = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate(), 0, 0, 0).getTime() - now.getTime();
	}

	var days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
	var hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

	// Update html for each countdown time element
	document.getElementById("day").innerHTML = days.toString().padStart(2, "0");
	document.getElementById("hour").innerHTML = hours.toString().padStart(2, "0");
	document.getElementById("minute").innerHTML = minutes.toString().padStart(2, "0");
	document.getElementById("second").innerHTML = seconds.toString().padStart(2, "0");

	// Check if countdown has reached 0
	if (timeDiff < 0) {
		// Clear countdown loop
		var tmpLoop = setInterval(() => {
			if (clockLoop) {
				clearInterval(clockLoop);
				clockLoop = null;
				clearInterval(tmpLoop);
				tmpLoop = null;
			}
		}, 500);

		// Sets countdown to 0, enable blinking, and dispaly end text
		document.getElementById("day").innerHTML = "00";
		document.getElementById("hour").innerHTML = "00";
		document.getElementById("minute").innerHTML = "00";
		document.getElementById("second").innerHTML = "00";
		document.getElementById("day").classList.add("blinking");
		document.getElementById("hour").classList.add("blinking");
		document.getElementById("minute").classList.add("blinking");
		document.getElementById("second").classList.add("blinking");
		document.getElementById("endtext").innerHTML = config.mainEvents[currentEventIndex].endMessage;

		// Add firework effect (if enabled)
		if (config.mainEvents[currentEventIndex].endFireworks === true) {
			// Add firework css (if it doesn't exist)
			if (!document.getElementById("firework-css")) {
				var fireworkCSS = document.createElement("link");
				fireworkCSS.id = "firework-css";
				fireworkCSS.setAttribute("rel", "stylesheet");
				fireworkCSS.setAttribute("href", "css/fireworks.min.css");
				document.getElementsByTagName("head")[0].appendChild(fireworkCSS);
			}
			// Add firework element (if it doesn't exist)
			if (!document.getElementById("pyro")) {
				var pyroDiv = document.createElement("div");
				pyroDiv.classList.add("pyro");
				pyroDiv.id = "pyro";
				document.body.appendChild(pyroDiv);
			}
		}

		// If event is fullDay
		if (config.mainEvents[currentEventIndex].fullDay) {
			// Set deadline to the next day 00:00:00
			deadline = deadline.setDate(deadline.getDate() + 1);
			// Loop to check if the day has changed
			var dayCheckLoop = setInterval(() => {
				// Get current date
				now = new Date(Date.now() + serverDateOffset);
				// Compare current date to deadline
				if (now > deadline) {
					// Clear the loop
					clearInterval(dayCheckLoop);
					dayCheckLoop = null;
					// Reset the event
					eventCountdownReset();
				}
			}, 500);
		} else {
			// Set a 10 second delay before resetting countdown
			setTimeout(() => {
				if (currentDateIndex < config.mainEvents[currentEventIndex].dates.length - 1) {
					// If there are more dates in the event, go to the next date
					currentDateIndex++;
					eventCountdownReset();
				} else if (currentDateIndex === config.mainEvents[currentEventIndex].dates.length - 1 && currentEventIndex < config.mainEvents.length - 1) {
					// If there are no more dates, but there are more events, go to the next event
					currentDateIndex = 0;
					currentEventIndex++;
					eventCountdownReset();
				} else {
					// If there are no more dates and events, do nothing
				}
			}, 10000);
		}
	}
};

const changeEvent = (eventsName, bypassChange = false) => {
	/*
		Changes the event for the website
		INPUT: eventsName - id for the event to change to
	*/

	if (currentEvents != eventsName || bypassChange === true) {
		// Pause the audio before changing event
		playing = true;
		playPause();

		// Fetch event json config
		fetch(`json/events/${eventsName}.json`, { cache: "no-store" })
			.then((response) => response.json())
			.then((ajaxData) => {
				try {
					// Upate currentEvent and hash
					currentEvents = eventsName;
					if (currentEvents != "default") {
						bypassHashChange = true;
						location.hash = currentEvents;
						bypassHashChange = false;
					} else {
						bypassHashChange = true;
						history.pushState("", document.title, location.pathname);
						bypassHashChange = false;
					}

					// Update global config variable
					config = ajaxData;

					// Obtain the event index and date index for the date string of the next upcoming event
					var eventIndexFound = false,
						dateIndexFound = false;
					config.mainEvents.forEach((event, eventIndex) => {
						if (eventIndexFound === true) {
							return;
						}

						currentEventIndex = eventIndex;

						event.dates.forEach((date, dateIndex) => {
							if (dateIndexFound === true) {
								return;
							}

							if (event.fullDay === true) {
								// If current time is less than date + 1 day at 00:00:00
								tmp = new Date(date);
								tmp = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate() + 1, 0, 0, 0);
								if (new Date() < tmp) {
									eventIndexFound = true;
									dateIndexFound = true;
								}
							} else {
								if (new Date(date) > new Date()) {
									eventIndexFound = true;
									dateIndexFound = true;
								}
							}

							currentDateIndex = dateIndex;
						});
					});

					// Combine the other items title and description into one string for html injection
					otherItemsMessage = config.otherItemsTitle;
					if (config.otherItemsDescription.length > 0) {
						var lang = config.lang;
						for (var event of config.otherItemsDescription) {
							if (event.hasOwnProperty("date")) {
								let dateParse = event.date,
									dateFormatted = new Date(dateParse).toLocaleDateString(lang, {
										month: "short",
										day: "numeric",
									});
								otherItemsMessage += "<br>" + event.name + event.separator + dateFormatted;
							} else {
								otherItemsMessage += "<br>" + event.name + event.separator + event.text;
							}
						}
					}

					// Clears countdown loop if it exists
					clearInterval(clockLoop);
					clockLoop = null;

					// Reset the event countdown
					eventCountdownReset();

					// Update the theme if value is saved in localStorage, else it sets it to currentTheme
					if (localStorage.getItem("schoolCountTheme_" + currentEvents) !== null) {
						changeTheme(localStorage.getItem("schoolCountTheme_" + currentEvents), bypassChange);
					} else {
						localStorage.setItem("schoolCountTheme_" + currentEvents, currentTheme);
					}
				} catch (error) {
					// Default to default event if an error occurs
					changeEvent("default");
					errorMsg("Event", error);
				}
			})
			.catch((error) => {
				// Default to default event if an error occurs
				changeEvent("default");
				errorMsg("Event", error);
			});
	}
};

// Update volume if value is saved in localStorage
if (localStorage.getItem("schoolCountVolume") !== null) {
	volSlider.value = parseInt(localStorage.getItem("schoolCountVolume"));
	player.volume = volSlider.value / 100;
}

// Update loop status if value is saved in localStorage
if (localStorage.getItem("schoolCountLoop") === true) {
	looping = false;
	changeLoop();
}

// Update shuffle status if value is saved in localStorage
if (localStorage.getItem("schoolCountShuffle") === true) {
	shuffling = false;
	changeShuffle();
}

// Update event if value is saved in localStorage
if (location.hash.length > 1) {
	currentEvents = location.hash.slice(1);
}

// Update theme if value is saved in localStorage
if (localStorage.getItem("schoolCountTheme_" + currentEvents) !== null) {
	currentTheme = localStorage.getItem("schoolCountTheme_" + currentEvents);
}

// Change the theme/event at page load
if (currentEvents === null) {
	changeTheme(currentTheme, true);
} else {
	changeEvent(currentEvents, true);
}

// Detection for hash change to update the theme
window.addEventListener("hashchange", () => {
	// Check if bypassHashChange is true or if hash is empty, if eitehr is true, don't change the theme
	if (bypassHashChange === false && location.hash.length > 1) {
		changeEvent(location.hash.slice(1));
	} else {
		bypassHashChange = false;
	}
});

// If server-sync mode, fetch server date then add a loop to fetch server date every 10 minutes
if (syncMode === true) {
	const setServerDate = async () => {
		const result = await getServerDate();
		serverDateOffset = result.offset;
		serverDateUncertainty = result.uncertainty;
		console.log(`The client date is off by ${serverDateOffset} ms +/- ${serverDateUncertainty} ms.`);
	};

	setServerDate();
	setInterval(setServerDate, 600000);
}
