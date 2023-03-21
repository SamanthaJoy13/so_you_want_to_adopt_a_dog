
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
    let oneDayCard = document.createElement ("div")
    oneDayCard.innerHTML= data.suggestions.shift()
    searchResult.append(oneDayCard);
  }


  searchEl.addEventListener("click", function () {
    citySearch = textSearchEl.value;
    console.log(citySearch)
    fetchHotels(citySearch)
    // .then(data => console.log(data))
    // .catch(error => console.error(error));

  
  });






  