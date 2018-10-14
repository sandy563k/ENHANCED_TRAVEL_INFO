const mongoose = require('mongoose');

var DirectionsInfo = mongoose.model('DirectionsInfo',{
    geocoded_waypoints: { type : Array },
    routes: { type : Array },
    status: {type : String},
    origin: {type : String},
    destination: {type : String}
});

module.exports = {DirectionsInfo} ;
