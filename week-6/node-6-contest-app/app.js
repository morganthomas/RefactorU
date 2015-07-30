var express = require('express');
var bodyParser = require('body-parser');
var controllers = require('./controllers/controllers.js');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', controllers.index);
app.get('/submit', controllers.submit);
app.post('/submit-action', controllers.submitAction);
app.get('/vote', controllers.vote);
app.post('/submit-vote', controllers.submitVote);
app.get('/restart', controllers.restart);

var server = app.listen(3000, function() {
  console.log('Express server listening on port ' + server.address().port);
});
