# ✨YouTube Video Fetcher

## Overview
This project fetches and displays YouTube videos from the FreeAPI YouTube videos endpoint. It allows users to search for videos by title or channel name and view them directly on YouTube.

## Features
- Fetches YouTube videos using the FreeAPI.
- Displays video thumbnails, titles, and channel names.
- Allows users to search for videos dynamically.
- Clickable video thumbnails redirect to the corresponding YouTube video.

## Technologies Used
- **HTML**: Structure the web page.
- **CSS**: Style the elements.
- **JavaScript**: Fetch and display video data, handle search functionality.
- **FreeAPI YouTube API**: Fetch YouTube videos.

## API Endpoint
- **Base URL:** `https://api.freeapi.app/api/v1/public/youtube/videos`

## Code Explanation
### Fetching Data
```js
const videoContainer = document.querySelector(".link");
const searchBox = document.getElementById("searchBox");
const uri = "https://api.freeapi.app/api/v1/public/youtube/videos";

fetch(uri)
    .then((res) => res.json())
    .then((data) => {
      let videos = data.data.data;
      videos.forEach((video) => {
        let snippet = video.items.snippet;
        videoContainer.innerHTML += `
                      <div class="video">
                        <a href="https://www.youtube.com/watch?v=${video.items.id}">
                        <img src=${snippet.thumbnails.high.url} alt=""/>
                        </a>
                        <p class="Title">${truncateTitle(snippet.title)}.</p>
                        <p class="channelTitle">${snippet.channelTitle}</p>
                        </div>
                    `;
      });
    })
    .catch((err) => console.log(err));
```

### Search Functionality
```js
searchBox.addEventListener("change", (event) => {
  let searchValue = event.target.value.toLowerCase();
  console.log(searchValue);
  videoContainer.innerHTML = "";

  fetch(uri)
    .then((res) => res.json())
    .then((data) => {
      let videos = data.data.data;
      videos.forEach((video) => {
        let snippet = video.items.snippet;
        let videoTitle = snippet.title.toLowerCase();
        let channelTitle = snippet.channelTitle.toLowerCase();

        if (channelTitle.includes(searchValue) || videoTitle.includes(searchValue)) {
          videoContainer.innerHTML += `
                      <div class="video">
                        <a href="https://www.youtube.com/watch?v=${video.items.id}">
                        <img src=${snippet.thumbnails.high.url} width="200" alt=""/>
                        </a>
                        <p class="Title">${truncateTitle(snippet.title)}.</p>
                        <p class="channelTitle">${snippet.channelTitle}</p>
                        </div>
                    `;
        }
      });
    })
    .catch((err) => console.log(err));
});
```

### Title Truncation
```js
function truncateTitle(title, maxLength = 28) {
  return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
}
```

## Usage
1. Open the project in a browser.
2. Videos are fetched and displayed automatically.
3. Use the search bar to filter videos by title or channel name.
4. Click on a video thumbnail to watch it on YouTube.

