'use strict';

const apiKey = 'AIzaSyBQK_is9a2Ns0LK8pvfpbqHmM0qESAZ7qY'; 


let map;
let service;
let infowindow;

// Get the geolocation of the current location
function generateGeolocation(query,radius){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        sendFindNearByRequest(position.coords.latitude, position.coords.longitude, query,radius)
      });
    } else { 
      $('#js-error-message').text("Geolocation is not supported by this browser.");
    }  
}

function sendFindNearByRequest(lat, lng, query,radius){
  const curLocation = new google.maps.LatLng(-33.8665433,151.1956316);
  

  
  console.log(`lat:${lat},lng:${lng},query:${query},radius:${radius}`);
  const request = {
    location: curLocation,
    radius: radius,
    keyword: query
  };
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, sendGetDetailRequest);
 
}

function sendGetDetailRequest(results, status){
  console.log(results[0]);
  // Put placeID into an array
  const placeId=[];
  if (status === google.maps.places.PlacesServiceStatus.OK){
    for(let i = 0; i < results.length; i++){
      placeId.push(results[i].place_id);
    }
  }
  console.log(placeId);
  // Send Place Details request
  /*const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -33.866, lng: 151.196 },
    zoom: 15,
  });*/
  const request = {
    placeId: placeId[0],
    fields: ["name", "formatted_address", "place_id", "geometry"],
  };
  //const infowindow = new google.maps.InfoWindow();
  //const service = new google.maps.places.PlacesService(map);
  service.getDetails(request, (place, status) => {
    
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
      });
      google.maps.event.addListener(marker, "click", function () {
        infowindow.setContent(
          "<div><strong>" +
            place.name +
            "</strong><br>" +
            "Place ID: " +
            place.place_id +
            "<br>" +
            place.formatted_address +
            "</div>"
        );
        infowindow.open(map, this);
      });
    }
  });
$('#map').show();
}
*/

// function displayResults(results, status) {
//   console.log(results[0]);
//   console.log(results[0].name);
//   $('#results-list').empty();
//   $('#no-result').empty();

//   if(results.length === 0){
//     $('#no-result').text("Sorry, there is no corresponding result.");
//     $('#no-result').addClass('red');
//     $('#no-result').removeClass('hidden');
//   }else{
//     for (let i = 0; i < results.length; i++){
      
//       $('#results-list').append(
//         `<li><h3>${results[i].name}</h3></li>`
//       )};
//   }
//   $('#results').removeClass('hidden');
// }


function initMap() {
  const sydney = new google.maps.LatLng(-33.867, 151.195);
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: sydney,
    zoom: 15,
  });
  
  const request = {
    query: "Museum of Contemporary Art Australia",
    fields: ["name", "geometry"],
  };
  
  service = new google.maps.places.PlacesService(map);
  
 service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
      map.setCenter(results[0].geometry.location);
    }
  });
}

function createMarker(place) {
  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });
  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name);
    infowindow.open(map);
  });
}

function watchForm() {
  initMap();
  $('form').submit(event => {
    event.preventDefault();
    const searchItem = $('#js-search-item').val();
    const radius =$('#js-radius').val();
    generateGeolocation(searchItem,radius);
  });
}

$(watchForm);