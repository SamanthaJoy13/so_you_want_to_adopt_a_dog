
var searchEl = document.getElementById("searchBtn")
var textSearchEl = document.getElementById("citySearch")
var searchResult = document.getElementById("resultsContainer")

async function fetchHotels(location) {
  const endpoint = 'https://hotels4.p.rapidapi.com/locations/search';
  const params = {
    query: location,
    locale: 'en_US'
  };
  const headers = {
    'X-RapidAPI-Key': '4f6bf39e07msh56ee2102870e755p1368b1jsnf22f64243de2',
    'X-RapidAPI-Host': 'hotels4.p.rapidapi.com',
    'Content-Type': 'application/json'
  };

  const url = new URL(endpoint);
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url, { headers });
  const data = await response.json();

  console.log(data);
  for (let i = 0; i < data.suggestions.length; i++) {
    for (let j = 0; j < data.suggestions[i].entities.length; j++) {
      let oneDayCard = document.createElement("div");
      oneDayCard.innerText = data.suggestions[i].entities[j].name;
      searchResult.append(oneDayCard);
      console.log (data.suggestions[i].entities[j].geoId);
    }
  }
}


searchEl.addEventListener("click", function () {
  citySearch = textSearchEl.value;
  console.log(citySearch);
  fetchHotels(citySearch);
  // .then(data => console.log(data))
  // .catch(error => console.error(error));


});






