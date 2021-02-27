//You can edit ALL of the code here
// Getting elements from the DOM 
const displayShows = document.getElementById('shows-page-wrapper');
const displayEpisodes = document.getElementById('episodes-page-wrapper');

const rootElem = document.getElementById("root-shows");
const rootEpisodes = document.getElementById("root-episodes");
const searchBar = document.querySelector(".search-bar");
const parentDiv = document.getElementsByTagName('div');
let data = [];

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

// A function to extract data and populate the webpage. 
function allShows(obj) {
  obj.forEach(element => {
    
    const rootShows = document.getElementById('root-shows');
    let expandingList = document.createElement('div', { is : 'expanding-list' });
    expandingList.setAttribute('class', 'expanding-div');
    rootShows.appendChild(expandingList);
    header = document.createElement('h2');
    expandingList.appendChild(header);
    header.innerHTML = `${element.name}` 
    img = document.createElement('img');
    img.setAttribute('class', 'episodeImage');
    img.src = element.image.medium; 
    expandingList.appendChild(img);
    paragraph = document.createElement('p');
    paragraph.innerHTML = `${element.summary}`;
    expandingList.appendChild(paragraph);

    //Genres, Status, Rating and Runtime
    let genres = document.createElement('h4');
    let rating = document.createElement('h4');
    expandingList.appendChild(genres);
    expandingList.appendChild(rating);

    // Giving a bit of space between words and after commas
    let corrected = element.genres.toString().split(',').join(', ');
    genres.innerHTML = `Genres: ${corrected}`
    rating.innerHTML = `Status: ${element.status}   Rating: ${element.rating.average} Runtime: ${element.runtime}`; 
    genres.style.wordSpacing = "5px";
    rating.style.wordSpacing = "5px";

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
          
          fetch("https://api.tvmaze.com/shows/"+showID+"/episodes")
          .then(response => response.json())
          .then(episodes => {
              console.log(episodes);
              return episodes;
          })
          .then(episodesPage)
          .then(episodeSearch)
          .catch(err => console.error(err))
                
      }

    })

  });
 
}


// An event listener to dynamically update the web page while a user is typing in the search bar.
function showSearch () { 

  searchBar.addEventListener('keyup', (e) => {

    const searchInfo = document.querySelector('.search-info');
    const searchInfo2 = document.querySelector('.search-info2');
    // Revealing the hidden information lines
    searchInfo.style.display = "block";
    searchInfo2.style.display = "block";

    let searchValue = e.target.value.toLowerCase();
   
    let searchResult = data.filter((element) => {
      return (element.name.toLowerCase().includes(searchValue) || element.summary.toLowerCase().includes(searchValue) || element.genres.toString().toLowerCase().includes(searchValue));
    
    })  
    
    for (let i = 4; i < parentDiv.length; i++) {
      if (!parentDiv[i].innerHTML.toLowerCase().includes(searchValue)) {
          parentDiv[i].style.display = "none";

      } else if(parentDiv[i].innerHTML.toLowerCase().includes(searchValue)) {
          parentDiv[i].style.display = "flexbox";
          parentDiv[i].style.marginTop = "0";
         
        } 

    }
  
    if (searchValue === "") {
      searchInfo.style.display = "none";
      searchInfo2.style.display = "none";
      window.location.reload();
    }

    searchInfo.innerHTML = `Displaying ${searchResult.length}/${240} Shows`;
 
  });

}

// Loading episodes page
function episodesPage(obj) {

  obj.forEach(element => {
    
    const rootEpisodes = document.getElementById('root-episodes');
    let expandingList = document.createElement('div', { is : 'expanding-list' });
    expandingList.setAttribute('id', 'expandingDiv');
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

    let navLink = document.getElementById('navigation-link');
    // An event listener for select option box
    select.addEventListener('change', function() {
      console.log(this.value);
      let checker = document.createElement('option');
      checker.innerHTML = (this.value).split(' ').slice(2).join(' ');
      
      for (let i = 4; i < parentDiv.length; i++) {
        
        if (!parentDiv[i].innerHTML.includes(checker.innerHTML)) {
          parentDiv[i].style.display = "none";
        } 
          else if(parentDiv[i].innerHTML.includes(checker.innerHTML)) {
            parentDiv[i].style.display = "flex";
            parentDiv[i].style.width = "100%";
            displayShows.style.display = "none";
            displayEpisodes.style.display = "block";
            buttonContainer.style.display = "";
            navLink.style.display = "inline-block";
            navLink.setAttribute('href', window.location.href);
        
          } 

      }

    })

  });

}

let episodesBtn = document.getElementById("episodes-button");
let buttonContainer = document.getElementById("button-container");

episodesBtn.addEventListener('click', function() {
  // Next step... a button to go back to all episodes

})

// An event listener to dynamically update the web page while a user is typing in the search bar.
function episodeSearch(obj) {
  
  const searchEvent = searchBar.addEventListener('keyup', (e) => {
  
  const searchInfo = document.querySelector('.search-info');
  const searchInfo2 = document.querySelector('.search-info2');
  searchInfo.style.display = "block";
  searchInfo2.style.display = "block";
  
  const searchValue = e.target.value.toLowerCase();
  // Filtering the search
  searchResult = obj.filter((episode) => {
    return (episode.name.toLowerCase().includes(searchValue) || episode.summary.toLowerCase().includes(searchValue));

    })
    searchInfo.innerHTML = `Displaying ${searchResult.length}/${parentDiv.length - 4} Episodes`;

    if (searchValue === "") {
      searchInfo.style.display = "none";
      searchInfo2.style.display = "none";
    }
    for (let i = 4; i < parentDiv.length; i++) {
      if (!parentDiv[i].firstChild.innerHTML.toLowerCase().includes(searchValue) && !parentDiv[i].lastChild.innerHTML.toLowerCase().includes(searchValue)) {
          parentDiv[i].style.display = "none";

      } else if(parentDiv[i].firstChild.innerHTML.toLowerCase().includes(searchValue) || parentDiv[i].lastChild.innerHTML.toLowerCase().includes(searchValue)) {
          parentDiv[i].style.display = "block";
         
        } 

    }

  });
  
} 

window.onload = loadShows;