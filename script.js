// Getting elements from the DOM
const mainElement = document.getElementById('main-wrapper');
const rootElement = document.getElementById('root');
const searchBar = document.querySelector('.search-bar');
const navContainer = mainElement.querySelector('.nav-links-plus-name');
let url = 'https://api.tvmaze.com/shows';
let shows, showId;

//Getting shows api data
const loadShows = async () => {
	try {
		const response = await fetch(url);
		shows = await response.json();
		populatePage(shows);
		showSearch(shows);
		createCustomSelect();
	} catch (err) {
		console.error(err);
	}
};

function populatePage(arr) {
	arr.forEach((elem) => {
		let wrapper = document.createElement('div');
		wrapper.setAttribute('class', 'wrapper');
		wrapper.id = elem.id;
		rootElement.appendChild(wrapper);
		if (elem.season && elem.number) {
			createEpisodeName(elem, wrapper);
			createEpisodeSelectOptions(elem);
		} else {
			createShowName(elem, wrapper);
			createSelectOptions(elem);
		}
		createImage(elem, wrapper);
		if (elem.genres) {
			createShowInfo(
				elem.genres,
				elem.status,
				elem.rating.average,
				elem.runtime,
				wrapper
			);
			createEmptyDiv(wrapper);
		}
		createAndFormatSummary(elem.summary, wrapper);
	});
}

const createShowName = (show, parent) => {
	let showName = document.createElement('h3');
	showName.setAttribute('class', 'name');
	parent.appendChild(showName);
	showName.innerHTML = show.name;
	showName.id = show.id;
	showName.addEventListener('click', showNameEvent);
};

const createEpisodeName = (episode, parent) => {
	let episodeName = document.createElement('h2');
	parent.appendChild(episodeName);
	episodeName.innerHTML = `${episode.name} - ${episodeCode(
		episode.season,
		episode.number
	)}`;
	episodeName.setAttribute('class', 'episode-name');
	episodeName.addEventListener('click', episodeNameEvent);
};

const episodeCode = (season, number) => {
	season = season < 10 ? '0' + season : season;
	number = number < 10 ? '0' + number : number;
	return `S${season}E${number}`;
};

const createImage = (obj, container) => {
	let img = document.createElement('img');
	let imageNotFound =
		'https://upload.wikimedia.org/wikipedia/commons/2/26/512pxIcon-sunset_photo_not_found.png';
	if (obj.image) {
		img.src = obj.image.medium;
	} else {
		img.src = imageNotFound;
		img.style.width = '250px';
		img.style.height = '140px';
	}
	container.appendChild(img);
};

const createEpisodeSelectOptions = (episode) => {
	let selectEpisode = document.getElementById('select-episode');
	let options = document.createElement('option');
	options.setAttribute('class', 'episodes-option');
	options.innerHTML = `${episodeCode(episode.season, episode.number)} - ${
		episode.name
	}`;
	selectEpisode.appendChild(options);
};

const createShowInfo = (g, s, r, rt, parent) => {
	let corrected = g.toString().split(',').join(', ');
	let showInfo = document.createElement('section');
	showInfo.className = 'show-info';
	parent.appendChild(showInfo);
	let genres = document.createElement('h4');
	genres.setAttribute('class', 'genres');
	genres.innerHTML = `Genres: ${corrected}`;
	let status = document.createElement('h4');
	status.className = 'status';
	status.innerHTML = `Status: ${s}`;
	let rating = document.createElement('h4');
	rating.className = 'rating';
	rating.innerText = `Rating: ${r}    `;
	let runtime = document.createElement('h4');
	runtime.className = 'runtime';
	runtime.innerText = `Runtime: ${rt}`;
	showInfo.appendChild(genres);
	showInfo.appendChild(status);
	showInfo.appendChild(rating);
	showInfo.appendChild(runtime);
};

createEmptyDiv = (parent) => {
	let emptyDiv = document.createElement('div');
	emptyDiv.className = 'empty-div';
	parent.appendChild(emptyDiv);
};

const createAndFormatSummary = (summary, parent) => {
	if (summary) {
		const truncatedText = summary.split(' ').slice(0, 25).join(' ');
		let truncatedSummary = document.createElement('button');
		truncatedSummary.className = 'summary';
		parent.appendChild(truncatedSummary);
		if (summary.length <= truncatedText.length) {
			truncatedSummary.innerHTML = summary;
		} else {
			truncatedSummary.innerHTML = `${truncatedText} ... <span class="read-more">read more</span>`;
			truncatedSummary.addEventListener('click', readMore);
		}
		let fullSummary = document.createElement('button');
		fullSummary.setAttribute('class', 'd-none summary');
		fullSummary.innerHTML = `${summary}<span class="read-less">read less</span>`;
		parent.appendChild(fullSummary);
		truncatedSummary.addEventListener('click', readMore);
		fullSummary.addEventListener('click', readLess);
	}
};

const createSelectOptions = (show) => {
	let selectShow = document.querySelector('#select-show');
	let options = document.createElement('option');
	options.setAttribute('id', `${show.id}`);
	options.setAttribute('class', 'show-options');
	options.innerText = show.name;
	selectShow.appendChild(options);
};

const showNameEvent = (e) => {
	let currentShowName = e.target.innerText;
	showId = e.target.id;
	url = `https://api.tvmaze.com/shows/${showId}/episodes`;
	rootElement.innerHTML = '';
	loadShows();
	allEpisodesLayout();
	document.getElementById('episode-option').innerHTML = currentShowName;
	document.getElementById('show-name').innerHTML = currentShowName;
	searchBar.placeholder = currentShowName;
	window.scrollTo(0, 0);
};

const readMore = (e) => {
	let parent = e.target.parentElement.parentNode.parentElement;
	let readMore = e.target.parentElement.parentNode;
	let readLess = e.target.parentElement.parentNode.nextSibling;
	let allParents = rootElement.querySelectorAll('.wrapper');
	readMore.classList.toggle('d-none');
	readLess.classList.toggle('d-none');
	for (let i = 0; i < allParents.length; i++) {
		if (allParents[i].id === parent.id) {
			allParents[i].style.height = '100%';
		} else {
			allParents[i].style.height = 'fit-content';
			allParents[i].style.marginTop = '0';
		}
	}
};

const readLess = (e) => {
	let readLess = e.target.parentElement.parentNode.lastChild;
	let readMore = e.target.parentElement.parentNode.lastChild.previousSibling;
	let allParents = rootElement.querySelectorAll('.wrapper');
	readMore.classList.toggle('d-none');
	readLess.classList.toggle('d-none');
	for (let i = 0; i < allParents.length; i++) {
		allParents[i].style.height = '100%';
	}
};

const searchInfoWrapper = document.querySelector('.shows-search-info-wrapper');
const showsSearchInfo = document.querySelector('.search-info');
function showSearch() {
	searchBar.addEventListener('keyup', (e) => {
		e.preventDefault();
		searchInfoWrapper.style.display = 'flex';
		rootElement.style.margin = '2rem auto';
		let searchValue = e.target.value.toLowerCase();
		let originalImage;
		let searchResult = shows.filter((show) => {
			if (
				show.genres &&
				(show.name.toLowerCase().includes(searchValue) ||
					show.summary
						.replace(/(<([^>]+)>)/gi, '')
						.toLowerCase()
						.includes(searchValue) ||
					show.genres.toString().toLowerCase().includes(searchValue))
			) {
				originalImage = show.image.original;
				return show;
			} else if (
				show.name.toLowerCase().includes(searchValue) ||
				show.summary
					.replace(/(<([^>]+)>)/gi, '')
					.toLowerCase()
					.includes(searchValue)
			) {
				originalImage = show.image.original;
				return show;
			}
		});
		while (rootElement.firstChild) {
			rootElement.removeChild(rootElement.firstChild);
		}
		populatePage(searchResult);
		if (searchResult[0].genres) {
			showsSearchInfo.innerHTML = `Displaying ${searchResult.length}/${shows.length} shows`;
		} else {
			showsSearchInfo.innerHTML = `Displaying ${searchResult.length}/${shows.length} episodes`;
		}
		if (searchResult.length === 1 && searchResult[0].genres)
			oneShowLayout(originalImage);
		if (searchResult.length === 1 && !searchResult[0].genres)
			oneEpisodeSearchLayout(searchResult);
		if (searchValue === '') allShowsLayout();
	});
}

const oneShowLayout = (img) => {
	let currentContainer = rootElement.querySelector('.wrapper');
	rootElement.style.display = 'block';
	rootElement.style.width = '90%';
	if (window.innerWidth >= 500) {
		let image = currentContainer.querySelector('img');
		rootElement.style.width = '100%';
		currentContainer.style.width = '60%';
		image.style.objectFit = 'contain';
		image.style.width = '100%';
		image.src = img;
		image.style.height = '70vh';
	}
};

const allShowsLayout = () => {
	rootElement.style.display = 'grid';
	searchInfoWrapper.style.display = 'none';
	rootElement.style.margin = '0 auto';
	if (window.innerWidth >= 1340) {
		rootElement.style.width = '97%';
	} else if (window.innerWidth >= 1040) {
		rootElement.style.width = '95%';
	} else if (window.innerWidth >= 690) {
		rootElement.style.width = '90%';
	} else rootElement.style.width = '85%';
	backToEpisodes.disabled = true;
	backToEpisodes.style.backgroundColor = 'gray';
	document.querySelector('.episode-custom-select-wrapper').style.display =
		'flex';
	backToEpisodes.onmouseenter = function () {
		this.style.backgroundColor = 'gray';
	};
	backToEpisodes.onmouseleave = function () {
		this.style.backgroundColor = 'gray';
	};
	backToEpisodes.style.cursor = 'auto';
};

const backToShows = document.getElementById('navigation-link');
backToShows.addEventListener('click', () => window.location.reload());

const backToEpisodes = document.getElementById('episodes-navigation-link');
backToEpisodes.addEventListener('click', function (e) {
	e.preventDefault();
	while (rootElement.firstChild) {
		rootElement.removeChild(rootElement.firstChild);
	}
	allShowsLayout();
	allEpisodesLayout();
	populatePage(shows);
});

//Episodes' Search result information
const episodesSearchInfoWrapper = document.querySelector(
	'.episodes-search-info-wrapper'
);
const episodesSearchInfo = document.querySelector('.episodes-search-info');

const clearPlaceholder = () => {
	searchBar.placeholder = '';
};

const addPlaceholder = () => {
	searchBar.placeholder = 'Search for shows';
};

const searchBarWrapper = document.querySelector('.search-container');

const episodeNameEvent = (e) => {
	let clickedEpisode = shows.filter((episode) => {
		return (
			episode.name === e.target.innerText.split(' ').slice(0, -2).join(' ')
		);
	});
	while (rootElement.firstChild) {
		rootElement.removeChild(rootElement.firstChild);
	}
	populatePage(clickedEpisode);
	let currentContainer = rootElement.querySelector('.wrapper');
	oneEpisodeLayout(clickedEpisode[0], currentContainer);
	document.querySelector('.episode-custom-select-wrapper').style.display =
		'none';
};

const allEpisodesLayout = () => {
	rootElement.style.margin = '0 auto';
	searchBarWrapper.style.display = 'block';
	backToShows.style.display = 'inline-flex';
	navContainer.style.display = 'flex';
	navContainer.style.margin = '1rem auto';
	if (window.innerWidth >= 1340) {
		rootElement.style.width = '97%';
	} else if (window.innerWidth >= 1040) {
		rootElement.style.width = '95%';
	} else if (window.innerWidth >= 690) {
		rootElement.style.width = '90%';
	} else rootElement.style.width = '85%';
	backToEpisodes.disabled = true;
	backToEpisodes.style.backgroundColor = 'gray';
	document.querySelector('.episode-custom-select-wrapper').style.display =
		'flex';
	document.querySelector('.custom-select-wrapper').style.display = 'none';
	backToEpisodes.onmouseenter = function () {
		this.style.backgroundColor = 'gray';
	};
	backToEpisodes.onmouseleave = function () {
		this.style.backgroundColor = 'gray';
	};
	backToEpisodes.style.cursor = 'auto';
};

const oneEpisodeSearchLayout = (arr) => {
	rootElement.style.display = 'block';
	let currentContainer = rootElement.querySelector('.wrapper');
	currentContainer.style.width = '100%';
	document.querySelector('.episode-custom-select-wrapper').style.display =
		'none';
	if (window.innerWidth >= 500) {
		let originalSizeImage = arr.map((episode) => episode.image.original);
		let imageElem = currentContainer.querySelector('img');
		imageElem.src = originalSizeImage[0];
		rootElement.style.width = '70%';
		imageElem.style.objectFit = 'contain';
		imageElem.style.width = '80%';
		imageElem.style.height = 'auto';
	} else {
		rootElement.style.width = '90%';
		imageElem.style.width = '90%';
		navContainer.style.margin = '1rem auto 0 auto';
		navContainer.style.width = '90%';
	}
};

const oneEpisodeLayout = (episode, container) => {
	searchInfoWrapper.style.display = 'none';
	backToEpisodes.style.display = 'block';
	navContainer.style.justifyContent = 'space-between';
	rootElement.style.display = 'block';
	searchBarWrapper.style.display = 'none';
	backToEpisodes.disabled = false;
	backToEpisodes.style.backgroundColor = '#373459';
	backToEpisodes.onmouseenter = function () {
		this.style.backgroundColor = '#2b284d';
	};
	backToEpisodes.onmouseleave = function () {
		this.style.backgroundColor = '#373459';
	};
	backToEpisodes.style.cursor = 'pointer';
	container.style.width = '100%';
	let image = container.querySelector('img');
	window.scrollTo(0, 0);
	if (window.innerWidth >= 500) {
		let originalSizeImage;
		if (episode.image.original) {
			originalSizeImage = episode.image.original;
		} else {
			originalSizeImage = image.src;
		}
		image.src = originalSizeImage;
		rootElement.style.width = '70%';
		image.style.objectFit = 'contain';
		image.style.width = '80%';
		image.style.height = 'auto';
	} else {
		rootElement.style.width = '90%';
		image.style.width = '90%';
		navContainer.style.margin = '1rem auto 0 auto';
		navContainer.style.width = '90%';
	}
};

const createCustomSelect = () => {
	let customSelect = document.getElementsByClassName('custom-select');
	if (!shows[0].genres) {
		customSelect = document.getElementsByClassName('custom-select-episode');
	}
	let i, j, l, ll, selectElement, selectedDiv, selectHide, selectOption;
	/*look for any elements with the class "custom-select":*/
	l = customSelect.length;
	for (i = 0; i < l; i++) {
		selectElement = customSelect[i].getElementsByTagName('select')[0];
		ll = selectElement.length;
		/*a new DIV that will act as the selected item:*/
		selectedDiv = document.createElement('div');
		selectedDiv.setAttribute('class', 'select-selected');
		selectedDiv.innerHTML =
			selectElement.options[selectElement.selectedIndex].innerHTML;
		customSelect[i].appendChild(selectedDiv);
		/*a new DIV that will contain the option list:*/
		selectHide = document.createElement('div');
		selectHide.setAttribute('class', 'select-items select-hide');
		for (j = 1; j < ll; j++) {
			/*for each option in the original select element,
    create a new div that will act as an option item:*/
			selectOption = document.createElement('div');
			selectOption.innerHTML = selectElement.options[j].innerHTML;
			selectOption.addEventListener('click', function (e) {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				let parent = document.querySelector('.custom-select-wrapper');
				if (parent === e.target.parentElement.parentElement.parentElement) {
					parent.style.display = 'none';
					document.querySelector(
						'.episode-custom-select-wrapper'
					).style.display = 'flex';
				}
				/*when an item is clicked, update the original select box,
        and the selected item:*/
				let y, i, k, s, h, sl, yl;
				s = this.parentNode.parentNode.getElementsByTagName('select')[0];
				sl = s.length;
				h = this.parentNode.previousSibling;
				for (i = 0; i < sl; i++) {
					if (s.options[i].innerHTML == this.innerHTML) {
						s.selectedIndex = i;
						h.innerHTML = this.innerHTML;
						y = this.parentNode.getElementsByClassName('same-as-selected');
						yl = y.length;
						for (k = 0; k < yl; k++) {
							y[k].removeAttribute('class');
						}
						this.setAttribute('class', 'same-as-selected');
						break;
					}
				}
				h.click();
			});
			selectHide.appendChild(selectOption);
		}
		customSelect[i].appendChild(selectHide);
		let selectedShow;
		let match = shows.filter((show) => (show.genres ? undefined : show));
		if (match.length) {
			selectedShow = selectedDiv.innerHTML.split(' ').slice(2).join(' ');
		}
		selectedDiv.addEventListener('click', function (e) {
			e.stopPropagation();
			e.stopImmediatePropagation();
			e.preventDefault();
			closeAllSelect(this);
			this.nextSibling.classList.toggle('select-hide');
			this.classList.toggle('select-arrow-active');
			if (!match.length) {
				let thisId;
				shows
					.filter((v) => v.name === this.innerHTML)
					.forEach((el) => (thisId = el.id));
				if (thisId) {
					showId = thisId;
					url = `https://api.tvmaze.com/shows/${showId}/episodes`;
					loadShows();
					allEpisodesLayout();
					document.getElementById('episode-option').innerHTML = this.innerHTML;
					document.getElementById('show-name').innerHTML = this.innerHTML;
					searchBar.placeholder = this.innerHTML;
					backToShows.style.display = 'block';
					searchBar.value = '';
					rootElement.innerHTML = '';
				}
			} else {
				searchBar.value = '';
				let episode = document.querySelectorAll('.wrapper');
				let checkerShow = this.textContent.split(' ').slice(2).join(' ');
				for (let i = 0; i < episode.length; i++) {
					episode[i].style.display = 'block';
					let checker = this.textContent.split(' ').slice(2).join(' ');
					let currentElement = episode[i].firstChild.innerHTML
						.split(' ')
						.slice(0, -2)
						.join(' ');
					if (currentElement === checker) {
						let selectedEpisode = shows[i];
						let selectedElement = episode[i];
						oneEpisodeLayout(selectedEpisode, selectedElement);
					} else if (checker !== selectedShow) {
						episode[i].style.display = 'none';
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
		x = document.getElementsByClassName('select-items');
		y = document.getElementsByClassName('select-selected');
		xl = x.length;
		yl = y.length;
		for (i = 0; i < yl; i++) {
			if (elm == y[i]) {
				arrNo.push(i);
			} else {
				y[i].classList.remove('select-arrow-active');
			}
		}
		for (i = 0; i < xl; i++) {
			if (arrNo.indexOf(i)) {
				x[i].classList.add('select-hide');
			}
		}
	}
	/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
	document.addEventListener('click', closeAllSelect);
};

window.onload = loadShows;
