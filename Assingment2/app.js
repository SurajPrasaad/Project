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
                        <a href="https://www.youtube.com/watch?v=${video.items.id
        }">
                        <img src=${snippet.thumbnails.high.url}  alt=""/>
                        </a>
                        <p class="Title">${truncateTitle(snippet.title)}.</p>
                        <p class="channelTitle">${snippet.channelTitle}</p>
                        
                        </div>
                    `;
    });
  })
  .catch((err) => console.log(err));


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
        let videoTitle = snippet.title.toLowerCase().trim();
        let channelTitle = snippet.channelTitle.toLowerCase().trim();

        if (
          channelTitle.includes(searchValue) ||
          videoTitle.includes(searchValue)
        ) {
          videoContainer.innerHTML += `
                      <div class="video">
                        <a href="https://www.youtube.com/watch?v=${video.items.id
            }">
                        <img src=${snippet.thumbnails.high.url
            } width="200" alt=""/>
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

function truncateTitle(title, maxLength = 28) {
  return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
}
