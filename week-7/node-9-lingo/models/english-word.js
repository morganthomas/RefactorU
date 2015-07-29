var mongoose = require('mongoose');

var EnglishWord = mongoose.model('englishWord', {
  word : String,
  rank : Number
});

module.exports = EnglishWord;
