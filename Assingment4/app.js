const uri = "https://api.freeapi.app/api/v1/public/books";
fetch(uri)
  .then((res) => 
    res.json()
  )
  .then((data) => {
        let image = data.data.data[0].volumeInfo.imageLinks.thumbnail
      console.log(
        data.data.data[0]
    );
  })
  .catch((error) => console.log(error));
