var EnglishWord = require('../models/english-word.js');
var Random = require('../scripts/random.js');

var indexController = {
	index: function(req, res) {
		res.render('index');
	},

	translate: function(req, res) {
		res.render('translate');
	},

	quiz: function(req, res) {
		var wordPoolSize = parseInt(req.params.difficulty);
		var wordIndices = Random.randomInts(0, wordPoolSize, 10);

		EnglishWord.find({ rank: { $in: wordIndices } }, function(err, data) {
			res.render('quiz', { quizItems: data, language: req.params.language });
		});
	}
};

module.exports = indexController;
