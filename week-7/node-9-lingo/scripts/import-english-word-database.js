var mongoose = require('mongoose');
var fs = require('fs');

mongoose.connect('mongodb://localhost/lingo');

var EnglishWord = require('../models/english-word.js');

fs.readFile('../data/english-words.txt', 'utf8', function(err, data) {
  console.log(err);
  console.log(data);
  var lines = data.split('\n');

  lines.forEach(function(line, index) {
    var word = new EnglishWord({
      word: line,
      rank: index
    });

    word.save();
  });

  console.log("Done!");
});
