'use strict';

const apiKey = 'AkykgVoBSrnMyZ1kwuQnifxHZK_buU9Ammgz9gccKxA5aon4rGccs9u1sOeG5BJE'; 
const find_location_baseURL='http://dev.virtualearth.net/REST/v1/Locations';
const local_search_baseURL = 'https://dev.virtualearth.net/REST/v1/LocalSearch/';
const get_static_map_baseURL='https://dev.virtualearth.net/REST/v1/Imagery/Map/Road/';
let geoLocation=[0,0];

// function formatQueryParams(params) {
//   const queryItems = Object.keys(params)
//     .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
//   return queryItems.join('&');
// }

// function generateAddress(addressArray){
//   console.log(addressArray);
//   let result = "";
//   for(let i = 0; i < addressArray.length; i++){
//     let curStr=Object.keys(addressArray[i]).filter(key => addressArray[i][key] != "")
//     .map(key => `${key}=${addressArray[i][key]}`);

//     result += `<strong>The ${i + 1} address is: </strong>${curStr.map(item=>`<p>${item},</p>`).join("")}`
//   }
//   return result;
// }

// function displayResults(responseJson) {
//   console.log(responseJson);
//   $('#results-list').empty();
//   $('#no-result').empty();
//   if(responseJson.data.length === 0){
//     $('#no-result').text("Sorry, there is no corresponding result.");
//     $('#no-result').addClass('red');
//     $('#no-result').removeClass('hidden');
//   }else{
//     for (let i = 0; i < responseJson.data.length; i++){
//       const address=generateAddress(responseJson.data[i].addresses);
//       $('#results-list').append(
//         `<li><h3>${responseJson.data[i].fullName}</h3>
//         <p><a href=${responseJson.data[i].url} target=_black>Click here to explore</a></p>
//         <p><em>Description: </em></p><p>${responseJson.data[i].description}</p> 
//         <div>
//           <h4>Address: </h4>
//           <p>${address}</p> 
//         </div>
//         </li>`
//       )};
//   }
//   $('#results').removeClass('hidden');
// };
function displayCurrentPosition(position){
  geoLocation[0]=position.coords.latitude;
  geoLocation[1]=position.coords.longitude;
  // console.log(geoLocation);
  // alert("Latitude: " + position.coords.latitude + ", Longitude: " + position.coords.longitude);
}
function setGeoLocation(responseJson){
  geoLocation[0]=responseJson.resourceSets[0].resources[0].point.coordinates[0];
  geoLocation[1]=responseJson.resourceSets[0].resources[0].point.coordinates[1];
  console.log(`${geoLocation[0]} & geoLocation[1]`);
  debugger;
}

function getPositionByAddress(address){
  const queryString = `locality=${address}&maxResults=5&key=${apiKey}`;
  // const url=find_location_baseURL + '?' + queryString;
  const url="http://dev.virtualearth.net/REST/v1/Locations/US/WA/98052/Redmond/1%20Microsoft%20Way?o=json&key=AkykgVoBSrnMyZ1kwuQnifxHZK_buU9Ammgz9gccKxA5aon4rGccs9u1sOeG5BJE";
  console.log(url);
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => setGeoLocation(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function generateGeolocation(address){
  debugger;
  if(address==="Current Location"){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(displayCurrentPosition);
    } else { 
      $('#js-error-message').text("Geolocation is not supported by this browser.");
    }
  }else{
    getPositionByAddress(address);
  }
}

function getResultsList(query, address, radius) {
  generateGeolocation(address);
  console.log(geoLocation[0]);
  debugger;
  const params = {
    limit: maxResults,
    q: query,
    api_key: apiKey
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });

}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchItem = $('#js-search-item').val();
    const address = $('#js-address').val();
    const radius = $('#js-radius').val();

    getResultsList(searchItem, address, radius);
  });
}

$(watchForm);