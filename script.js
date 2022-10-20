// Getting elements from the DOM
const displayShows = document.getElementById("shows-page-wrapper");
const displayEpisodes = document.getElementById("episodes-page-wrapper");
const rootShows = document.getElementById("root-shows");
const rootEpisodes = document.getElementById("root-episodes");
const searchBar = document.querySelector(".search-bar");
const searchForEpisodes = document.querySelector(".episodes-search-bar");
const parentDiv = document.getElementsByTagName("div");
let showId, currentShowName;

//Variables to store data and minimize api calls
let shows, episodes;

//Getting shows data from API
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

//Async function to fetch a show's episodes
const loadEpisodes = async () => {
	try {
		const response = fetch(
			"https://api.tvmaze.com/shows/" + showId + "/episodes"
		);
		episodes = await (await response).json();
		console.log(episodes);
		populateEpisodesPage(episodes);
		createCustomSelect();
		episodeSearch(episodes);
	} catch (err) {
		console.error(err);
	}
};

// A function to extract shows and populate the webpage.
function populateShowsPage(arr) {
	arr.forEach((show) => {
		let showWrapper = document.createElement("div");
		showWrapper.setAttribute("class", "show-wrapper");
		showWrapper.id = show.id;
		rootShows.appendChild(showWrapper);
		createShowName(show, showWrapper);
		createShowImage(show, showWrapper);
		createShowInfo(
			show.genres,
			show.status,
			show.rating.average,
			show.runtime,
			showWrapper
		);
		createEmptyDiv(showWrapper);
		createAndFormatSummary(show.summary, showWrapper);
		createSelectOptions(show);
	});
}

const createShowName = (show, parent) => {
	let showName = document.createElement("h3");
	showName.setAttribute("class", "name");
	parent.appendChild(showName);
	showName.innerHTML = show.name;
	showName.id = show.id;
	showName.addEventListener("click", showNameEvent);
};

const createShowImage = (show, parent) => {
	let img = document.createElement("img");
	img.src = show.image.medium;
	parent.appendChild(img);
};

const createShowInfo = (g, s, r, rt, parent) => {
	let corrected = g.toString().split(",").join(", ");
	let showInfo = document.createElement("section");
	showInfo.className = "show-info";
	parent.appendChild(showInfo);
	let genres = document.createElement("h4");
	genres.setAttribute("class", "genres");
	genres.innerHTML = `Genres: ${corrected}`;
	let status = document.createElement("h4");
	status.className = "status";
	status.innerHTML = `Status: ${s}`;
	let rating = document.createElement("h4");
	rating.className = "rating";
	rating.innerText = `Rating: ${r}    `;
	let runtime = document.createElement("h4");
	runtime.className = "runtime";
	runtime.innerText = `Runtime: ${rt}`;
	showInfo.appendChild(genres);
	showInfo.appendChild(status);
	showInfo.appendChild(rating);
	showInfo.appendChild(runtime);
};

createEmptyDiv = (parent) => {
	let emptyDiv = document.createElement("div");
	emptyDiv.className = "empty-div";
	parent.appendChild(emptyDiv);
};

const createAndFormatSummary = (summary, parent) => {
	if (summary) {
		const truncatedText = summary.split(" ").slice(0, 25).join(" ");
		let truncatedSummary = document.createElement("button");
		truncatedSummary.className = "summary";
		parent.appendChild(truncatedSummary);
		if (summary.length <= truncatedText.length) {
			truncatedSummary.innerHTML = summary;
		} else {
			truncatedSummary.innerHTML = `${truncatedText} ... <span class="read-more">read more</span>`;
			truncatedSummary.addEventListener("click", readMore);
		}
		let fullSummary = document.createElement("button");
		fullSummary.setAttribute("class", "d-none summary");
		fullSummary.innerHTML = `${summary}<span class="read-less">read less</span>`;
		parent.appendChild(fullSummary);
		truncatedSummary.addEventListener("click", readMore);
		fullSummary.addEventListener("click", readLess);
	}
};

const createSelectOptions = (show) => {
	let selectShows = document.querySelector("#shows");
	let options = document.createElement("option");
	options.setAttribute("id", `${show.id}`);
	options.setAttribute("class", "show-options");
	options.innerText = show.name;
	selectShows.appendChild(options);
};

const showNameEvent = (e) => {
	currentShowName = e.target.innerText;
	showId = e.target.id;
	loadEpisodes();
	window.scrollTo(0, 0);
	displayEpisodes.style.display = "block";
	navLink.style.display = "block";
	document.getElementById("show-episodes").innerHTML = currentShowName;
	document.getElementById("show-name").innerHTML = currentShowName;
	searchForEpisodes.placeholder = currentShowName;
	displayShows.style.display = "none";
};

const readMore = (e) => {
	let parent = e.target.parentElement.parentNode.parentElement;
	let readMore = e.target.parentElement.parentNode;
	let readLess = e.target.parentElement.parentNode.nextSibling;
	let allParents = rootShows.querySelectorAll(".show-wrapper");
	if (displayShows.style.display === "none") {
		allParents = rootEpisodes.querySelectorAll(".episode-wrapper");
	}
	readMore.classList.toggle("d-none");
	readLess.classList.toggle("d-none");
	for (let i = 0; i < allParents.length; i++) {
		if (allParents[i].id === parent.id) {
			allParents[i].style.height = "100%";
		} else {
			allParents[i].style.height = "fit-content";
			allParents[i].style.marginTop = "0";
		}
	}
};

const readLess = (e) => {
	let readLess = e.target.parentElement.parentNode.lastChild;
	let readMore = e.target.parentElement.parentNode.lastChild.previousSibling;
	let allParents = rootShows.querySelectorAll(".show-wrapper");
	if (displayShows.style.display === "none") {
		allParents = rootEpisodes.querySelectorAll(".episode-wrapper");
	}
	readMore.classList.toggle("d-none");
	readLess.classList.toggle("d-none");
	for (let i = 0; i < allParents.length; i++) {
		allParents[i].style.height = "100%";
	}
};

const showsSearchInfoWrapper = document.querySelector(
	".shows-search-info-wrapper"
);
const showsSearchInfo = document.querySelector(".search-info");

function showSearch() {
	searchBar.addEventListener("keyup", (e) => {
		e.preventDefault();
		showsSearchInfoWrapper.style.display = "flex";
		rootShows.style.margin = "2rem auto";
		let searchValue = e.target.value.toLowerCase();
		let originalImage;
		let searchResult = shows.filter((show) => {
			if (
				show.name.toLowerCase().includes(searchValue) ||
				show.summary
					.replace(/(<([^>]+)>)/gi, "")
					.toLowerCase()
					.includes(searchValue) ||
				show.genres.toString().toLowerCase().includes(searchValue)
			) {
				originalImage = show.image.original;
				return show;
			}
		});
		while (rootShows.firstChild) {
			rootShows.removeChild(rootShows.firstChild);
		}
		populateShowsPage(searchResult);
		if (searchResult.length === 1) oneShowLayout(originalImage);
		if (searchValue === "") allShowsLayout();
		showsSearchInfo.innerHTML = `Displaying ${searchResult.length}/${shows.length} shows`;
	});
}

const oneShowLayout = (img) => {
	let currentContainer = rootShows.querySelector(".show-wrapper");
	rootShows.style.display = "block";
	rootShows.style.width = "90%";
	if (window.innerWidth >= 500) {
		let image = currentContainer.querySelector("img");
		rootShows.style.width = "100%";
		currentContainer.style.width = "70%";
		image.style.objectFit = "contain";
		image.style.width = "80%";
		image.src = img;
		image.style.height = "auto";
	}
};

const allShowsLayout = () => {
	rootShows.style.display = "grid";
	showsSearchInfoWrapper.style.display = "none";
	rootShows.style.margin = "0 auto";
	if (window.innerWidth >= 1340) {
		rootShows.style.width = "97%";
	} else if (window.innerWidth >= 1040) {
		rootShows.style.width = "95%";
	} else if (window.innerWidth >= 690) {
		rootShows.style.width = "90%";
	} else rootShows.style.width = "85%";
};

const navLink = document.getElementById("navigation-link");
navLink.setAttribute("href", window.location.href);
navLink.addEventListener("click", () => window.location.reload());

function populateEpisodesPage(arr) {
	arr.forEach((episode) => {
		const episodeWrapper = document.createElement("div", {
			is: "expanding-list",
		});
		episodeWrapper.setAttribute("id", episode.id);
		episodeWrapper.setAttribute("class", "episode-wrapper");
		rootEpisodes.appendChild(episodeWrapper);
		createEpisodeName(episode, episodeWrapper);
		createImageElement(episode, episodeWrapper);
		createAndFormatSummary(episode.summary, episodeWrapper);
		createEpisodeSelectOptions(episode);
	});
}

const createEpisodeName = (episode, parent) => {
	let episodeName = document.createElement("h2");
	parent.appendChild(episodeName);
	episodeName.innerHTML = `${episode.name} - ${episodeCode(
		episode.season,
		episode.number
	)}`;
	episodeName.setAttribute("class", "episode-name");
	episodeName.addEventListener("click", episodeNameEvent);
};

const episodeCode = (season, number) => {
	season = season < 10 ? "0" + season : season;
	number = number < 10 ? "0" + number : number;
	return `S${season}E${number}`;
};

const createImageElement = (obj, container) => {
	let img = document.createElement("img");
	let imageNotFound =
		"https://upload.wikimedia.org/wikipedia/commons/2/26/512pxIcon-sunset_photo_not_found.png";
	if (obj.image) {
		img.src = obj.image.medium;
	} else {
		img.src = imageNotFound;
		img.style.width = "250px";
		img.style.height = "140px";
	}
	container.appendChild(img);
};

const createEpisodeSelectOptions = (episode) => {
	let selectEpisode = document.getElementById("select-episode");
	let options = document.createElement("option");
	options.setAttribute("class", "episodes-option");
	options.innerHTML = `${episodeCode(episode.season, episode.number)} - ${
		episode.name
	}`;
	selectEpisode.appendChild(options);
};

const backToAllEpisodes = document.getElementById("episodes-navigation-link");
backToAllEpisodes.addEventListener("click", function (e) {
	e.preventDefault();
	while (rootEpisodes.firstChild) {
		rootEpisodes.removeChild(rootEpisodes.firstChild);
	}
	allEpisodesLayout();
	populateEpisodesPage(episodes);
});

//Episodes' Search result information
const episodesSearchInfoWrapper = document.querySelector(
	".episodes-search-info-wrapper"
);
const episodesSearchInfo = document.querySelector(".episodes-search-info");

const clearPlaceholder = () => {
	searchBar.placeholder = "";
	searchForEpisodes.placeholder = "";
};

const addPlaceholder = () => {
	searchBar.placeholder = "Search for shows";
	searchForEpisodes.placeholder = currentShowName;
};

function episodeSearch(e) {
	searchForEpisodes.addEventListener("keyup", (e) => {
		episodesSearchInfoWrapper.style.display = "flex";
		const searchInput = e.target.value.toLowerCase();
		let originalImage;
		const searchFilter = episodes.filter((episode) => {
			if (episode.name && episode.summary) {
				originalImage = episode.image.original;
				return (
					episode.name.toLowerCase().includes(searchInput) ||
					episode.summary.toLowerCase().includes(searchInput)
				);
			}
		});
		episodesSearchInfo.innerHTML = `Displaying ${searchFilter.length}/${episodes.length} Episodes`;

		while (rootEpisodes.firstChild) {
			rootEpisodes.removeChild(rootEpisodes.firstChild);
		}
		populateEpisodesPage(searchFilter);
		backToAllEpisodes.disabled = false;
		backToAllEpisodes.style.opacity = "1";
		rootEpisodes.style.margin = "2rem auto";
		if (searchFilter.length === 1) {
			oneEpisodeSearchLayout(searchFilter);
		}
		if (searchInput === "") {
			allEpisodesLayout();
			currentShowName = document.querySelector(".show-name").innerText;
		}
	});
}

const episodesSearchContainer = document.querySelector(
	".episode-search-container"
);

const episodeNameEvent = (e) => {
	let clickedEpisode = episodes.filter((episode) => {
		return (
			episode.name === e.target.innerText.split(" ").slice(0, -2).join(" ")
		);
	});
	while (rootEpisodes.firstChild) {
		rootEpisodes.removeChild(rootEpisodes.firstChild);
	}
	populateEpisodesPage(clickedEpisode);
	let currentContainer = rootEpisodes.querySelector(".episode-wrapper");
	oneEpisodeLayout(clickedEpisode[0], currentContainer);
	document.querySelector(".episode-custom-select-wrapper").style.display =
		"none";
};

const allEpisodesLayout = () => {
	searchForEpisodes.value = "";
	rootEpisodes.style.display = "grid";
	rootEpisodes.style.margin = "0 auto";
	episodesSearchContainer.style.display = "block";
	if (window.innerWidth >= 1340) {
		rootEpisodes.style.width = "97%";
	} else if (window.innerWidth >= 1040) {
		rootEpisodes.style.width = "95%";
	} else if (window.innerWidth >= 690) {
		rootEpisodes.style.width = "90%";
	} else rootEpisodes.style.width = "85%";
	episodesSearchInfoWrapper.style.display = "none";
	backToAllEpisodes.disabled = true;
	backToAllEpisodes.style.backgroundColor = "gray";
	document.querySelector(".episode-custom-select-wrapper").style.display =
		"flex";
	backToAllEpisodes.onmouseenter = function () {
		this.style.backgroundColor = "gray";
	};
	backToAllEpisodes.onmouseleave = function () {
		this.style.backgroundColor = "gray";
	};
	backToAllEpisodes.style.cursor = "auto";
};

const oneEpisodeSearchLayout = (arr) => {
	rootEpisodes.style.display = "block";
	rootEpisodes.style.width = "90%";
	let currentContainer = rootEpisodes.querySelector(".episode-wrapper");
	currentContainer.style.width = "100%";
	document.querySelector(".episode-custom-select-wrapper").style.display =
		"none";
	if (window.innerWidth >= 500) {
		let originalSizeImage = arr.map((episode) => episode.image.original);
		let imageElem = currentContainer.querySelector("img");
		imageElem.src = originalSizeImage[0];
		rootEpisodes.style.width = "70%";
		imageElem.style.objectFit = "contain";
		imageElem.style.width = "80%";
		imageElem.style.height = "auto";
	}
};

const oneEpisodeLayout = (episode, container) => {
	episodesSearchInfoWrapper.style.display = "none";
	backToAllEpisodes.style.opacity = "1";
	rootEpisodes.style.display = "block";
	episodesSearchContainer.style.display = "none";
	backToAllEpisodes.disabled = false;
	backToAllEpisodes.style.backgroundColor = "#373459";
	backToAllEpisodes.onmouseenter = function () {
		this.style.backgroundColor = "#2b284d";
	};
	backToAllEpisodes.onmouseleave = function () {
		this.style.backgroundColor = "#373459";
	};
	backToAllEpisodes.style.cursor = "pointer";
	container.style.width = "100%";
	let image = container.querySelector("img");
	window.scrollTo(0, 0);
	if (window.innerWidth >= 500) {
		let originalSizeImage;
		if (episode.image) {
			originalSizeImage = episode.image.original;
		} else {
			originalSizeImage = image.src;
		}
		image.src = originalSizeImage;
		rootEpisodes.style.width = "70%";
		image.style.objectFit = "contain";
		image.style.width = "80%";
	}
};

const createCustomSelect = () => {
	let customSelect = document.getElementsByClassName("custom-select");
	if (displayShows.style.display === "none") {
		customSelect = document.getElementsByClassName("custom-select-episode");
	}
	let i, j, l, ll, selectElement, selectedDiv, selectHide, selectOption;
	/*look for any elements with the class "custom-select":*/
	l = customSelect.length;
	for (i = 0; i < l; i++) {
		selectElement = customSelect[i].getElementsByTagName("select")[0];
		ll = selectElement.length;
		/*a new DIV that will act as the selected item:*/
		selectedDiv = document.createElement("div");
		selectedDiv.setAttribute("class", "select-selected");
		selectedDiv.innerHTML =
			selectElement.options[selectElement.selectedIndex].innerHTML;
		customSelect[i].appendChild(selectedDiv);
		/*a new DIV that will contain the option list:*/
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
		let selectedShow;
		if (displayShows.style.display === "none") {
			selectedShow = selectedDiv.innerHTML.split(" ").slice(2).join(" ");
		}
		selectedDiv.addEventListener("click", function (e) {
			e.stopPropagation();
			e.stopImmediatePropagation();
			e.preventDefault();
			closeAllSelect(this);
			this.nextSibling.classList.toggle("select-hide");
			this.classList.toggle("select-arrow-active");
			if (displayShows.style.display !== "none") {
				let thisId;
				shows
					.filter((v) => v.name === this.innerHTML)
					.forEach((el) => (thisId = el.id));
				if (thisId) {
					showId = thisId;
					loadEpisodes();
					document.getElementById("show-episodes").innerHTML = this.innerHTML;
					document.getElementById("show-name").innerHTML = this.innerHTML;
					searchForEpisodes.placeholder = this.innerHTML;
					navLink.style.display = "block";
					searchBar.value = "";
					displayEpisodes.style.display = "block";
					rootEpisodes.innerHTML = "";
					displayShows.style.display = "none";
				}
			} else {
				searchForEpisodes.value = "";
				episodesSearchInfoWrapper.style.display = "none";
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
						let selectedEpisode = episodes[i];
						let selectedElement = episode[i];
						oneEpisodeLayout(selectedEpisode, selectedElement);
					} else if (checker !== selectedShow) {
						episode[i].style.display = "none";
					}
				}
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

window.onload = loadShows;
