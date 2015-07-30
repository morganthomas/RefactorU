var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

var siteCounter = 1;

var foods = [
	{name: 'Pineapple'},
	{name: 'Haggis'},
	{name: 'Saag'}
]

app.get('/', function(req, res) {
	res.render('index', {
		counter: siteCounter,
		foods: foods
	});

	siteCounter++;
});

app.post('/addFood', function(req, res) {
	foods.push({ name: req.body.foodName });
	res.redirect('/');
})

app.post('/deleteFood/:name', function(req, res) {
	foods = foods.filter(function(food) {
		return food.name !== req.params['name'];
	});
	res.redirect('/');
})

var server = app.listen(6372, function() {
	console.log('Express server listening on port ' + server.address().port);
});
