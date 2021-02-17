//You can edit ALL of the code here
// Getting elements from the DOM 
const rootElem = document.getElementById("root");
const searchBar = document.querySelector(".search-bar");
let searchResult;

// Getting data from API and parsing it into a json file
let request = fetch("https://api.tvmaze.com/shows/82/episodes")
const promisedEpisodes = request.then(response => response.json())

// And then passing the data into functions to generate content to the webpage
const extractedEpisodes = promisedEpisodes.then(extracted)
promisedEpisodes.then(searchedObj)

// A function to extract and transform the data into a webpage. 
function extracted(obj) {
  obj.forEach(element => {
   
    let expandingList = document.createElement('div', { is : 'expanding-list' });
    rootElem.appendChild(expandingList);
    header = document.createElement('h3');
    expandingList.appendChild(header);
    header.innerHTML = `${element.name} S0${element.season}E0${element.number}`;
    img = document.createElement('img');
    img.src = element.image.medium; 
    expandingList.appendChild(img);
    paragraph = document.createElement('p');
    paragraph.innerHTML = `${element.summary}`;
    expandingList.appendChild(paragraph);

  });

}

// An event listener to dynamically update the web page while a user is typing in the search bar.
function searchedObj(obj) {
  
  const searchEvent = searchBar.addEventListener('keyup', (e) => {
  const parentDiv = document.getElementsByTagName('div');
  const searchInfo = document.querySelector('.search-info');
  searchInfo.style.display = "block";
  
    const searchValue = e.target.value.toLowerCase();
    searchResult = obj.filter((episode) => {
    return (episode.name.toLowerCase().includes(searchValue) || episode.summary.toLowerCase().includes(searchValue));

    })
    searchInfo.innerHTML = `Displaying ${searchResult.length}/73 Episodes`;
    
    if (searchValue === "") {
      searchInfo.style.display = "none";
    }
    for (let i = 3; i < 76; i++) {
      if (!parentDiv[i].firstChild.innerHTML.toLowerCase().includes(searchValue) && !parentDiv[i].lastChild.innerHTML.toLowerCase().includes(searchValue)) {
          parentDiv[i].style.display = "none";

      } else if(parentDiv[i].firstChild.innerHTML.toLowerCase().includes(searchValue) || parentDiv[i].lastChild.innerHTML.toLowerCase().includes(searchValue)) {
          parentDiv[i].style.display = "block";
          
        } 
    }

  });
} 

/* function setup() {
  
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
 
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

window.onload = setup;
 */