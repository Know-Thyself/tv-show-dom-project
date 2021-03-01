//You can edit ALL of the code here
// Getting elements from the DOM 
const displayShows = document.getElementById('shows-page-wrapper');
const displayEpisodes = document.getElementById('episodes-page-wrapper');
const rootShows = document.getElementById("root-shows");
const rootEpisodes = document.getElementById("root-episodes");
const navLink = document.getElementById('navigation-link');
const searchBar = document.querySelector(".search-bar");
const episodesSearch = document.querySelector(".episodes-search-bar");
const parentDiv = document.getElementsByTagName('div');

//Declaring variables for accessability
let data = [];
let parsedData = [];

//Getting data from API and passing it as a parameter
const loadShows = async () => {
  try {
    const response = await fetch('https://api.tvmaze.com/shows');
    data = await response.json();
    console.log(data);
    allShows(data);
    showSearch(data)
  } catch (err){
      console.error(err);
    }
   
}

const loadEpisodes = async () => {
  try {
    const response = fetch("https://api.tvmaze.com/shows/"+showID+"/episodes");
    parsedData = await (await response).json();
    console.log(parsedData);
    episodesPage(parsedData);
    episodeSearch(parsedData);
  } catch (err) {
    console.error(err);
  }
    
}

// A function to extract data and populate the webpage. 
function allShows(obj) {
  obj.forEach(element => {
    
    const rootShows = document.getElementById('root-shows');
    let expandingList = document.createElement('div', { is : 'expanding-list' });
    expandingList.setAttribute('class', 'expanding-div');
    rootShows.appendChild(expandingList);
    header = document.createElement('h2');
    header.setAttribute('class', 'name');
    expandingList.appendChild(header);
    header.innerHTML = `${element.name}` 
    img = document.createElement('img');
    img.setAttribute('class', 'episodeImage');
    img.src = element.image.medium; 
    expandingList.appendChild(img);

    //Genres, Status, Rating and Runtime
    let genres = document.createElement('h4');
    genres.setAttribute('class', 'genres')
    let rating = document.createElement('h4');
    expandingList.appendChild(genres);
    expandingList.appendChild(rating);

    // Giving a bit of space between words and after commas
    let corrected = element.genres.toString().split(',').join(', ');
    genres.innerHTML = `Genres: ${corrected}`
    rating.innerHTML = `Status: ${element.status}   Rating: ${element.rating.average} Runtime: ${element.runtime}`; 
    genres.style.wordSpacing = "5px";
    rating.style.wordSpacing = "5px";

    paragraph = document.createElement('p');
    paragraph.innerHTML = `${element.summary}`;
    expandingList.appendChild(paragraph);

    let selectShows = document.querySelector('#shows');
    let options = document.createElement('option');
    options.innerHTML = `${element.name}`;
    selectShows.appendChild(options);
    let anchorTag = document.createElement('a');
    anchorTag.setAttribute('href', '#');
    options.appendChild(anchorTag);

    // An event listener to fetch a show's episodes data when selected
    selectShows.addEventListener('change', function(){

      displayShows.style.display = 'none';
      displayEpisodes.style.display = 'block';
  
      if (`${element.name}` === this.value) { 
          `${element.id}`;
          showID =`${element.id}`;
          loadEpisodes();
          navLink.style.display = 'block';
      }

    })

  });
 
}


// An event listener wrapped inside a function to dynamically update the web page while a user is typing in the search bar.
function showSearch () { 

  const searchInfo = document.querySelector('.search-info');
  const searchInfo2 = document.querySelector('.search-info2');
  
  searchBar.addEventListener('keyup', (e) => {

    // Revealing the hidden information lines
    searchInfo.style.display = "block";
    searchInfo2.style.display = "block";

    let searchValue = e.target.value.toLowerCase();
   
    let searchResult = data.filter((element) => {
      return (element.name.toLowerCase().includes(searchValue) || element.summary.toLowerCase().includes(searchValue) || element.genres.toString().toLowerCase().includes(searchValue));
    })  
    while(rootShows.firstChild) {
      rootShows.removeChild(rootShows.firstChild)
    }
    allShows(searchResult)
  
    if (searchValue === "") {
      searchInfo.style.display = "none";
      searchInfo2.style.display = "none";
      window.location.reload();
    }
      searchInfo.innerHTML = `Displaying ${searchResult.length}/${data.length} Shows`;
      loadEpisodes();
  });

}

// Populating the episodes' page
function episodesPage(obj) {

  obj.forEach(element => {
    
    const rootEpisodes = document.getElementById('root-episodes');
    const expandingList = document.createElement('div', { is : 'expanding-list' });
    expandingList.setAttribute('id', 'episodesDiv');
    expandingList.setAttribute('class', 'expanding-div');

    rootEpisodes.appendChild(expandingList);
    header = document.createElement('h2');
    expandingList.appendChild(header);
    header.innerHTML = `${element.name} S0${element.season}E0${element.number}`;
    img = document.createElement('img');
    img.setAttribute('class', 'episodeImage');
    img.src = element.image.medium; 
    expandingList.appendChild(img);
    paragraph = document.createElement('p');
    paragraph.innerHTML = `${element.summary}`;
    expandingList.appendChild(paragraph);
    
    let select = document.getElementById('episodes');
    let options = document.createElement('option');
    options.innerHTML = `S0${element.season}E0${element.number} - ${element.name}`;
    select.appendChild(options);

    // Navigation link to go back to all shows
    navLink.setAttribute('href', window.location.href);

    // An event listener for select option box
    select.addEventListener('change', function() {

      let checker = document.createElement('option');
      checker.innerHTML = (this.value).split(' ').slice(2).join(' ');
      
      for (let i = 4; i < parentDiv.length; i++) {
        
        if (!parentDiv[i].innerHTML.includes(checker.innerHTML)) {
          parentDiv[i].style.display = "none";
        } 
          else if(parentDiv[i].innerHTML.includes(checker.innerHTML)) {

            parentDiv[i].style.cssText = "display: flex; width: 98%; height:100%; margin: 2% 2% 0% 1%";
            episodesLink.style.cssText = "display: inline-block; margin-right: 6%";
            displayShows.style.display = "none";
            displayEpisodes.style.display = "block";
            navLink.style.display = "inline-block";
           
          } 

      }

    })

  });

}

const episodesLink = document.getElementById('episodes-navigation-link');

// Event listener to go back to episode's page
episodesLink.addEventListener('click', function() {
  loadEpisodes();
    while(rootEpisodes.firstChild) {
      rootEpisodes.removeChild(rootEpisodes.firstChild)
    }
    episodesLink.style.display = "none";
    episodesSearch.style.display = "inline-block";
    document.getElementById('episodes').selectedIndex = 0;
})

// An event listener to dynamically update the web page while a user is typing in the search bar.
function episodeSearch() {
  
  const episodeSearchInfo = document.querySelector('.episode-search-info');
  const episodeSearchInfo2 = document.querySelector('.episode-search-info2');
  
  
  episodesSearch.addEventListener('keyup', (e) => {

    navLink.style.display = "none";
    episodeSearchInfo.style.display = "block";
    episodeSearchInfo2.style.display = "block";
  
    const searchInput = e.target.value.toLowerCase();

  // Filtering the search
    const searchFilter = parsedData.filter((elem) => {
      return (elem.name.toLowerCase().includes(searchInput) || elem.summary.toLowerCase().includes(searchInput));

    })
    episodeSearchInfo.innerHTML = `Displaying ${searchFilter.length}/${parsedData.length} Episodes`;
    
    while(rootEpisodes.firstChild) {
      rootEpisodes.removeChild(rootEpisodes.firstChild)
    }
    episodesPage(searchFilter);

    if (searchInput === "") {
      episodeSearchInfo.style.display = "none";
      episodeSearchInfo2.style.display = "none";
      navLink.style.display = "inline-block";
    }

  });
  
} 

window.onload = loadShows;