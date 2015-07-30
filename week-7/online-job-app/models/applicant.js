var mongoose = require('mongoose');

var Applicant = mongoose.model('applicant', {
  name : String,
  bio : String,
  skills : Array,
  experience : Number,
  why : String
});

module.exports = Applicant;
