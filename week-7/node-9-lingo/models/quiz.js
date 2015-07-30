var mongoose = require('mongoose');

var Quiz = mongoose.model('quiz', {
  questions: Array
});

module.exports = Quiz;
