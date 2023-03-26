var searchEl = document.getElementById("searchBtn");
var textSearchEl = document.getElementById("citySearch");
var searchResult = document.getElementById("resultsContainer");
var options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "08f0371562mshaace697a3d212cdp1d709djsn42622047c807",
    "X-RapidAPI-Host": "priceline-com-provider.p.rapidapi.com",
  },
};
var hotelList = [{}];
var searches = JSON.parse(localStorage.getItem("last5Searches")) || {};
let lastKey;
if (Object.keys(searches)[0]){
fetchHotels(`https://priceline-com-provider.p.rapidapi.com/v1/hotels/locations?name=${Object.keys(searches)[0]}&search_type=HOTEL`);
};
function displayMap(hotels) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: hotels[1].lat, lng: hotels[1].long },
    zoom: 12,
    streetViewControl: true,
  });
  for (let i = 1; i < hotels.length; i++) {
    let position = { lat: hotels[i].lat, lng: hotels[i].long };
    const contentString =
      '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      `<h1 id="firstHeading" class="firstHeading">${hotels[i].hotelName}</h1>` +
      '<div id="bodyContent">' +
      `<p><b>Address: ${hotels[i].address}</b></p>` +
      "</div>" +
      "</div>";
    const infowindow = new google.maps.InfoWindow({
      content: contentString,
      ariaLabel: hotels[i].hotelName,
    });
    const marker = new google.maps.Marker({
      position: position,
      map,
      title: hotels[i].hotelName,
    });
    marker.addListener("click", () => {
      infowindow.open({
        anchor: marker,
        map,
      });
    });
 
  }

  infoWindow = new google.maps.InfoWindow();
}

function fetchHotels(requestUrl) {
  fetch(requestUrl, options)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      hotelList = [{}];
      for (let i = 0; i < data.length; i++) {
        var myObj = {
          hotelName: data[i].itemName,
          address: data[i].address,
          lat: data[i].lat,
          long: data[i].lon,
        };
        hotelList.push(myObj);
      }
      console.log(hotelList);
      window.initMap = displayMap(hotelList);
    });
}

function saveLast5Searches() {
  $("#topCityContainer").empty();
  for (const key in searches) {
    $("#topCityContainer").append(
      `<button id="x" class = "mt-4 btn">${key}</button>`
    );
  }
}
saveLast5Searches();

$("#topCityContainer").on("click", function (event) {
  if (event.target.id === "x") {
    citySearch = event.target.innerText;
    saveLast5Searches();
    let requestUrl = `https://priceline-com-provider.p.rapidapi.com/v1/hotels/locations?name=${citySearch}&search_type=HOTEL`;
    fetchHotels(requestUrl);
  }
});

searchEl.addEventListener("click", function () {
  citySearch = textSearchEl.value;
  let myArr = citySearch.split(",");
  let cityName = myArr[0] + " " + myArr[1];
  let cityToUppercase = cityName.toUpperCase();
  searches[cityToUppercase] = 1;
  localStorage.setItem("last5Searches", JSON.stringify(searches));
  saveLast5Searches();
  let requestUrl = `https://priceline-com-provider.p.rapidapi.com/v1/hotels/locations?name=${cityToUppercase}&search_type=HOTEL`;
  fetchHotels(requestUrl);
});

textSearchEl.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchEl.click();
  }
});
