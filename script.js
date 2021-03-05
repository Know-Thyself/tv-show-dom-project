//You can edit ALL of the code here
// Getting elements from the DOM
const displayShows = document.getElementById("shows-page-wrapper");
const displayEpisodes = document.getElementById("episodes-page-wrapper");
const rootShows = document.getElementById("root-shows");
const rootEpisodes = document.getElementById("root-episodes");
const navLink = document.getElementById("navigation-link");
const searchBar = document.querySelector(".search-bar");
const searchForEpisodes = document.querySelector(".episodes-search-bar");
const parentDiv = document.getElementsByTagName("div");

//Declaring variables for accessability
let data = []; // Patryk: name should be more specific - to generalize
let parsedData = [];
let showID = 82;

//Getting data from API and passing it as a parameter
const loadShows = async () => {
  try {
    const response = await fetch("https://api.tvmaze.com/shows");
    data = await response.json();
    // Patryk I see that Your shows home page generally is refresh the page. You can try to store the data in global variable and recover "home page" from it. It would be good way to run away from another not neccesary fetch
    let calculatorOfFetches = 0;
    console.log(`${(calculatorOfFetches += 1)} fetches`);
    console.log(data); //to delete in production
    allShows(data);
    showSearch(data);
  } catch (err) {
    console.error(err);
  }
};

const loadEpisodes = async () => {
  try {
    const response = fetch(
      "https://api.tvmaze.com/shows/" + showID + "/episodes"
    );
    parsedData = await (await response).json();

    //Patryk:  Line 32 fetch() is async method so better approach is to await in the line where you call it, not just double await in line 34
    // const response = await fetch(
    //   "https://api.tvmaze.com/shows/" + showID + "/episodes"
    // );
    // parsedData = await response.json();

    console.log(parsedData); //to delete in production
    episodesPage(parsedData);
    episodeSearch(parsedData);
  } catch (err) {
    console.error(err);
  }
};
// Patryk: To huge function, and base on it name, I have no idea what it is doing. You can try to divide it to some helpers function -> check in google "helpers function"
// Patryk: function should always give one answer for the question what is your duty. not always, but generally. Because it is going to make your code easier to maintenance and to find bugs you do not have to struggle a lot
// A function to extract data and populate the webpage.
function allShows(obj) {
  obj.forEach((element) => {
    //Creating elements
    let expandingList = document.createElement("div", { is: "expanding-list" });
    expandingList.setAttribute("class", "expanding-div");
    rootShows.appendChild(expandingList);
    header = document.createElement("h2");
    header.setAttribute("class", "name");
    expandingList.appendChild(header);
    header.innerHTML = `${element.name}`;
    img = document.createElement("img");
    img.setAttribute("class", "episodeImage");
    img.src = element.image.medium;
    expandingList.appendChild(img);

    //Genres, Status, Rating and Runtime
    let genres = document.createElement("h4");
    genres.setAttribute("class", "genres");
    let rating = document.createElement("h4");
    expandingList.appendChild(genres);
    expandingList.appendChild(rating);

    // Giving a bit of space between words and after commas
    let corrected = element.genres.toString().split(",").join(", ");
    genres.innerHTML = `Genres: ${corrected}`;
    rating.innerHTML = `Status: ${element.status}   Rating: ${element.rating.average} Runtime: ${element.runtime}`;
    genres.style.wordSpacing = "5px";
    rating.style.wordSpacing = "5px";

    //Truncated summary text
    const truncatedText = element.summary
      .toString()
      .split(" ")
      .slice(0, 25)
      .join(" ");
    //Unused code, perhaps to be used at some point
    const truncatedText2 = element.summary
      .toString()
      .split(" ")
      .splice(25)
      .join(" ");

    paragraph = document.createElement("p");
    paragraph.setAttribute("class", "summary");
    paragraph.innerHTML = `${truncatedText} ...`;
    let span = document.createElement("span");
    span.setAttribute("class", "more-text summary");
    span.innerHTML = `${element.summary}`;

    //Read more button
    let readMore = document.createElement("button");
    readMore.setAttribute("class", "read-more");
    readMore.innerHTML = `Read more`;
    expandingList.append(paragraph);
    paragraph.appendChild(readMore);

    //Read less button
    let readLess = document.createElement("button");
    readLess.innerHTML = `Read less`;
    readLess.setAttribute("class", "read-less");

    //A condition in which the button won't be necessary
    if (element.summary.length <= truncatedText.length) {
      paragraph.innerHTML = `${truncatedText}`;
      readMore.style.display = "none";
    }

    //An event listener to expand the summary text
    readMore.addEventListener("click", () => {
      expandingList.removeChild(expandingList.lastChild);
      expandingList.appendChild(span);
      span.setAttribute("class", "more-text summary");
      span.style.display = "flex";
      span.appendChild(readLess);
    });

    //An event listener to collapse the summary text
    readLess.addEventListener("click", () => {
      expandingList.removeChild(expandingList.lastChild);
      let paragraph = document.createElement("p");
      expandingList.append(paragraph);
      paragraph.setAttribute("class", "summary");
      paragraph.innerHTML = `${truncatedText}...`;
      paragraph.appendChild(readMore);
      span.style.display = "none";
    });

    //Select a show options
    let selectShows = document.querySelector("#shows");
    let options = document.createElement("option");
    options.innerHTML = `${element.name}`;
    selectShows.appendChild(options);
    let anchorTag = document.createElement("a");
    anchorTag.setAttribute("href", "#");
    options.appendChild(anchorTag);

    // An event listener to fetch a show's episodes data when selected
    selectShows.addEventListener("change", function () {
      displayShows.style.display = "none";
      displayEpisodes.style.display = "block";

      if (`${element.name}` === this.value) {
        `${element.id}`;
        showID = `${element.id}`;
        loadEpisodes();
        navLink.style.display = "block";
        document.getElementById(
          "show-episodes"
        ).innerHTML = `Select from the list of ${element.name} episodes`;
        document.getElementById("show-name").innerHTML = `${element.name}`;
        searchForEpisodes.style.display = "block";
      }
    });
  });
}

// An event listener wrapped inside a function to dynamically update the web page while a user is typing in the search bar.
function showSearch() {
  const searchInfo = document.querySelector(".search-info");
  const searchInfo2 = document.querySelector(".search-info2");

  searchBar.addEventListener("keyup", (e) => {
    // Revealing the hidden information lines
    searchInfo.style.display = "block";
    searchInfo2.style.display = "block";

    //Filtering search results
    let searchValue = e.target.value.toLowerCase();

    let searchResult = data.filter((element) => {
      return (
        element.name.toLowerCase().includes(searchValue) ||
        element.summary.toLowerCase().includes(searchValue) ||
        element.genres.toString().toLowerCase().includes(searchValue)
      );
    });
    while (rootShows.firstChild) {
      rootShows.removeChild(rootShows.firstChild);
    }
    allShows(searchResult);

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
function episodesPage(data) {
  //Patryk: data - for example episodesArr data is to general, function name renderEpisodesPage
  data.forEach((content) => {
    //Creating and appending elements
    const expandingList = document.createElement("div", {
      is: "expanding-list",
    });
    expandingList.setAttribute("id", "episodesDiv");
    expandingList.setAttribute("class", "episodes-expanding-div");
    rootEpisodes.appendChild(expandingList);
    title = document.createElement("h2");
    expandingList.appendChild(title);
    title.innerHTML = `${content.name} S0${content.season}E0${content.number}`;
    title.setAttribute("class", "episode-name");
    img = document.createElement("img");
    img.setAttribute("class", "episodeImage");

    if (content.image) {
      img.src = content.image.medium;
    } else {
      img.src =
        "https://upload.wikimedia.org/wikipedia/commons/2/26/512pxIcon-sunset_photo_not_found.png";
    }
    expandingList.appendChild(img);

    // Truncated summary Text
    episodeSummary = document.createElement("p");
    episodeSummary.setAttribute("class", "summary");
    expandingList.appendChild(episodeSummary);
    let truncatedText;
    if (content.summary) {
      truncatedText = content.summary
        .toString()
        .split(" ")
        .slice(0, 25)
        .join(" ");
      //Unused code that might be needed at some point
      const truncatedText2 = content.summary
        .toString()
        .split(" ")
        .splice(25)
        .join(" ");
    }
    episodeSummary.innerHTML = `${truncatedText} ...`;
    let span = document.createElement("span");
    span.setAttribute("class", "more-text summary");
    span.innerHTML = `${content.summary}`;

    //A read more button
    let readMore = document.createElement("button");
    readMore.setAttribute("class", "read-more");
    readMore.innerHTML = `Read more`;
    expandingList.append(episodeSummary);
    episodeSummary.appendChild(readMore);

    //A read less button
    let readLess = document.createElement("button");
    readLess.innerHTML = `Read less`;
    readLess.setAttribute("class", "read-less");

    //A condition in which the buttons won't be necessary
    if (content.summary && content.summary.length <= truncatedText.length) {
      episodeSummary.innerHTML = `${truncatedText}`;
      readMore.style.display = "none";
    } else if (!content.summary) {
      episodeSummary.innerHTML = "";
      readMore.style.display = "none";
    }

    //An event listener to expand the summary
    readMore.addEventListener("click", () => {
      expandingList.removeChild(expandingList.lastChild);
      expandingList.appendChild(span);
      span.setAttribute("class", "more-text summary");
      span.style.display = "flex";
      span.appendChild(readLess);
    });

    //An event listener to collapse the summary
    readLess.addEventListener("click", () => {
      expandingList.removeChild(expandingList.lastChild);
      let fullEpisodeSummary = document.createElement("p");
      expandingList.append(fullEpisodeSummary);
      fullEpisodeSummary.setAttribute("class", "summary");
      fullEpisodeSummary.innerHTML = `${truncatedText}...`;
      fullEpisodeSummary.appendChild(readMore);
      span.style.display = "none";
    });

    //Select an episode options
    let select = document.getElementById("episodes");
    let options = document.createElement("option");
    options.innerHTML = `S0${content.season}E0${content.number} - ${content.name}`;
    select.appendChild(options);

    // Navigation link to go back to all shows
    navLink.setAttribute("href", window.location.href);

    // An event listener for select option box
    select.addEventListener("change", function () {
      searchForEpisodes.style.display = "none";
      let checker = document.createElement("option");
      checker.innerHTML = this.value.split(" ").slice(2).join(" ");

      //Patryk: base on separation of tasks, You can put your code into CSS file and assign in JS only the classes

      for (let i = 4; i < parentDiv.length; i++) {
        if (!parentDiv[i].innerHTML.includes(checker.innerHTML)) {
          parentDiv[i].style.display = "none";
        } else if (parentDiv[i].innerHTML.includes(checker.innerHTML)) {
          displayEpisodes.style.display = "block";
          parentDiv[i].style.cssText =
            "display: flexbox; width: 90%; height: auto; margin: auto; margin-top: 1rem";
          episodesLink.style.cssText =
            "display: inline-block; margin-right: 3rem";
          navLink.style.display = "inline-block";
        }
      }
    });
  });
}
const episodesLink = document.getElementById("episodes-navigation-link");

// Event listener to go back to episode's page
episodesLink.addEventListener("click", function () {
  loadEpisodes();
  while (rootEpisodes.firstChild) {
    rootEpisodes.removeChild(rootEpisodes.firstChild);
  }
  episodesLink.style.display = "none";
  searchForEpisodes.style.display = "block";
  document.getElementById("episodes").selectedIndex = 0;
});

// A function consisting of an listener to dynamically update the web page based on the user input
function episodeSearch() {
  //Search result information
  const episodeSearchInfo = document.querySelector(".episode-search-info");
  const episodeSearchInfo2 = document.querySelector(".episode-search-info2");

  searchForEpisodes.addEventListener("keyup", (e) => {
    episodeSearchInfo.style.display = "block";
    episodeSearchInfo2.style.display = "block";

    const searchInput = e.target.value.toLowerCase();

    //Filtering the search
    const searchFilter = parsedData.filter((elem) => {
      if (elem.name && elem.summary) {
        return (
          elem.name.toLowerCase().includes(searchInput) ||
          elem.summary.toLowerCase().includes(searchInput)
        );
      }
    });
    episodeSearchInfo.innerHTML = `Displaying ${searchFilter.length}/${parsedData.length} Episodes`;

    while (rootEpisodes.firstChild) {
      rootEpisodes.removeChild(rootEpisodes.firstChild);
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

//Summary:
//Generally ok, You put effort to do this project, what is going to pay You back in future.
//Only few things I noticed but it is just matter of practice like everything!
// Try to keep functions clear and with a clear purpose in head
// long function like allShows(56-170 lines) and episodePage(208 - 329 lines) are  hard to maintenance  and I am quite sure they were the biggest reason of problems in your code.
// check this: https://codeyourfuture.slack.com/archives/C01DU5YUULQ/p1614766881173900   Mark post in our channel where he did good job trying to explain approach to this proj.
// Next time try to manipulate the styling by changing classes in JS -> no more about CSS because I did not implement it yet :P
//Good work :)
