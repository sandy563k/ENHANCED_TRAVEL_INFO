const express = require('express');
var weather = require('openweather-apis');
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDQbQLlbMxDXov2qKWz7HO0fPMhDgH8OT4'
});
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var { DirectionsInfo } = require('../models/DirectionsInfo');
var { WeatherInfo } = require('../models/WeatherInfo');

//configuring weather
weather.setLang('en');
weather.setUnits('metric');
weather.setAPPID('fb5ec00e3868a8be03f0bbde7fe1125a');

router.post('/', (req, res) => {
  console.log('fetching from maps direction api');
  googleMapsClient.directions({
    origin: req.body.origin,
    destination: req.body.destination,
    mode: req.body.travelMode
  }, function (err, response) {
    if (!err) {
      res.send(response.json);

    }
  });

});

router.post('/weather', (req, res) => {
  console.log('fetching weather details from openweather api');
  console.log('lat:' + req.body.lat + ' ' + 'lng:' + req.body.lng);
  weather.setCoordinate(req.body.lat, req.body.lng);
  weather.getAllWeather(function (err, jsonObject) {
    var text = jsonObject.weather[0]["description"] + ', <b>temperature</b> ' + jsonObject.main.temp;
    res.send(text);

  });
});

module.exports = router;
