//You can edit ALL of the code here
// Getting elements from the DOM 
const rootElem = document.getElementById("root");
const searchBar = document.querySelector(".search-bar");
let selectShows = document.getElementById('shows');
const parentDiv = document.getElementsByTagName('div');
let data = [];

//Getting data from API and passing it as a parameter

const loadShows = async () => {
  try {
    const response = await fetch('https://api.tvmaze.com/shows');
    data = await response.json();
    console.log(data);
    allShows(data);
    searchEvent(data)
  } catch (err){
      console.error(err);
    }
   
}

// A function to extract data and populate the webpage. 
function allShows(obj) {
  obj.forEach(element => {
   
    let expandingList = document.createElement('div', { is : 'expanding-list' });
    expandingList.setAttribute('class', 'expanding-div');
    rootElem.appendChild(expandingList);
    header = document.createElement('h2');
    expandingList.appendChild(header);
    header.innerHTML = `${element.name}` 
    //S0${element.season}E0${element.number}`;
    img = document.createElement('img');
    img.setAttribute('class', 'episodeImage');
    //let usableImg = Object.values(`${element.image}`);
    img.src = element.image.medium; 
    expandingList.appendChild(img);
    paragraph = document.createElement('p');
    paragraph.innerHTML = `${element.summary}`;
    expandingList.appendChild(paragraph);

    //Genres, Status, Rating and Runtime
    let genres = document.createElement('h4');
    //let status = document.createElement('h4');
    let rating = document.createElement('h4');
    //let runtime = document.createElement('h4');
    expandingList.appendChild(genres);
    expandingList.appendChild(rating);
    // Giving a bit of space between words and after commas
    let corrected = element.genres.toString().split(',').join(', ');
  
     
    genres.innerHTML = `Genres: ${corrected}`
    rating.innerHTML = `Status: ${element.status}   Rating: ${element.rating.average} Runtime: ${element.runtime}`; 

    genres.style.wordSpacing = "5px";
    rating.style.wordSpacing = "5px";

    let select = document.querySelector('#shows');
    let options = document.createElement('option');
    options.innerHTML = `${element.name}`;
    select.appendChild(options);

    // An event listener for select option box
    select.addEventListener('change', function(){
      console.log(this.value);
      let checker = document.createElement('h2');
      checker.innerHTML = `${this.value}`;
      // .split(' ').slice(2).join(' ');
      
      for (let i = 3; i < parentDiv.length; i++) {
        if (!parentDiv[i].firstChild.innerHTML.includes(checker.innerHTML)) {
          parentDiv[i].style.display = "none";

        } 
          else if(parentDiv[i].firstChild.innerHTML.includes(checker.innerHTML)) {
            parentDiv[i].style.display = "flex";
            parentDiv[i].style.width = "100%";
            document.querySelector('.hidden-button-container').style.display = "block";
            // once all the functionalities are done, it needs a bit of css styling for small screen sizes
          } 

      }

    })

  });
 
}


// An event listener to dynamically update the web page while a user is typing in the search bar.
function searchEvent () { 

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
    
    for (let i = 3; i < parentDiv.length; i++) {
      if (!parentDiv[i].innerHTML.toLowerCase().includes(searchValue)) {
          parentDiv[i].style.display = "none";

      } else if(parentDiv[i].innerHTML.toLowerCase().includes(searchValue)) {
          parentDiv[i].style.display = "flexbox";
         
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

// An event listener to go back to all episodes
hiddenButton = document.querySelector('.hidden-button');

hiddenButton.addEventListener('click', function() {
  window.location.reload();

})



//window.onload = getAllShows;
/* function setup() {
  
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
 
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

window.onload = setup; */


/* 

function extracted(obj) {
  obj.forEach(element => {
   
    let expandingList = document.createElement('div', { is : 'expanding-list' });
    expandingList.setAttribute('id', 'expandingDiv');
    rootElem.appendChild(expandingList);
    header = document.createElement('h3');
    expandingList.appendChild(header);
    header.innerHTML = `${element.name} S0${element.season}E0${element.number}`;
    img = document.createElement('img');
    img.setAttribute('class', 'episodeImage');
    // let usableImg = Object.values(element.image);
    // console.log(usableImg);
    img.src = element.image.medium; 
    expandingList.appendChild(img);
    paragraph = document.createElement('p');
    paragraph.innerHTML = `${element.summary}`;
    expandingList.appendChild(paragraph);


    let select = document.querySelector('#episodes');
    let options = document.createElement('option');
    options.innerHTML = `S0${element.season}E0${element.number} - ${element.name}`;
    select.appendChild(options);

    const activeOption = document.querySelector('.dropdown-menu');
    // An event listener for select option box
    select.addEventListener('change', function(){
      console.log(this.value);
      let checker = document.createElement('option');
      checker.innerHTML = (this.value).split(' ').slice(2).join(' ');
      
      for (let i = 3; i < parentDiv.length; i++) {
        
        if (!parentDiv[i].firstChild.innerHTML.includes(checker.innerHTML)) {
          parentDiv[i].style.display = "none";
        } 
          else if(parentDiv[i].firstChild.innerHTML.includes(checker.innerHTML)) {
            parentDiv[i].style.display = "block";
            parentDiv[i].style.width = "50%";
            hiddenBtnDiv.style.display = "block";
          
          } 

      }

    })

  });

}



// An event listener to dynamically update the web page while a user is typing in the search bar.
function searchedObj(obj) {
  
  const searchEvent = searchBar.addEventListener('keyup', (e) => {
  // const expandingList = document.getElementById('expandingDiv');
  const searchInfo = document.querySelector('.search-info');
  const searchInfo2 = document.querySelector('.search-info2');
  searchInfo.style.display = "block";
  searchInfo2.style.display = "block";
  
    const searchValue = e.target.value.toLowerCase();
  searchResult = obj.filter((episode) => {
    return (episode.name.toLowerCase().includes(searchValue) || episode.summary.toLowerCase().includes(searchValue));

    })
    searchInfo.innerHTML = `Displaying ${searchResult.length}/${parentDiv.length - 4} Episodes`;
    
    if (searchValue === "") {
      searchInfo.style.display = "none";
      searchInfo2.style.display = "none";
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

 */

/* function selectAShow(arr) {
  
  arr.forEach(element => {
    let shows = document.createElement('option'); 
    shows.setAttribute("id", "`${element.id}`")
    shows.innerHTML = `${element.name}`;
    shows.setAttribute("id", `${element.id}`)
    selectShows.append(shows);

        selectShows.addEventListener('change', function() {
        console.log(this.value);
      
          if (`${element.name}` === this.value) { 
              `${element.id}`;
              showID =`${element.id}`;
              console.log(showID);
              console.log(`${element.id}`);
              let selected = document.getElementById(`${element.id}`)
              console.log(selected);
              console.log(selected.length);


              fetch("https://api.tvmaze.com/shows/"+showID+"/episodes")
              .then(response => response.json())
              .then(data => {
                console.log(data);
                console.log(data.length);
                return data;
              })
              .then(extracted)
              .then(searchedObj)
                
          }
          
        })
  })
} */

window.onload = loadShows;