var express = require('express');
var fs = require('fs');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
	fs.readFile('data.txt', function(err, fileContents) {
		res.header('Content-Type', 'text/html');
		res.send(fileContents);
	});
});

var server = app.listen(7955, function() {
	console.log('Express server listening on port ' + server.address().port);
});
