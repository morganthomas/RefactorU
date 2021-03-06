var express = require('express');
var bodyParser = require('body-parser');
var indexController = require('./controllers/index.js');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/lingo');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', indexController.index);
app.get('/translate', indexController.translate);
app.get('/quiz/:language/:difficulty', indexController.quiz);
app.post('/submit-quiz', indexController.submitQuiz);
app.get('/progress', indexController.progress);

var server = app.listen(3000, function() {
	console.log('Express server listening on port ' + server.address().port);
});
