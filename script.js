//You can edit ALL of the code here

let promise = fetch("https://api.tvmaze.com/shows/82/episodes")
.then(response => response.json())

promise.then(extract);

function extract(obj) {
 obj.forEach(element => {

   const rootElem = document.getElementById("root");
   
    let expandingList = document.createElement('div', { is : 'expanding-list' })
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