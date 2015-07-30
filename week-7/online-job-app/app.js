var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/intertrode');

var Applicant = require('./models/applicant.js');

app.get('/', function(req, res) {
	res.render('index');
});

// displays a list of applicants
app.get('/applicants', function(req, res){
	Applicant.find(function(err, applicants) {
		res.render('applicants', { applicants: applicants });
	})
});

app.get('/delete/:id', function(req, res) {
	Applicant.remove({_id: req.params.id}, function(err, doc) {
		if (err) {
			res.send("Delete failed: " + err);
		} else {
			res.redirect('/applicants');
		}
	});
})

// creates an applicant
app.post('/applicant', function(req, res){
	// Here is where you need to get the data
	// from the post body and store it in the database

	console.log(req.body);

	var applicant = new Applicant({
		name: req.body.name,
		bio: req.body.bio,
		skills: req.body.skills.split(', '),
		experience: parseInt(req.body.experience),
		why: req.body.why
	});

	console.log(applicant);

	applicant.save();

	res.redirect('/success')
});

app.get('/success', function(req, res) {
	res.render('success');
})

var server = app.listen(3000, function() {
	console.log('Express server listening on port ' + server.address().port);
});
