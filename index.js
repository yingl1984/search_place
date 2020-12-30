'use strict';

const apiKey = 'AIzaSyBQK_is9a2Ns0LK8pvfpbqHmM0qESAZ7qY'; 
const apiBaseURL_placeDetail='https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json';
const apiBaseURL_geoCode='https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json';

let map;
let service;
let infowindow;

function formatQueryParams(params){
  const queryItems=Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

//Google Place Details API
function placeDetails(query)
{
  const params={
    input: query,
    inputtype: 'textquery',
    fields: 'place_id,formatted_address,name,rating,opening_hours,geometry',
    key:apiKey
  }
  const queryString=formatQueryParams(params);
  const url=apiBaseURL_placeDetail+'?'+queryString;
  fetch(url)
  .then(response=>response.json())
  .then(response => {
    let isOpened = 'N/A';
    if(response.candidates[0].opening_hours){
      isOpened = response.candidates[0].opening_hours.open_now == false ? "No" : "Yes";
    }
    let rating = 'N/A';
    if(response.candidates[0].rating){
      rating = response.candidates[0].rating;
    }
    const contentString =
  "<div>" +
  "<p><strong>Place name</strong>: "+response.candidates[0].name+
  "<br><strong>Address</strong>: "+response.candidates[0].formatted_address+
  "<br><strong>Rating</strong>: "+rating+
  "<br><strong>Opened</strong>: "+isOpened+
  "</p></div>";

    setUpMap(response.candidates[0].geometry.location.lat, 
      response.candidates[0].geometry.location.lng,
      contentString
      )
  })
  .catch(err => {
    $('#map').addClass('hidden');
    $('#js-error-message').removeClass('hidden');
    $('#js-error-message').text(`Something went wrong: ${err.message}`);
  });
}

//Google geoCode API
function generateGeolocation(query){
  const params={
    address: query,
    key: apiKey
  }
  const queryString=formatQueryParams(params);
  const url= apiBaseURL_geoCode+'?'+queryString;
  fetch(url)
  .then(response => response.json())
  .then(response => {
    const contentString =
    "<div>" +
    "<p><strong>Address</strong>: "+response.results[0].formatted_address+
    "</p></div>";
    setUpMap(response.results[0].geometry.location.lat, 
      response.results[0].geometry.location.lng,
      contentString
      )
  })
  .catch(err => {
    $('#map').addClass('hidden');
    $('#js-error-message').removeClass('hidden');
    $('#js-error-message').text(`Something went wrong: ${err.message}`);
  });
}

////Google Map API
function setUpMap(lat, lng, contentString)
{
  const latLng = new google.maps.LatLng(lat, lng);

  const mapOptions = {
    center: latLng,
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  let marker = new google.maps.Marker({
    position: latLng,
    title:"Click to see the place detail information",
    visible: true
  });

  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  
  const infowindow = new google.maps.InfoWindow({
    content: contentString
  });
  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });
  marker.setMap(map);
}

function watchForm() {
  //Pinpoint the place on map
  $("#js-form").submit((e)=>{
    $('#map').removeClass('hidden');
    $('#js-error-message').addClass('hidden');
    e.preventDefault();
    const searchItem = $('#js-search-item').val();
    generateGeolocation(searchItem);
  });
  // Search place users interested in
  $("#place-form").submit((e)=>{
    $('#map').removeClass('hidden');
    $('#js-error-message').addClass('hidden');
    e.preventDefault();
    const placeText = $("#place-item").val();
    placeDetails(placeText);
  }) 
}

$(watchForm);