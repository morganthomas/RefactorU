var EnglishWord = require('../models/english-word.js');
var Quiz = require('../models/quiz.js');
var Progress = require('../models/progress.js');
var Random = require('../scripts/random.js');

var updateProgress = function(quiz) {
	Progress.findOne({}, function(err, progress) {
		progress = progress || new Progress({ quizzesTaken: 0, quizzesPassed: 0, wordsTranslated: 0, wordsCorrectlyTranslated: 0 });

		var numCorrect = quiz.questions.filter(function(question) {
			return question.correct;
		}).length;

		progress.quizzesTaken++;

		if (numCorrect >= 7) {
			progress.quizzesPassed++;
		}

		progress.wordsTranslated += 10;
		progress.wordsCorrectlyTranslated += numCorrect;

		console.log(progress);

		progress.save();
	});
}

var getProgressMetrics = function(callback) {
	Progress.findOne({}, function(err, progress) {
		callback([
			{
				name: 'Number of quizzes taken',
				value: progress.quizzesTaken
			},
			{
				name: 'Number of quizzes passed',
				value: progress.quizzesPassed
			},
			{
				name: 'Number of quizzes failed',
				value: progress.quizzesTaken - progress.quizzesPassed
			},
			{
				name: '% quizzes passed',
				value: (progress.quizzesTaken === 0 ? 0 : progress.quizzesPassed / progress.quizzesTaken)
					* 100 + '%'
			},
			{
				name: 'Number of words translated',
				value: progress.wordsTranslated
			},
			{
				name: 'Number of words correctly translated',
				value: progress.wordsCorrectlyTranslated
			},
			{
				name: 'Number of words incorrectly translated',
				value: progress.wordsTranslated - progress.wordsCorrectlyTranslated
			},
			{
				name: '% of words correctly translated',
				value: (progress.wordsTranslated === 0 ? 0 : progress.wordsCorrectlyTranslated / progress.wordsTranslated)
					* 100 + '%'
			}
		]);
	});
}

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

		res.send('Updated!');
	},

	progress: function(req,res) {
		getProgressMetrics(function(metrics) {
			res.render('progress', {metrics: metrics})
		});
	}
};

module.exports = indexController;
