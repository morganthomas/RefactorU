var mongoose = require('mongoose');

var Progress = mongoose.model('progress', {
  quizzesTaken : Number,
  quizzesPassed : Number,
  wordsTranslated : Number,
  wordsCorrectlyTranslated : Number,
});

module.exports = Progress;
