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
let searches = JSON.parse(localStorage.getItem("last5Searches")) || {};
let lastKey;

function displayMap(hotels) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: hotels[1].lat, lng: hotels[1].long },
    zoom: 12,
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
      //  console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      hotelList = [{}];
      for (let i = 0; i < data.length; i++) {
        // if (data.sr[i].type == 'CITY' && counter < 1) {
        //   var currentLat = Number(data.sr[i].coordinates.lat);
        //   var currentLong = Number(data.sr[i].coordinates.long);
        //   let Obj = {
        //     lat: currentLat,
        //     long: currentLong
        //   }
        //   hotelList[0] = Obj;
        //   counter++;
        // }
        // let oneDayCard = document.createElement("div");
        // oneDayCard.innerText = data.sr[i].regionNames.shortName;
        // searchResult.append(oneDayCard);
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

// async function fetchHotels(location) {
//   const endpoint = 'https://hotels4.p.rapidapi.com/locations/search';
//   const params = {
//     query: location,
//     locale: 'en_US'
//   };
//   const headers = {
//     'X-RapidAPI-Key': '4f6bf39e07msh56ee2102870e755p1368b1jsnf22f64243de2',
//     'X-RapidAPI-Host': 'hotels4.p.rapidapi.com',
//     'Content-Type': 'application/json'
//   };

//   const url = new URL(endpoint);
//   url.search = new URLSearchParams(params).toString();

//   const response = await fetch(url, { headers });
//   const data = await response.json();

//   console.log(data);
//   for (let i = 0; i < data.suggestions.length; i++) {
//     for (let j = 0; j < data.suggestions[i].entities.length; j++) {
//       let oneDayCard = document.createElement("div");
//       oneDayCard.innerText = data.suggestions[i].entities[j].name;
//       searchResult.append(oneDayCard);
//       console.log (data.suggestions[i].entities[j].geoId);
//       var myObj = {
//         hotelName : data.suggestions[i].entities[j].name,
//         geoId : data.suggestions[i].entities[j].geoId,
//         destinationId : data.suggestions[i].entities[j].destinationId,
//         lat : data.suggestions[i].entities[j].latitude,
//         long : data.suggestions[i].entities[j].longitude
//       }
//       hotelList.push (myObj);
//     }
//   }
//   console.log (hotelList);
//   window.initMap = initMap(hotelList);
// }

// map start

//map end

function saveLast5Searches() {
  // Update the topCityContainer div with the new searches
  $("#topCityContainer").empty();
  for (const key in searches) {
      $("#topCityContainer").append(
        `<button id="x" class = "btn">${key}</button>`
      );
  }
}
saveLast5Searches();

$("#topCityContainer").on("click", function (event) {
  if (event.target.id === "x") {
    citySearch = event.target.innerText;
    searches[citySearch] = 1;
    localStorage.setItem("last5Searches", JSON.stringify(searches));
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
  // .then(data => console.log(data))
  // .catch(error => console.error(error));
});

//Execute a function when the user presses a key on the keyboard
textSearchEl.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    searchEl.click();
  }
});
