var EnglishWord = require('../models/english-word.js');
var Quiz = require('../models/quiz.js');
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
	},

	submitQuiz: function(req,res) {
		var questions = JSON.parse(req.body.data);
		var quiz = new Quiz({questions: questions});
		quiz.save();
		updateProgress(quiz);

		res.send('Hi!');
	}
};

module.exports = indexController;
