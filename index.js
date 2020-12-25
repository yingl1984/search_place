'use strict';

const apiKey = 'AIzaSyBQK_is9a2Ns0LK8pvfpbqHmM0qESAZ7qY'; 

let map;
let service;
let infowindow;

//Get the geolocation information by sending HTTP GET request to the Google API endpoint: https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/geocode
function generateGeolocation(query){
  fetch(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${apiKey}`)
  .then(response => response.json())
  .then(response => {
    setUpMap(response.results[0].geometry.location.lat, 
      response.results[0].geometry.location.lng,
      response.results[0].place_id,
      response.results[0].formatted_address)
  })
  .catch(err => {
    $('#js-error-message').removeClass('hidden');
    $('#js-error-message').text(`Something went wrong: ${err.message}`);
  });
}

//Mark the place in the map and show the detail information in the infowindow after clicking the marker
function setUpMap(lat, lng, placeId, formattedAdd)
{
  const latLng = new google.maps.LatLng(lat, lng);

  const mapOptions = {
    center: latLng,
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  let marker = new google.maps.Marker({
    position: latLng,
    title:"Search fun stuff!",
    visible: true
  });

  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  
  const contentString =
  "<div>" +
  "<p><b>Place id</b>: "+placeId+
  "<br><b>Address</b>: "+formattedAdd+
  "</p></div>";
  
  const infowindow = new google.maps.InfoWindow({
    content: contentString
  });
  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });
  marker.setMap(map);

}

function watchForm() {
  $("form").submit((e)=>{
    e.preventDefault();
    $('#js-error-message').addClass('hidden');
    const searchItem = $('#js-search-item').val();
    generateGeolocation(searchItem);
  })
  
}

$(watchForm);