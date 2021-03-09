//You can edit ALL of the code here
// Getting elements from the DOM 
const displayShows = document.getElementById('shows-page-wrapper');
const displayEpisodes = document.getElementById('episodes-page-wrapper');
const rootShows = document.getElementById("root-shows");
const rootEpisodes = document.getElementById("root-episodes");
const searchBar = document.querySelector(".search-bar");
const searchForEpisodes = document.querySelector(".episodes-search-bar");
const parentDiv = document.getElementsByTagName('div');

//Declaring variables for accessability
let data = [];
let parsedData = [];

//Getting data from API and passing it as a parameter
const loadShows = async () => {
  try {
    const response = await fetch('https://api.tvmaze.com/shows');
    data = await response.json();
    populateShowsPage(data);
    showSearch(data)
  } catch (err){
      console.error(err);
    }
   
}

// A function to extract data and populate the webpage. 
function populateShowsPage(obj) {
  obj.forEach(show => {
    
    //Creating elements
    let expandingList = document.createElement('div', { is : 'expanding-list' });
    expandingList.setAttribute('class', 'expanding-div');
    rootShows.appendChild(expandingList);
    showName = document.createElement('h2');
    showName.setAttribute('class', 'name');
    expandingList.appendChild(showName);
    showName.innerHTML = show.name;
    let aTag = document.createElement('a');
    aTag.setAttribute('href', '#');
    aTag.setAttribute('id', `${show.id}`);
    showName.append(aTag);
    
    //An event listener to link names of shows to their episodes pages
    showName.addEventListener('click', () => {
      showID = aTag.id;
      loadEpisodes();
      displayShows.style.display = 'none';
      displayEpisodes.style.display = 'block';
      searchForEpisodes.style.display = 'block';
      navLink.style.display = 'block';
      document.getElementById('show-episodes').innerHTML = `Episodes of ${show.name}`;
      document.getElementById('show-name').innerHTML = show.name;
      searchForEpisodes.placeholder = `Search for ${show.name}'s episodes`;
    });

    img = document.createElement('img');
    img.src = show.image.medium; 
    expandingList.appendChild(img);

    //Genres, Status, Rating and Runtime
    let genres = document.createElement('h4');
    genres.setAttribute('class', 'genres')
    let rating = document.createElement('h4');
    expandingList.appendChild(genres);
    expandingList.appendChild(rating);

    // Giving a bit of space between words and after commas
    let corrected = show.genres.toString().split(',').join(', ');
    genres.innerHTML = `Genres: ${corrected}`
    rating.innerHTML = `Status: ${show.status}   Rating: ${show.rating.average} Runtime: ${show.runtime}`; 
    genres.style.wordSpacing = "5px";
    rating.style.wordSpacing = "5px";
    
    //Truncated summary text
    const truncatedText = show.summary.toString().split(' ').slice(0, 25).join(' ');
    //Unused code, perhaps to be used at some point
    const truncatedText2 = show.summary.toString().split(' ').splice(25).join(' ');
    
    paragraph = document.createElement('p');
    paragraph.setAttribute('class', 'summary');
    paragraph.innerHTML = `${truncatedText} ...`;
    let span = document.createElement('span');
    span.setAttribute('class', 'more-text summary');
    span.innerHTML = show.summary;
    
    //Read more button
    let readMore = document.createElement('button');
    readMore.setAttribute('class', 'read-more');
    readMore.innerHTML = `Read more`;
    expandingList.append(paragraph);
    paragraph.appendChild(readMore); 
    
    //Read less button
    let readLess = document.createElement('button');
    readLess.innerHTML = `Read less`;
    readLess.setAttribute('class', 'read-less');
    
    //A condition in which read more button won't be necessary
    if (show.summary.length <= truncatedText.length) {
      paragraph.innerHTML = truncatedText;
      readMore.style.display = "none";
    }
    
    //An event listener to expand the summary text
    readMore.addEventListener('click', () => {
      expandingList.removeChild(expandingList.lastChild);
      expandingList.appendChild(span);
      span.setAttribute('class', 'more-text summary');
      span.style.display = 'flex';
      span.appendChild(readLess);

    })
    
    //An event listener to collapse the summary text
    readLess.addEventListener('click', () => {
      expandingList.removeChild(expandingList.lastChild);
      let paragraph = document.createElement('p');
      expandingList.append(paragraph);
      paragraph.setAttribute('class', 'summary')
      paragraph.innerHTML = `${truncatedText}...`;
      paragraph.appendChild(readMore);
      span.style.display = 'none';

    })
    
    //Select a show options
    let selectShows = document.querySelector('#shows');
    let options = document.createElement('option');
    options.setAttribute('id', `${show.id}`);
    options.setAttribute('class', 'show-options');
    options.innerHTML = show.name;
    selectShows.appendChild(options);
    
    // An event listener to fetch a show's episodes data when selected
    selectShows.addEventListener('change', function(){
    
      if (show.name === this.value) { 
        showID = show.id;
        loadEpisodes();
        document.getElementById('show-episodes').innerHTML = `Episodes of ${show.name}`;
        document.getElementById('show-name').innerHTML = show.name;
        searchForEpisodes.placeholder = `Search for ${show.name}'s episodes`; 
      }

      navLink.style.display = 'block';
      searchForEpisodes.style.display = 'block';
      searchBar.value = "";
      displayShows.style.display = 'none';
      displayEpisodes.style.display = 'block';
      rootEpisodes.innerHTML = "";

    })

  });
 
}

//Async function to fetch episodes' data 
const loadEpisodes = async () => {
  try {
    const response = fetch("https://api.tvmaze.com/shows/"+showID+"/episodes");
    parsedData = await (await response).json();
    populateEpisodesPage(parsedData);
    episodeSearch(parsedData);
  } catch (err) {
    console.error(err);
  }
    
}

const searchInfo = document.querySelector('.search-info');
const searchInfo2 = document.querySelector('.search-info2');

// An event listener wrapped inside a function to dynamically update the web page while a user is typing in the search bar.
function showSearch () { 
  
  searchBar.addEventListener('keyup', (e) => {

    // Revealing the hidden information lines
    searchInfo.style.display = "block";
    searchInfo2.style.display = "block";
    
    //Filtering search results
    let searchValue = e.target.value.toLowerCase();
   
    let searchResult = data.filter((show) => {
      return (show.name.toLowerCase().includes(searchValue) || show.summary.toLowerCase().includes(searchValue) || show.genres.toString().toLowerCase().includes(searchValue));
    })  
    while(rootShows.firstChild) {
      rootShows.removeChild(rootShows.firstChild)
    }
    populateShowsPage(searchResult)
  
    if (searchValue === "") {
      searchInfo.style.display = "none";
      searchInfo2.style.display = "none";
      loadShows();
    }
    searchInfo.innerHTML = `Displaying ${searchResult.length}/${data.length} Shows`;

  });

}
// Navigation link to go back to shows home page. NB: the link works without the event listener. I added the event listener for the sake of speed.
const navLink = document.getElementById('navigation-link');
navLink.setAttribute('href', window.location.href);
navLink.addEventListener('click', () => {
  loadShows();
  searchForEpisodes.value = "";
})

// Populating the episodes' page
function populateEpisodesPage(data) {

  data.forEach(episode => {
    
    //Creating and appending elements
    const expandingList = document.createElement('div', { is : 'expanding-list' });
    expandingList.setAttribute('id', 'episodesDiv');
    expandingList.setAttribute('class', 'episodes-expanding-div');
    rootEpisodes.appendChild(expandingList);
    episodesName = document.createElement('h2');
    expandingList.appendChild(episodesName);
    let formattedSeasonNumber = (`0${episode.season}`).slice(-2);
    let formattedEpisodeNumber = (`0${episode.number}`).slice(-2);
    episodesName.innerHTML = `${episode.name} - S${formattedSeasonNumber}E${formattedEpisodeNumber}`;
    episodesName.setAttribute('class', 'episode-name')
    img = document.createElement('img');
  
    if(episode.image) {
      img.src = episode.image.medium;
    } else {
      img.src = "https://upload.wikimedia.org/wikipedia/commons/2/26/512pxIcon-sunset_photo_not_found.png";
    }
    expandingList.appendChild(img);

    //Select an episode options
    let selectEpisode = document.getElementById('episodes');
    let options = document.createElement('option');
    options.setAttribute('class', 'episodes-option');
    options.innerHTML = `S${formattedSeasonNumber}E${formattedEpisodeNumber} - ${episode.name}`;
    selectEpisode.appendChild(options);

    // Truncated summary Text
    episodeSummary = document.createElement('p');
    episodeSummary.setAttribute('class', 'summary');
    expandingList.appendChild(episodeSummary);
    let truncatedText;

    if(episode.summary) { 
      truncatedText = episode.summary.toString().split(' ').slice(0, 25).join(' ');
      //Unused code that might be needed at some point
      const truncatedText2 = episode.summary.toString().split(' ').splice(25).join(' ');
    }
    episodeSummary.innerHTML = `${truncatedText} ...`;
    let span = document.createElement('span');
    span.setAttribute('class', 'more-text summary');
    span.innerHTML = episode.summary;

    //A read more button
    let readMore = document.createElement('button');
    readMore.setAttribute('class', 'read-more');
    readMore.innerHTML = `Read more`;
    expandingList.append(episodeSummary);
    episodeSummary.appendChild(readMore); 
    
    //A read less button
    let readLess = document.createElement('button');
    readLess.innerHTML = `Read less`;
    readLess.setAttribute('class', 'read-less');
    
    //A condition in which the buttons won't be necessary
    if (episode.summary && episode.summary.length <= truncatedText.length) {
      episodeSummary.innerHTML = truncatedText;
      readMore.style.display = "none";
    } else if (!episode.summary) {
      episodeSummary.innerHTML = "";
      readMore.style.display = "none";
    }
    
    //An event listener to expand the summary
    readMore.addEventListener('click', () => {

      expandingList.removeChild(expandingList.lastChild);
      expandingList.appendChild(span);
      span.setAttribute('class', 'more-text summary');
      span.style.display = 'flex';
      span.appendChild(readLess);

    });

    //An event listener to collapse the summary
    readLess.addEventListener('click', () => {

      expandingList.removeChild(expandingList.lastChild);
      let fullEpisodeSummary = document.createElement('p');
      expandingList.append(fullEpisodeSummary);
      fullEpisodeSummary.setAttribute('class', 'summary')
      fullEpisodeSummary.innerHTML = `${truncatedText}...`;
      fullEpisodeSummary.appendChild(readMore);
      span.style.display = 'none';

    });

  });

}

// An event listener for episodes' select option box
let selectEpisode = document.getElementById('episodes');
selectEpisode.addEventListener('change', function() {

  searchForEpisodes.value = "";
  searchForEpisodes.style.display = 'none';
  let checker = document.createElement('option');
  
  checker.innerHTML = (this.value).split(' ').slice(2).join(' ');
      
  for (let i = 0; i < parentDiv.length; i++) {
        
    if (!parentDiv[i].innerHTML.includes(checker.innerHTML)) {
          parentDiv[i].style.display = "none";
    } 
    else {
      episodesLink.style.display = "inline-block";
      navLink.style.display = "inline-block";
    } 

  }
  selectEpisode.style.display = "none";

});

const episodesLink = document.getElementById('episodes-navigation-link');

// Event listener to go back to episodes page
episodesLink.addEventListener('click', function() {
  while(rootEpisodes.firstChild) {
        rootEpisodes.removeChild(rootEpisodes.firstChild)
  }
  loadEpisodes();
  document.getElementById('episodes').selectedIndex = 0;
  episodesLink.style.display = "none";
  searchForEpisodes.style.display = "block";
  episodeSearchInfo.style.display = "none";
  episodeSearchInfo2.style.display = "none";
  searchForEpisodes.value = "";
  selectEpisode.style.display = "block";
  document.querySelector('.episode-search-container').style.display = "block";

});

//Search result information
const episodeSearchInfo = document.querySelector('.episode-search-info');
const episodeSearchInfo2 = document.querySelector('.episode-search-info2');

// A function consisting of an event listener and a filter to dynamically update the web page based on the user input 
function episodeSearch() {
  
  searchForEpisodes.addEventListener('keyup', (e) => {

    episodeSearchInfo.style.display = "block";
    episodeSearchInfo2.style.display = "block";
  
    const searchInput = e.target.value.toLowerCase();

    //Filtering the search
    const searchFilter = parsedData.filter((episode) => {
      if (episode.name && episode.summary) { 
        return (episode.name.toLowerCase().includes(searchInput) || episode.summary.toLowerCase().includes(searchInput));
      }

    })
    episodeSearchInfo.innerHTML = `Displaying ${searchFilter.length}/${parsedData.length} Episodes`;
    
    while(rootEpisodes.firstChild) {
      rootEpisodes.removeChild(rootEpisodes.firstChild);
    }
    populateEpisodesPage(searchFilter);

    if (searchInput === "") {
      episodeSearchInfo.style.display = "none";
      episodeSearchInfo2.style.display = "none";
      navLink.style.display = "inline-block";
    }

  });
  
} 

window.onload = loadShows;