
var searchEl = document.getElementById("searchBtn");
var textSearchEl = document.getElementById("citySearch");
var searchResult = document.getElementById("resultsContainer");
var options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '4f6bf39e07msh56ee2102870e755p1368b1jsnf22f64243de2',
    'X-RapidAPI-Host': 'hotels4.p.rapidapi.com'
  }
};
function displayMap(hotels) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: hotels[0].lat, lng: hotels[0].long },
    zoom: 12,
  });

  for (let i = 1; i < hotels.length; i++) {
    let position = { lat: hotels[i].lat, lng: hotels[i].long }
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

var hotelList = [{}];

function fetchHotels(requestUrl) {
  fetch(requestUrl, options)
    .then(function (response) {
    //  console.log(response);
      return response.json();
    })
    .then(function (data) {
      hotelList = [{}];
      var counter = 0;
      for (let i = 0; i < data.sr.length; i++) {
        if (data.sr[i].type == 'CITY' && counter < 1) {
          var currentLat = Number(data.sr[i].coordinates.lat);
          var currentLong = Number(data.sr[i].coordinates.long);
          let Obj = {
            lat: currentLat,
            long: currentLong
          }
          hotelList[0] = Obj;
          counter++;
        }
        if (data.sr[i].type == 'HOTEL') {
          // let oneDayCard = document.createElement("div");
          // oneDayCard.innerText = data.sr[i].regionNames.shortName;
          // searchResult.append(oneDayCard);
          var currentHotelLat = Number(data.sr[i].coordinates.lat);
          var currentHotelLong = Number(data.sr[i].coordinates.long);
          var myObj = {
            hotelName: data.sr[i].regionNames.shortName,
            address: data.sr[i].hotelAddress.street,
            lat: currentHotelLat,
            long: currentHotelLong
          }
          hotelList.push(myObj);
        }
      }
      console.log (hotelList);
      window.initMap = displayMap(hotelList);
    }
    )
}

// async function fetchHotels(location) {
//   const endpoint = 'https://hotels4.p.rapidapi.com/locations/v3/search';
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

searchEl.addEventListener("click", function () {
  citySearch = textSearchEl.value;
  var myArr = citySearch.split(',');
  let cityName = myArr[0]
  var requestUrl = `https://hotels4.p.rapidapi.com/locations/v3/search?q=${cityName}&locale=en_US&langid=1033&siteid=300000001`;
  fetchHotels(requestUrl);
  // .then(data => console.log(data))
  // .catch(error => console.error(error));

});


// Get the input field
  //var input = document.getElementById("myInput");

// Execute a function when the user presses a key on the keyboard
  //input.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
    //if (event.key === "Enter") {
    // Cancel the default action, if needed
    //event.preventDefault();
    // Trigger the button element with a click
    //document.getElementById("myBtn").click();
  //}
//});