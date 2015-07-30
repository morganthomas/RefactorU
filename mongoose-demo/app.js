var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/foods')

var Plate = mongoose.model('plate', {
  name     : { type : String },
  calories : { type : Number },
  region   : { type : String },
  texture  : { type : String }
});

var sushi = new Plate({
  name: 'Sushi',
  calories: 300,
  region: 'Asia',
  texture: 'fishy'
});

sushi.save();

Plate.find({calories: 300}, function(err, plates) {
  console.log('Error: ', err);
  console.log('Plates: ', plates);
});
