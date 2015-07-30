var express = require('express');
// var indexController = require('./controllers/index.js');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/about', function(req, res) {
	res.render('about');
});

var server = app.listen(7353, function() {
	console.log('Express server listening on port ' + server.address().port);
});
