// Getting elements from the DOM
const displayShows = document.getElementById("shows-page-wrapper");
const displayEpisodes = document.getElementById("episodes-page-wrapper");
const rootShows = document.getElementById("root-shows");
const rootEpisodes = document.getElementById("root-episodes");
const searchBar = document.querySelector(".search-bar");
const searchForEpisodes = document.querySelector(".episodes-search-bar");
const parentDiv = document.getElementsByTagName("div");
let showID, episodeNameEvent;

//Variables to store data and minimize api calls
let shows, episodes;

//Getting shows from API and passing it as a parameter
const loadShows = async () => {
	try {
		const response = await fetch("https://api.tvmaze.com/shows");
		shows = await response.json();
		populateShowsPage(shows);
		showSearch(shows);
		createCustomSelect();
	} catch (err) {
		console.error(err);
	}
};

// A function to extract shows and populate the webpage.
function populateShowsPage(arr) {
	arr.forEach((show) => {
		//Creating elements
		let showWrapper = document.createElement("div");
		showWrapper.setAttribute("class", "show-wrapper");
		rootShows.appendChild(showWrapper);
		if (arr.length === 1) {
			rootShows.style.display = "block";
			rootShows.style.width = "70%";
		} else {
			rootShows.style.display = "grid";
			rootShows.style.width = "90%";
		}
		showName = document.createElement("h3");
		showName.setAttribute("class", "name");
		showWrapper.appendChild(showName);
		showName.innerHTML = show.name;
		let aTag = document.createElement("a");
		aTag.setAttribute("href", "#");
		aTag.setAttribute("id", `${show.id}`);
		showName.append(aTag);

		//An event listener to link names of shows to their episodes pages
		showName.addEventListener("click", () => {
			showID = aTag.id;
			loadEpisodes();
			displayEpisodes.style.display = "block";
			searchForEpisodes.style.display = "block";
			navLink.style.display = "block";
			document.getElementById("show-episodes").innerHTML = show.name;
			document.getElementById("show-name").innerHTML = show.name;
			searchForEpisodes.placeholder = `${show.name}'s episodes`;
			displayShows.style.display = "none";
		});

		img = document.createElement("img");
		img.src = show.image.medium;
		showWrapper.appendChild(img);

		//Genres, Status, Rating and Runtime
		let genres = document.createElement("h4");
		genres.setAttribute("class", "genres");
		let status = document.createElement("h4");
		status.className = "status";
		let rating = document.createElement("h4");
		rating.className = "rating";
		rating.innerText = `Rating: ${show.rating.average}    `;
		let runtime = document.createElement("h4");
		runtime.className = "runtime";
		runtime.innerText = `Runtime: ${show.runtime}`;
		let showInfo = document.createElement("section");
		showInfo.className = "show-info";
		showWrapper.appendChild(showInfo);

		showInfo.appendChild(genres);
		showInfo.appendChild(status);
		showInfo.appendChild(rating);
		showInfo.appendChild(runtime);

		// Giving a bit of space between words and after commas
		let corrected = show.genres.toString().split(",").join(", ");
		genres.innerHTML = `Genres: ${corrected}`;
		status.innerHTML = `Status: ${show.status}`;
		genres.style.wordSpacing = "5px";
		status.style.wordSpacing = "5px";
		rating.style.wordSpacing = "5px";
		runtime.style.wordSpacing = "5px";

		let emptyDiv = document.createElement("div");
		emptyDiv.className = "empty-div";
		showWrapper.appendChild(emptyDiv);

		//Truncated summary text
		const truncatedText = show.summary.split(" ").slice(0, 25).join(" ");
		paragraph = document.createElement("p");
		paragraph.setAttribute("class", "summary");
		paragraph.innerHTML = `${truncatedText} ...`;
		let p2 = document.createElement("p");
		p2.setAttribute("class", "more-text summary");
		p2.innerHTML = show.summary;

		//Read more button
		let readMore = document.createElement("button");
		readMore.setAttribute("class", "read-more");
		readMore.innerHTML = `Read more`;
		showWrapper.append(paragraph);
		paragraph.appendChild(readMore);

		//Read less button
		let readLess = document.createElement("button");
		readLess.innerHTML = `Read less`;
		readLess.setAttribute("class", "read-less");

		//A condition in which read more button won't be necessary
		if (show.summary.length <= truncatedText.length) {
			paragraph.innerHTML = truncatedText;
			readMore.style.display = "none";
		}

		//An event listener to expand the summary text
		readMore.addEventListener("click", (e) => {
			showWrapper.removeChild(showWrapper.lastChild);
			showWrapper.appendChild(p2);
			p2.classList.toggle("more-text");
			p2.appendChild(readLess);
			let parentContainer = document.querySelectorAll(".show-wrapper");
			for (let i = 0; i < parentContainer.length; i++) {
				let isIdentified = Array.from(
					parentContainer[i].children[4].lastChild.classList
				).includes("read-less");
				if (isIdentified) {
					console.log(parentContainer[i]);
					parentContainer[i].style.height = "100%";
				} else {
					parentContainer[i].style.height = "fit-content";
				}
			}
		});

		//An event listener to collapse the summary text
		readLess.addEventListener("click", () => {
			showWrapper.removeChild(showWrapper.lastChild);
			let paragraph = document.createElement("p");
			showWrapper.append(paragraph);
			paragraph.setAttribute("class", "summary");
			paragraph.innerHTML = `${truncatedText}...`;
			paragraph.appendChild(readMore);
			p2.classList.toggle("more-text");
			let parentContainer = document.querySelectorAll(".show-wrapper");
			for (let i = 0; i < parentContainer.length; i++) {
				parentContainer[i].style.height = "100%";
			}
		});

		//Select a show options
		let selectShows = document.querySelector("#shows");
		let options = document.createElement("option");
		options.setAttribute("id", `${show.id}`);
		options.setAttribute("class", "show-options");
		options.innerText = show.name;
		selectShows.appendChild(options);
	});
}

//Async function to fetch episodes' shows
const loadEpisodes = async () => {
	try {
		const response = fetch(
			"https://api.tvmaze.com/shows/" + showID + "/episodes"
		);
		episodes = await (await response).json();
		populateEpisodesPage(episodes);
		createCustomSelectEpisode();
		episodeSearch(episodes);
	} catch (err) {
		console.error(err);
	}
};

const searchInfo = document.querySelector(".search-info");
const searchInfo2 = document.querySelector(".search-info2");

// An event listener wrapped inside a function to dynamically update the web page while a user is typing in the search bar.
function showSearch() {
	searchBar.addEventListener("keyup", (e) => {
		e.preventDefault();
		// Revealing the hidden information lines
		searchInfo.style.display = "block";
		searchInfo2.style.display = "block";

		//Filtering search results
		let searchValue = e.target.value.toLowerCase();

		let searchResult = shows.filter((show) => {
			return (
				show.name.toLowerCase().includes(searchValue) ||
				show.summary
					.replace(/(<([^>]+)>)/gi, "")
					.toLowerCase()
					.includes(searchValue) ||
				show.genres.toString().toLowerCase().includes(searchValue)
			);
		});
		while (rootShows.firstChild) {
			rootShows.removeChild(rootShows.firstChild);
		}
		populateShowsPage(searchResult);
		if (searchValue === "") {
			searchInfo.style.display = "none";
			searchInfo2.style.display = "none";
		}
		searchInfo.innerHTML = `Displaying ${searchResult.length}/${shows.length} Shows`;
	});
}
// Navigation link to go back to shows home page. NB: the link works without the event listener. I added the event listener for the sake of speed.
const navLink = document.getElementById("navigation-link");
navLink.setAttribute("href", window.location.href);
navLink.addEventListener("click", () => window.location.reload());

// Populating the episodes' page
function populateEpisodesPage(arr) {
	if (shows.length < arr.length) {
		shows.push(arr);
	}

	arr.forEach((episode) => {
		//Creating and appending elements
		const episodeWrapper = document.createElement("div", {
			is: "expanding-list",
		});
		episodeWrapper.setAttribute("id", "episodesDiv");
		episodeWrapper.setAttribute("class", "episode-wrapper");
		rootEpisodes.appendChild(episodeWrapper);
		// centering the last child after search and select
		if (arr.length === 1) {
			rootEpisodes.style.display = "block";
			rootEpisodes.style.width = "70%";
		} else {
			rootEpisodes.style.display = "grid";
			rootEpisodes.style.width = "90%";
		}
		let episodeName = document.createElement("h2");
		episodeWrapper.appendChild(episodeName);
		let formattedSeasonNumber = `0${episode.season}`.slice(-2);
		let formattedEpisodeNumber = `0${episode.number}`.slice(-2);
		episodeName.innerHTML = `${episode.name} - S${formattedSeasonNumber}E${formattedEpisodeNumber}`;
		episodeName.setAttribute("class", "episode-name");
		episodeName.addEventListener("click", episodeNameEvent);

		let img = document.createElement("img");
		if (episode.image) {
			img.src = episode.image.medium;
		} else {
			img.src =
				"https://upload.wikimedia.org/wikipedia/commons/2/26/512pxIcon-sunset_photo_not_found.png";
		}
		episodeWrapper.appendChild(img);

		//Select an episode options
		let selectEpisode = document.getElementById("select-episode");
		let options = document.createElement("option");
		options.setAttribute("class", "episodes-option");
		options.innerHTML = `S${formattedSeasonNumber}E${formattedEpisodeNumber} - ${episode.name}`;
		selectEpisode.appendChild(options);

		// Truncated summary Text
		episodeSummary = document.createElement("p");
		episodeSummary.setAttribute("class", "summary");
		episodeWrapper.appendChild(episodeSummary);
		let truncatedText;
		if (episode.summary) {
			truncatedText = episode.summary.split(" ").slice(0, 25).join(" ");
		}
		episodeSummary.innerHTML = `${truncatedText} ...`;
		let span = document.createElement("span");
		span.setAttribute("class", "more-text summary");
		span.innerHTML = episode.summary;

		//A read more button
		let readMore = document.createElement("button");
		readMore.setAttribute("class", "read-more");
		readMore.innerHTML = `Read more`;
		episodeWrapper.append(episodeSummary);
		episodeSummary.appendChild(readMore);

		//A read less button
		let readLess = document.createElement("button");
		readLess.innerHTML = `Read less`;
		readLess.setAttribute("class", "read-less");

		//A condition in which the buttons won't be necessary
		if (episode.summary && episode.summary.length <= truncatedText.length) {
			episodeSummary.innerHTML = truncatedText;
			readMore.style.display = "none";
		} else if (!episode.summary) {
			episodeSummary.innerHTML = "";
			readMore.style.display = "none";
		}

		//An event listener to expand the summary
		readMore.addEventListener("click", () => {
			episodeWrapper.removeChild(episodeWrapper.lastChild);
			episodeWrapper.appendChild(span);
			span.setAttribute("class", "more-text summary");
			span.style.display = "block";
			span.appendChild(readLess);
		});

		//An event listener to collapse the summary
		readLess.addEventListener("click", () => {
			episodeWrapper.removeChild(episodeWrapper.lastChild);
			let fullEpisodeSummary = document.createElement("p");
			episodeWrapper.append(fullEpisodeSummary);
			fullEpisodeSummary.setAttribute("class", "summary");
			fullEpisodeSummary.innerHTML = `${truncatedText}...`;
			fullEpisodeSummary.appendChild(readMore);
			span.style.display = "none";
		});
	});
	createCustomSelect();
}

const episodesLink = document.getElementById("episodes-navigation-link");
// Event listener to go back to episodes page
episodesLink.addEventListener("click", function (e) {
	e.preventDefault();
	while (rootEpisodes.firstChild) {
		rootEpisodes.removeChild(rootEpisodes.firstChild);
	}
	searchForEpisodes.value = "";
	rootEpisodes.style.display = "grid";
	episodeSearchInfo.style.display = "none";
	episodeSearchInfo2.style.display = "none";
	episodesLink.disabled = true;
	episodesLink.style.backgroundColor = "gray";
	rootEpisodes.style.marginTop = "auto";
	document.querySelector(".episode-custom-select-wrapper").style.display =
		"flex";
	episodesLink.onmouseenter = function () {
		this.style.backgroundColor = "gray";
	};
	episodesLink.onmouseleave = function () {
		this.style.backgroundColor = "gray";
	};
	episodesLink.style.cursor = "auto";
	populateEpisodesPage(episodes);
});

//Search result information
const episodeSearchInfo = document.querySelector(".episode-search-info");
const episodeSearchInfo2 = document.querySelector(".episode-search-info2");

// A function consisting of an event listener and a filter to dynamically update the web page based on the user input
function episodeSearch() {
	searchForEpisodes.addEventListener("keyup", (e) => {
		episodeSearchInfo.style.display = "block";
		episodeSearchInfo2.style.display = "block";

		const searchInput = e.target.value.toLowerCase();

		//Filtering the search
		const searchFilter = episodes.filter((episode) => {
			if (episode.name && episode.summary) {
				return (
					episode.name.toLowerCase().includes(searchInput) ||
					episode.summary.toLowerCase().includes(searchInput)
				);
			}
		});
		episodeSearchInfo.innerHTML = `Displaying ${searchFilter.length}/${episodes.length} Episodes`;

		while (rootEpisodes.firstChild) {
			rootEpisodes.removeChild(rootEpisodes.firstChild);
		}
		populateEpisodesPage(searchFilter);

		if (searchInput === "") {
			navLink.style.display = "inline-block";
			episodeSearchInfo.style.display = "none";
			episodeSearchInfo2.style.display = "none";
		}
	});
}

episodeNameEvent = (e) => {
	let clickedEpisode = episodes.filter((episode) => {
		return (
			episode.name === e.target.innerText.split(" ").slice(0, -2).join(" ")
		);
	});
	console.log(episodes.indexOf(clickedEpisode));
	while (rootEpisodes.firstChild) {
		rootEpisodes.removeChild(rootEpisodes.firstChild);
	}
	populateEpisodesPage(clickedEpisode);
	episodesLink.style.opacity = "1";
	rootEpisodes.style.marginTop = '2rem';
	rootEpisodes.style.display = "block";
	rootEpisodes.style.width = "90%";
	rootEpisodes.style.height = "auto";
	
	document.querySelector(".episode-custom-select-wrapper").style.display =
		"none";
	console.log(this);
	let currentContainer = rootEpisodes.querySelector(".episode-wrapper");
	currentContainer.style.width = "80%";
	if (window.innerWidth >= 500) {
		currentContainer.querySelector("img").style.objectFit = "contain";
		currentContainer.querySelector("img").style.width = "90%";
		let originalSizeImage = clickedEpisode.map(
			(episode) => episode.image.original
		);
		currentContainer.querySelector("img").src = originalSizeImage[0];
	}
};

const createCustomSelect = () => {
	const customSelect = document.getElementsByClassName("custom-select");
	let i, j, l, ll, selectElement, selectedDiv, selectHide, selectOption;
	/*look for any elements with the class "custom-select":*/
	l = customSelect.length;
	for (i = 0; i < l; i++) {
		selectElement = customSelect[i].getElementsByTagName("select")[0];
		ll = selectElement.length;
		/*for each element, create a new DIV that will act as the selected item:*/
		selectedDiv = document.createElement("div");
		selectedDiv.setAttribute("class", "select-selected");
		selectedDiv.innerHTML =
			selectElement.options[selectElement.selectedIndex].innerHTML;
		customSelect[i].appendChild(selectedDiv);
		//selectedDiv.id = selectElement.options[selectElement];

		/*for each element, create a new DIV that will contain the option list:*/
		selectHide = document.createElement("div");
		selectHide.setAttribute("class", "select-items select-hide");
		for (j = 1; j < ll; j++) {
			/*for each option in the original select element,
    create a new div that will act as an option item:*/
			selectOption = document.createElement("div");
			selectOption.innerHTML = selectElement.options[j].innerHTML;
			selectOption.addEventListener("click", function (e) {
				/*when an item is clicked, update the original select box,
        and the selected item:*/
				let y, i, k, s, h, sl, yl;
				s = this.parentNode.parentNode.getElementsByTagName("select")[0];
				sl = s.length;
				h = this.parentNode.previousSibling;
				for (i = 0; i < sl; i++) {
					if (s.options[i].innerHTML == this.innerHTML) {
						s.selectedIndex = i;
						h.innerHTML = this.innerHTML;
						y = this.parentNode.getElementsByClassName("same-as-selected");
						yl = y.length;
						for (k = 0; k < yl; k++) {
							y[k].removeAttribute("class");
						}
						this.setAttribute("class", "same-as-selected");
						break;
					}
				}
				h.click();
			});
			selectHide.appendChild(selectOption);
		}
		customSelect[i].appendChild(selectHide);
		selectedDiv.addEventListener("click", function (e) {
			/*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
			e.stopPropagation();
			e.stopImmediatePropagation();
			e.preventDefault();
			closeAllSelect(this);
			this.nextSibling.classList.toggle("select-hide");
			this.classList.toggle("select-arrow-active");
			let thisId;
			shows
				.filter((v) => v.name === this.innerHTML)
				.forEach((el) => (thisId = el.id));
			if (thisId) {
				showID = thisId;
				loadEpisodes();
				document.getElementById("show-episodes").innerHTML = this.innerHTML;
				document.getElementById("show-name").innerHTML = this.innerHTML;
				searchForEpisodes.placeholder = `${this.innerHTML}'s episodes`;
				navLink.style.display = "block";
				searchForEpisodes.style.display = "block";
				// searchBar.value = "";
				displayEpisodes.style.display = "block";
				rootEpisodes.innerHTML = "";
				displayShows.style.display = "none";
			}
		});
	}
	function closeAllSelect(elm) {
		/*a function that will close all select boxes in the document,
  except the current select box:*/
		let x,
			y,
			i,
			xl,
			yl,
			arrNo = [];
		x = document.getElementsByClassName("select-items");
		y = document.getElementsByClassName("select-selected");
		xl = x.length;
		yl = y.length;
		for (i = 0; i < yl; i++) {
			if (elm == y[i]) {
				arrNo.push(i);
			} else {
				y[i].classList.remove("select-arrow-active");
			}
		}
		for (i = 0; i < xl; i++) {
			if (arrNo.indexOf(i)) {
				x[i].classList.add("select-hide");
			}
		}
	}
	/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
	document.addEventListener("click", closeAllSelect);
};

const createCustomSelectEpisode = () => {
	let i, j, l, ll, selectElement, selectedDiv, selectHide, selectOption;
	/*look for any elements with the class "custom-select-episode":*/
	const customSelect = document.getElementsByClassName("custom-select-episode");
	l = customSelect.length;
	for (i = 0; i < l; i++) {
		// selectElement = customSelect[i].getElementsByTagName("select")[0];
		selectElement = customSelect[i].querySelectorAll(".select-episode")[0];
		ll = selectElement.length;
		/*for each element, create a new DIV that will act as the selected item:*/
		selectedDiv = document.createElement("div");
		selectedDiv.setAttribute("class", "select-selected");
		selectedDiv.innerHTML =
			selectElement.options[selectElement.selectedIndex].innerHTML;
		customSelect[i].appendChild(selectedDiv);
		//selectedDiv.id = selectElement.options[selectElement];

		/*for each element, create a new DIV that will contain the option list:*/
		selectHide = document.createElement("div");
		selectHide.setAttribute("class", "select-items select-hide");
		for (j = 1; j < ll; j++) {
			/*for each option in the original select element,
    create a new div that will act as an option item:*/
			selectOption = document.createElement("div");
			selectOption.innerHTML = selectElement.options[j].innerHTML;
			selectOption.addEventListener("click", function (e) {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();

				/*when an item is clicked, update the original select box,
        and the selected item:*/
				let y, i, k, s, h, sl, yl;
				// s = this.parentNode.parentNode.getElementsByTagName("select")[0];
				s = this.parentNode.parentNode.querySelectorAll(".select-episode")[0];
				sl = s.length;
				h = this.parentNode.previousSibling;
				for (i = 0; i < sl; i++) {
					if (s.options[i].innerHTML == this.innerHTML) {
						s.selectedIndex = i;
						h.innerHTML = this.innerHTML;
						y = this.parentNode.getElementsByClassName("same-as-selected");
						yl = y.length;
						for (k = 0; k < yl; k++) {
							y[k].removeAttribute("class");
						}
						this.setAttribute("class", "same-as-selected");
						break;
					}
				}
				h.click();
			});
			selectHide.appendChild(selectOption);
		}
		customSelect[i].appendChild(selectHide);
		let selectedShow = selectedDiv.innerHTML.split(" ").slice(2).join(" ");
		selectedDiv.addEventListener("click", function (e) {
			/*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
			closeAllSelect(this);
			this.nextSibling.classList.toggle("select-hide");
			this.classList.toggle("select-arrow-active");
			searchForEpisodes.value = "";
			let episode = document.querySelectorAll(".episode-wrapper");
			let checkerShow = this.textContent.split(" ").slice(2).join(" ");
			for (let i = 0; i < episode.length; i++) {
				episode[i].style.display = "block";
				let checker = this.textContent.split(" ").slice(2).join(" ");
				let currentElement = episode[i].firstChild.innerHTML
					.split(" ")
					.slice(0, -2)
					.join(" ");
				if (currentElement === checker) {
					// episode[i].style.display = "grid";
					episodesLink.style.opacity = "1";
					episodesLink.disabled = false;
					episodesLink.style.cursor = "pointer";
					episodesLink.style.backgroundColor = "rgb(5, 58, 92)";
					episodesLink.onmouseenter = function () {
						this.style.backgroundColor = "rgb(4, 42, 66)";
					};
					episodesLink.onmouseleave = function () {
						this.style.backgroundColor = "rgb(5, 58, 92)";
					};
					navLink.style.display = "block";
					rootEpisodes.style.display = "block";
					rootEpisodes.style.width = "90%";
					rootEpisodes.style.heigh = "auto";
					episode[i].style.width = "80%";
					if (window.innerWidth >= 500) {
						episode[i].querySelector("img").style.objectFit = "contain";
						episode[i].querySelector("img").style.width = "90%";
						let originalSizeImage = episodes.map(
							(episode) => episode.image.original
						);
						episode[i].querySelector("img").src = originalSizeImage[i];
					}
					episode[i].querySelector("img").style.height = "auto";
				} else if (checker !== selectedShow) {
					episode[i].style.display = "none";
				}
			}
			// searchForEpisodes.style.display = "none";
		});
	}

	/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
	//document.addEventListener("click", closeAllSelect);
};
function closeAllSelect(elm) {
	/*a function that will close all select boxes in the document,
  except the current select box:*/
	let x,
		y,
		i,
		xl,
		yl,
		arrNo = [];
	x = document.getElementsByClassName("select-items");
	y = document.getElementsByClassName("select-selected");
	xl = x.length;
	yl = y.length;
	for (i = 0; i < yl; i++) {
		if (elm == y[i]) {
			arrNo.push(i);
		} else {
			y[i].classList.remove("select-arrow-active");
		}
	}
	for (i = 0; i < xl; i++) {
		if (arrNo.indexOf(i)) {
			x[i].classList.add("select-hide");
		}
	}
}

window.onload = loadShows;
