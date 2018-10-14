const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;

var WeatherInfo = mongoose.model('WeatherInfo',{
  latitude : { type : SchemaTypes.Double},
  longitude: {type : SchemaTypes.Double},
  weatherdata : {type : String}
});

module.exports = {WeatherInfo} ;
