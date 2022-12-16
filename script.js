// Getting elements from the DOM
const mainElement = document.getElementById('main-wrapper');
const rootElement = document.getElementById('root');
const searchBar = document.querySelector('.search-bar');
const navContainer = mainElement.querySelector('.nav-container');
const customSelectWrapper = document.querySelector('.custom-select-wrapper');
const episodesCustomSelectWrapper = document.querySelector(
	'.episode-custom-select-wrapper'
);
let url = 'https://api.tvmaze.com/shows';
let showsUrl = 'https://api.tvmaze.com/shows';
let sortedShows, episodes, showId, currentShowName;

//Getting shows' api data
const loadShows = async () => {
	try {
		const response = await fetch(url);
		data = await response.json();
		if (url === showsUrl) {
			sortedShows = [...data];
			sortedShows.sort((a, b) => a.name.localeCompare(b.name));
			populatePage(sortedShows);
			search(sortedShows);
			createCustomSelect(sortedShows);
		} else {
			episodes = data;
			populatePage(episodes);
			search(episodes);
			createCustomSelect(episodes);
		}
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
		let figure = document.createElement('figure');
		wrapper.appendChild(figure);
		createImage(elem, figure);
		if (elem.genres) {
			createShowInfo(
				elem.genres,
				elem.status,
				elem.rating.average,
				elem.runtime,
				figure
			);
			createEmptyDiv(wrapper);
		}
		createAndFormatSummary(elem.summary, wrapper);
	});
}

const createShowName = (show, parent) => {
	let showName = document.createElement('h4');
	showName.setAttribute('class', 'name');
	parent.appendChild(showName);
	showName.innerHTML = show.name;
	showName.id = show.id;
	showName.addEventListener('click', showNameEvent);
};

const createEpisodeName = (episode, parent) => {
	let episodeName = document.createElement('h5');
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

let selectEpisode = document.getElementById('select-episode');
const createEpisodeSelectOptions = (episode) => {
	let options = document.createElement('option');
	options.setAttribute('class', 'episodes-option');
	options.innerHTML = `${episodeCode(episode.season, episode.number)} - ${
		episode.name
	}`;
	selectEpisode.appendChild(options);
};

const createShowInfo = (g, s, r, rt, parent) => {
	let corrected = g.toString().split(',').join(', ');
	let figCaption = document.createElement('figcaption');
	parent.appendChild(figCaption);
	let showInfo = document.createElement('section');
	showInfo.className = 'show-info';
	figCaption.appendChild(showInfo);
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
		let truncatedSummary = document.createElement('p');
		truncatedSummary.className = 'summary';
		parent.appendChild(truncatedSummary);
		if (summary.length <= truncatedText.length) {
			truncatedSummary.innerHTML = summary;
		} else {
			truncatedSummary.innerHTML = `${truncatedText} ... <span class="read-more">read more</span>`;
			let fullSummary = document.createElement('p');
			fullSummary.setAttribute('class', 'd-none summary');
			fullSummary.innerHTML = `${summary}<span class="read-less">read less</span>`;
			parent.appendChild(fullSummary);
		}
		let readMoreSpan = document.querySelectorAll('.read-more');
		let readLessSpan = document.querySelectorAll('.read-less');
		readMoreSpan.forEach((el) => el.addEventListener('click', readMore));
		readLessSpan.forEach((el) => el.addEventListener('click', readLess));
	}
};

let selectShow = document.querySelector('#select-show');
const createSelectOptions = (show) => {
	let options = document.createElement('option');
	options.setAttribute('id', `${show.id}`);
	options.setAttribute('class', 'show-options');
	options.innerText = show.name;
	selectShow.appendChild(options);
};

const showNameEvent = (e) => {
	currentShowName = e.target.innerText;
	showId = e.target.id;
	url = `https://api.tvmaze.com/shows/${showId}/episodes`;
	rootElement.innerHTML = '';
	//resetRootAndSelect();
	resetEpisodeSelect();
	loadShows();
	allEpisodesLayout();
	searchBar.value = '';
	navContainer.style.height = 'auto';
	searchInfoWrapper.style.display = 'none';
	episodesCustomSelectWrapper.style.display = 'flex';
	customSelectWrapper.style.display = 'none';
	document.getElementById('episode-option').innerHTML = currentShowName;
	document.getElementById('show-name').innerHTML = currentShowName;
	searchBar.placeholder = currentShowName;
	window.scrollTo(0, 0);
};

const readMore = (e) => {
	let parent = e.target.parentElement.parentElement.parentElement;
	let readMore = e.target.parentElement.parentElement;
	let readLess = e.target.parentElement.parentElement.nextSibling;
	let allParents = rootElement.querySelectorAll('.wrapper');
	readMore.classList.toggle('d-none');
	readLess.classList.toggle('d-none');
	for (let i = 0; i < allParents.length; i++) {
		if (allParents[i].id === parent.id) {
			allParents[i].style.height = '100%';
			allParents[i].style.paddingBottom = '0.5rem';
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
		allParents[i].style.paddingBottom = '0';
	}
};

let customSelectEpisode = document.getElementsByClassName(
	'custom-select-episode'
);
const searchInfoWrapper = document.querySelector('.search-info-wrapper');
const searchInfo = document.querySelector('.search-info');
const search = (arr) => {
	searchBar.addEventListener('keyup', (e) => {
		e.preventDefault();
		let searchValue = e.target.value.toLowerCase();
		searchInfoWrapper.style.display = 'block';
		navContainer.style.height = 'auto';
		backToEpisodes.style.opacity = 0;
		if (!arr[0].status) {
			searchEpisodes(arr, searchValue);
			return;
		} 
		document.querySelector('.header').style.backgroundImage =
			'url(./images/header-bg.webp)';
		document.querySelector('.footer').style.backgroundImage =
			'url(./images/header-bg.webp)';
		let originalImage;
		let searchResult = arr.filter((show) => {
			if (
				show.name.toLowerCase().includes(searchValue) ||
				show.summary
					.replace(/(<([^>]+)>)/gi, '')
					.toLowerCase()
					.includes(searchValue) ||
				show.genres.toString().toLowerCase().includes(searchValue)
			) {
				originalImage = show.image.original;
				return show;
			}
		});
		resetRootAndSelect();
		populatePage(searchResult);
		createCustomSelect(searchResult);
		searchInfo.innerHTML = `Displaying ${searchResult.length}/${arr.length} shows`;
		if (searchResult.length === 1) oneShowLayout(originalImage);
		if (searchValue === '') allShowsLayout();
	});
};

const searchEpisodes = (episodes, val) => {
	let originalImage;
	let searchResult = episodes.filter((episode) => {
		if (
			episode.name.toLowerCase().includes(val) ||
			episode.summary
				.replace(/(<([^>]+)>)/gi, '')
				.toLowerCase()
				.includes(val)
		) {
			originalImage = episode.image.original;
			return episode;
		}
	});
	resetRootAndSelect();
	populatePage(searchResult);
	createCustomSelect(searchResult);
	searchInfo.innerHTML = `Displaying ${searchResult.length}/${episodes.length} episodes`;
	if (searchResult.length === 1) oneEpisodeSearchLayout(searchResult);
	if (searchResult.length > 1) {
		allEpisodesLayout();
		backToEpisodes.style.opacity = '1';
		backToEpisodes.disabled = false;
		backToEpisodes.style.backgroundColor = 'var(--buttons-bg)';
		backToEpisodes.onmouseenter = function () {
			this.style.backgroundColor = 'rgb(36, 33, 33)';
		};
		backToEpisodes.onmouseleave = function () {
			this.style.backgroundColor = 'var(--buttons-bg)';
		};
		backToEpisodes.style.cursor = 'pointer';
	}
	if (val === '') {
		searchInfoWrapper.style.display = 'none';
		searchBar.placeholder = currentShowName;
		allEpisodesLayout();
	}
};

const backToShows = document.getElementById('navigation-link');
backToShows.addEventListener('click', (e) => {
	e.preventDefault();
	rootElement.innerHTML = '';
	resetRootAndSelect();
	populatePage(sortedShows);
	createCustomSelect(sortedShows);
	search(sortedShows);
	allShowsLayout();
	addPlaceholder();
});

const resetRootAndSelect = () => {
	let customSelect = document.getElementById('custom-select');
	while (rootElement.firstChild) {
		rootElement.removeChild(rootElement.firstChild);
	}
	while (customSelect.children.length > 1) {
		customSelect.removeChild(customSelect.lastChild);
	}
	while (customSelectEpisode[0].children.length > 1) {
		customSelectEpisode[0].removeChild(customSelectEpisode[0].lastChild);
	}
	while (selectShow.length > 1) {
		selectShow.removeChild(selectShow.lastChild);
	}
	while (selectEpisode.length > 1) {
		selectEpisode.removeChild(selectEpisode.lastChild);
	}
};

const oneShowLayout = (img) => {
	let currentContainer = rootElement.querySelector('.wrapper');
	backToShows.style.opacity = 1;
	navContainer.style.height = 'auto';
	if (window.innerWidth >= 690) {
		let image = currentContainer.querySelector('img');
		rootElement.style.display = 'block';
		currentContainer.style.width = '70%';
		image.style.objectFit = 'contain';
		image.style.width = '80%';
		image.style.margin = '0 auto';
		image.src = img;
		image.style.maxHeight = '600px';
	}
};

const allShowsLayout = () => {
	rootElement.style.display = 'grid';
	searchBarWrapper.style.display = 'block';
	episodesCustomSelectWrapper.style.display = 'none';
	customSelectWrapper.style.display = 'flex';
	searchInfoWrapper.style.display = 'none';
	searchBar.placeholder = 'Search for shows';
	document.querySelector('.header').style.backgroundImage =
		'url(./images/header-bg.webp)';
	document.querySelector('.footer').style.backgroundImage =
		'url(./images/header-bg.webp)';
	backToShows.style.opacity = 0;
	backToEpisodes.style.opacity = 0;
	navContainer.style.height = '0';
	if (window.innerWidth >= 1340) {
		rootElement.style.width = '97%';
	} else if (window.innerWidth >= 1040) {
		rootElement.style.width = '95%';
	} else if (window.innerWidth >= 690) {
		rootElement.style.width = '90%';
	} else rootElement.style.width = '85%';
	backToEpisodes.disabled = true;
	backToEpisodes.style.backgroundColor = 'gray';
	backToEpisodes.onmouseenter = function () {
		this.style.backgroundColor = 'gray';
	};
	backToEpisodes.onmouseleave = function () {
		this.style.backgroundColor = 'gray';
	};
	backToEpisodes.style.cursor = 'auto';
};

const resetEpisodeSelect = () => {
	while (rootElement.firstChild) {
		rootElement.removeChild(rootElement.firstChild);
	}
	while (customSelectEpisode[0].children.length > 1) {
		customSelectEpisode[0].removeChild(customSelectEpisode[0].lastChild);
	}
	while (selectEpisode.length > 1) {
		selectEpisode.removeChild(selectEpisode.lastChild);
	}
};

const backToEpisodes = document.getElementById('episodes-navigation-link');
backToEpisodes.addEventListener('click', function (e) {
	e.preventDefault();
	resetEpisodeSelect();
	populatePage(episodes);
	allEpisodesLayout();
	createCustomSelect(episodes);
	episodesCustomSelectWrapper.style.display = 'flex';
	customSelectWrapper.style.display = 'none';
	searchBar.value = '';
	searchInfoWrapper.style.display = 'none';
});

const clearPlaceholder = () => {
	searchBar.placeholder = '';
};

const addPlaceholder = () => {
	searchBar.value = '';
	if (customSelectWrapper.style.display !== 'none') {
		searchBar.placeholder = 'Search for shows';
	} else {
		searchBar.placeholder = currentShowName;
	}
};

const searchBarWrapper = document.querySelector('.search-container');

const episodeNameEvent = (e) => {
	let clickedEpisode = episodes.filter((episode) => {
		return (
			episode.name === e.target.innerText.split(' ').slice(0, -2).join(' ')
		);
	});
	resetEpisodeSelect();
	populatePage(clickedEpisode);
	createCustomSelect(clickedEpisode);
	let currentContainer = rootElement.querySelector('.wrapper');
	oneEpisodeLayout(clickedEpisode[0], currentContainer);
	episodesCustomSelectWrapper.style.display = 'none';
};

const allEpisodesLayout = () => {
	document.querySelector('.header').style.backgroundImage =
		"url('./images/darkred-bg.jpg')";
	document.querySelector('.footer').style.backgroundImage =
		"url('./images/darkred-bg.jpg')";
	rootElement.style.display = 'grid';
	searchBarWrapper.style.display = 'block';
	navContainer.style.height = 'auto';
	backToShows.style.opacity = '1';
	navContainer.style.justifyContent = 'space-between';
	if (window.innerWidth >= 1340) {
		rootElement.style.width = '97%';
		navContainer.style.width = '97%';
	} else if (window.innerWidth >= 1040) {
		rootElement.style.width = '95%';
		navContainer.style.width = '95%';
	} else if (window.innerWidth >= 690) {
		rootElement.style.width = '90%';
		navContainer.style.width = '90%';
	} else {
		rootElement.style.width = '85%';
		navContainer.style.width = '85%';
		navContainer.style.margin = '1rem auto';
	}
	backToEpisodes.disabled = true;
	backToEpisodes.style.backgroundColor = 'gray';
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
	episodesCustomSelectWrapper.style.display = 'none';
	let originalSizeImage = arr.map((episode) => episode.image.original);
	let imageElem = currentContainer.querySelector('img');
	if (window.innerWidth >= 690) {
		rootElement.style.width = '70%';
		imageElem.style.maxHeight = '600px';
	} else {
		rootElement.style.width = '90%';
		imageElem.style.height = 'auto';
	}
	imageElem.src = originalSizeImage[0];
	imageElem.style.objectFit = 'contain';
	imageElem.style.width = '80%';
	navContainer.style.margin = '1rem auto';
	navContainer.style.width = '90%';
};

const oneEpisodeLayout = (episode, container) => {
	searchInfoWrapper.style.display = 'none';
	backToEpisodes.style.opacity = '1';
	navContainer.style.marginBottom = '1rem';
	navContainer.style.justifyContent = 'space-between';
	rootElement.style.display = 'block';
	searchBarWrapper.style.display = 'none';
	backToEpisodes.disabled = false;
	backToEpisodes.style.backgroundColor = 'var(--buttons-bg)';
	backToEpisodes.onmouseenter = function () {
		this.style.backgroundColor = 'rgb(36, 33, 33)';
	};
	backToEpisodes.onmouseleave = function () {
		this.style.backgroundColor = 'var(--buttons-bg)';
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

const createCustomSelect = (arr) => {
	let customSelect = document.getElementsByClassName('custom-select');
	if (arr.length && !arr[0].genres) {
		customSelect = document.getElementsByClassName('custom-select-episode');
		episodesCustomSelectWrapper.style.display = 'flex';
		customSelectWrapper.style.display = 'none';
	} else {
		episodesCustomSelectWrapper.style.display = 'none';
		customSelectWrapper.style.display = 'flex';
		document.getElementById('show-option').innerHTML = 'Select a show';
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
				if (
					customSelectWrapper ===
					e.target.parentElement.parentElement.parentElement
				) {
					customSelectWrapper.style.display = 'none';
					episodesCustomSelectWrapper.style.display = 'flex';
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
		let match = arr.filter((show) => (show.genres ? undefined : show));
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
				arr
					.filter((v) => v.name === this.innerHTML)
					.forEach((el) => (thisId = el.id));
				if (thisId) {
					showId = thisId;
					url = `https://api.tvmaze.com/shows/${showId}/episodes`;
					resetEpisodeSelect();
					loadShows();
					allEpisodesLayout();
					document.getElementById('episode-option').innerHTML = this.innerHTML;
					document.getElementById('show-name').innerHTML = this.innerHTML;
					searchBar.placeholder = this.innerHTML;
					currentShowName = this.innerHTML;
					rootElement.innerHTML = '';
					searchBar.value = '';
					searchInfoWrapper.style.display = 'none';
				}
			} else {
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
						let selectedEpisode = arr[i];
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
