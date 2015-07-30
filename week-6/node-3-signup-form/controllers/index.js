var indexController = {
	index: function(req, res) {
		res.render('index');
	},

	formSubmit: function(req, res) {
		console.log(req.body);
		res.redirect('/success');
	},

	success: function(req, res) {
		res.render('success');
	}
};

module.exports = indexController;
