var express = require('express');
var bodyParser = require('body-parser');
var indexController = require('./controllers/index.js');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', indexController.index);

app.get("/page:page/:foo", function(req,res) {
	console.log(req.params)
	res.render('index')
})

app.post('/contact', function(req, res) {
	console.log(req.body.complaint);
	res.redirect('/');
});

var server = app.listen(6444, function() {
	console.log('Express server listening on port ' + server.address().port);
});
