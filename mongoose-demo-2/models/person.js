var mongoose = require('mongoose');

var personSchema = mongoose.Schema({
  name: {type: String},
  powers: {type: Array, default: []},
  costume: {type: String},
  catchphrase: {type: String, default: '...'}
});

var Person = mongoose.model('person', personSchema);

module.exports = Person;
