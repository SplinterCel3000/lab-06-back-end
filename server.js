'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());

// Routes
app.get('/location', (request, response) => {
  let city = request.query.data;

  let locationObj = searchLatToLong(city);

  response.send(locationObj);

  console.log(locationObj);
})


function searchLatToLong(city){
  const geoData = require('./data/geo.json');

  const geoDataResults = geoData.results[0];

  const locationObj = new Location(city, geoDataResults);
  // const locationObj = {
  //   "search_query": city,
  //   "formatted_query": geoDataResults.formatted_address,
  //   "latitude": geoDataResults.geometry.location.lat,
  //   "longitude": geoDataResults.geometry.location.lng
  // }

  return locationObj;
}

function Location(city, geoDataResults){
  this.search_query = city;
  this.formatted_query = geoDataResults.formatted_address;
  this.latitude = geoDataResults.geometry.location.lat;
  this.longitude = geoDataResults.geometry.location.lng;
}


app.get('/weather', (request, response) => {

  let weatherObj = searchWeather();

  response.send(weatherObj);

  console.log(weatherObj);
})

function searchWeather(){
  const weatherDataResults = require('./data/darksky.json');
  let weatherArray = [];
  for(let i = 0; i < weatherDataResults.daily.data.length; i++){
  weatherArray.push(new Weather(weatherDataResults.daily.data[i]));

  }
  


  return weatherArray;

}

function Weather(weatherDataResults){
  this.time = weatherDataResults.time;
  this.forecast = weatherDataResults.summary;
}

app.get('*', (request, response) => {
  response.status(404).send('Page not found');
})


app.listen(PORT, () => console.log(`listening on port ${PORT}!`))