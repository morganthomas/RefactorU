var Person = require('../models/person.js');

var indexController = {
	index: function(req, res) {
		Person.find({}, function(err, documents) {
			res.render('index', {characters: documents});
		});
	},

	createHero: function(req, res) {
		var hero = new Person({
			name: req.body.name,
			costume: req.body.costume,
			catchphrase: req.body.catchphrase,
			powers: req.body.powers.split(', ')
		});

		hero.save(function(err, doc) {
			res.redirect('/');			
		});
	}
};

module.exports = indexController;
