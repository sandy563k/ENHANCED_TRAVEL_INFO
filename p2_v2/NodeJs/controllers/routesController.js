const express = require('express');
var weather = require('openweather-apis');
const googleMapsClient = require('@google/maps').createClient({
    key: 'YOUR_API_KEY'
  });
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var { DirectionsInfo } = require('../models/DirectionsInfo');
var { WeatherInfo } = require('../models/WeatherInfo');

//configuring weather
weather.setLang('en');
weather.setUnits('metric');
weather.setAPPID('YOUR_API_KEY');

//this url fetches directions data and sends it to client on request
router.post('/',(req,res) =>{
//first fetching from db , if not exists fetch from api
var query = DirectionsInfo.find({ 'origin': req.body.origin, 'destination': req.body.destination});
    query.exec(function (err, dInfo) {
    if (err || dInfo.length === 0) {
      console.log('no directions record found in database , fetching from api');
      googleMapsClient.directions({
        origin: req.body.origin,
        destination: req.body.destination,
        mode: req.body.travelMode
    }, function(err, response) {
      if (!err) {
       saveDirectionsInfo(req.body.origin,req.body.destination,response.json);
       res.send(response.json);
        
      }
    });

    }else{
      console.log('directions record found , sending database record');
      res.send(dInfo[0]);
    }
  });

});

//this url fetches weather data and sends it to client on request
router.post('/weather',(req,res) =>{

  //first fetch from db
  var query = WeatherInfo.find({ 'latitude': req.body.lat,'longitude': req.body.lng });
  query.exec(function (err, wInfo) {
    if (err || wInfo.length===0){
      console.log('no weather record found in database , fetching from api');
      console.log('lat:'+req.body.lat+' '+'lng:'+req.body.lng);
      weather.setCoordinate(req.body.lat, req.body.lng);
      weather.getAllWeather(function(err, jsonObject){
        var text = jsonObject.weather[0]["description"] +', <b>temperature</b> ' + jsonObject.main.temp;
        saveWeatherInfo(req.body.lat,req.body.lng,text);
        res.send(text);
       
   });   
    } else{
      console.log('weather record found , sending database record');
      console.log(wInfo[0]["weatherdata"]);
        res.send(wInfo[0]["weatherdata"]);
    }
    
  });
});

// this method saves directionsInfo in database
function saveDirectionsInfo(src,destination,directionInfo){

  var dInfo = new DirectionsInfo({
    geocoded_waypoints: directionInfo.geocoded_waypoints,
    routes: directionInfo.routes,
    status: directionInfo.status,
    origin: src,
    destination: destination,
  });
  dInfo.save((err,doc)=>{
    if(!err){
      console.log('directionInfo saved');
    }
    else{
      console.log('Error in  Save :'+JSON.stringify(err,undefined,2));
    }
  });
}

// this method saves weatherinfo in database
function saveWeatherInfo(latitude,longitude,weatherdata){

  var wInfo = new WeatherInfo({
    latitude : latitude,
    longitude: longitude,
    weatherdata : weatherdata,
  });
  wInfo.save((err,doc)=>{
    if(!err){
      console.log('WeatherInfo saved');
    }
    else{
      console.log('Error in  Save :'+JSON.stringify(err,undefined,2));
    }
  });
}


module.exports = router;
