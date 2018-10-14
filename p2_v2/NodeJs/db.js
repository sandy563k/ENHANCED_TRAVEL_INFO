const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/WayPointsInfo',(err)=>{
if(!err)
console.log('mongodb connection succeeded');
else
  console.log('Error in DB connection :'+JSON.stringify(err,underfined,2));

});

module.exports = mongoose;
