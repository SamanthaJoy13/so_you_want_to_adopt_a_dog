
var searchEl = document.getElementById("searchBtn");
var textSearchEl = document.getElementById("citySearch");
var searchResult = document.getElementById("resultsContainer");
var hotelList = [{}];

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
      var myObj = {
        hotelName : data.suggestions[i].entities[j].name,
        geoId : data.suggestions[i].entities[j].geoId,
        destinationId : data.suggestions[i].entities[j].destinationId,
        lat : data.suggestions[i].entities[j].latitude,
        long : data.suggestions[i].entities[j].longitude
      }
      hotelList.push (myObj);
    }
  }
  console.log (hotelList);
  window.initMap = initMap(hotelList);
}

// map start


function initMap(hotels) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: hotels[1].lat, lng: hotels[1].long },
    zoom: 10,
  });

  for (let i = 0; i < hotels.length; i++) {
  let position = { lat: hotels[i].lat, lng: hotels[i].long }
  const contentString =
  '<div id="content">' +
  '<div id="siteNotice">' +
  "</div>" +
  `<h1 id="firstHeading" class="firstHeading">${hotels[i].hotelName}</h1>` +
  '<div id="bodyContent">' +
  "<p><b>Uluru</b></p>" +
  '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
  "https://en.wikipedia.org/w/index.php?title=Uluru</a> " +
  "(last visited June 22, 2009).</p>" +
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

  const locationButton = document.createElement("button");

  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(
    locationButton
  );
  locationButton.addEventListener("click", () => {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}


//map end

searchEl.addEventListener("click", function () {
  citySearch = textSearchEl.value;
  console.log(citySearch);
  fetchHotels(citySearch);
  // .then(data => console.log(data))
  // .catch(error => console.error(error));


});






